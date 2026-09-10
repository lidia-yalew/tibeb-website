package controller

import (
	"fmt"
	"strings"
	"mime/multipart"
	"net/http"
	"tamcon-backend/domain"
	"tamcon-backend/internal/image_utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type BlogNewsController struct {
	blogNewsUsecase domain.BlogNewsUsecase
	uploadUsecase   domain.UploadUsecase
	imageUsecase    domain.ImageUsecase
}

func NewBlogNewsController(
	blogNewsUsecase domain.BlogNewsUsecase,
	uploadUsecase domain.UploadUsecase,
	imageUsecase domain.ImageUsecase,
) *BlogNewsController {
	return &BlogNewsController{
		blogNewsUsecase: blogNewsUsecase,
		uploadUsecase:   uploadUsecase,
		imageUsecase:    imageUsecase,
	}
}

type BlogNewsRequest struct {
	Category     string                  `form:"category" binding:"required,oneof=blog news"`
	Title        string                  `form:"title" binding:"required"`
	Excerpt      string                  `form:"excerpt"`
	Content      string                  `form:"content" binding:"required"`
	AuthorName   string                  `form:"author_name" binding:"required"`
	Source       string                  `form:"source"`
	DisplayOrder int                     `form:"display_order"`
	IsPublished  bool                    `form:"is_published"`
	Cover        *multipart.FileHeader   `form:"cover"`
	Gallery      []*multipart.FileHeader `form:"gallery"`
}

type UpdateBlogNewsRequest struct {
	Category     *string                 `form:"category" binding:"omitempty,oneof=blog news"`
	Title        *string                 `form:"title"`
	Excerpt      *string                 `form:"excerpt"`
	Content      *string                 `form:"content"`
	AuthorName   *string                 `form:"author_name"`
	Source       *string                 `form:"source"`
	DisplayOrder *int                    `form:"display_order"`
	IsPublished  *bool                   `form:"is_published"`
	Cover        *multipart.FileHeader   `form:"cover"`
	Gallery      []*multipart.FileHeader `form:"gallery"`
}

type PostWithImagesItem struct {
	Post   *domain.BlogNews `json:"post"`
	Images []ImagesResponse `json:"images"`
}

type AdminPostWithImagesItem struct {
	Post   *domain.BlogNews `json:"post"`
	Images []domain.Image   `json:"images"`
}

// Create GoDoc
// @Summary      Create blog or news post
// @Description  Create a new post with cover image and optional gallery images
// @Tags         admin blog_news
// @Security     BearerAuth
// @Accept       multipart/form-data
// @Produce      json
// @Param        category     formData string true  "Post type: blog or news"
// @Param        title        formData string true  "Post title"
// @Param        content      formData string true  "Post content (HTML)"
// @Param        author_name  formData string true  "Author name"
// @Param        excerpt      formData string false "Short summary"
// @Param        source       formData string false "News source (news only)"
// @Param        display_order formData int   false "Display order"
// @Param        is_published formData bool  false "Publish immediately"
// @Param        cover        formData file  false "Cover image"
// @Param        gallery      formData file  false "Gallery images (multiple)"
// @Success      201 {object} domain.SuccessResponse{data=domain.BlogNews}
// @Failure      400 {object} domain.ErrorResponse
// @Failure      500 {object} domain.ErrorResponse
// @Router       /api/admin/blog-news [post]
func (ctrl *BlogNewsController) Create(c *gin.Context) {
	var req BlogNewsRequest
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{
			Message: "Invalid request",
			Error:   &domain.ErrorDetails{Code: "BAD_REQUEST", Details: err.Error()},
		})
		return
	}

	if req.Cover != nil {
		if err := ctrl.uploadUsecase.Validate(req.Cover); err != nil {
			c.JSON(http.StatusBadRequest, domain.ErrorResponse{
				Message: "Invalid cover image",
				Error:   &domain.ErrorDetails{Code: "BAD_REQUEST", Details: err.Error()},
			})
			return
		}
	}

	post, err := ctrl.blogNewsUsecase.Create(c.Request.Context(), &domain.BlogNews{
		Category:     req.Category,
		Title:        req.Title,
		Excerpt:      req.Excerpt,
		Content:      req.Content,
		AuthorName:   req.AuthorName,
		Source:       req.Source,
		DisplayOrder: req.DisplayOrder,
		IsPublished:  req.IsPublished,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{
			Message: "Failed to create post",
			Error:   &domain.ErrorDetails{Code: "INTERNAL_SERVER_ERROR", Details: err.Error()},
		})
		return
	}

	if req.Cover != nil {
		publicID, url, uploadErr := ctrl.uploadUsecase.Upload(req.Cover)
		if uploadErr != nil {
			ctrl.blogNewsUsecase.Delete(c.Request.Context(), post.ID)
			c.JSON(http.StatusBadRequest, domain.ErrorResponse{
				Message: "Cover upload failed",
				Error:   &domain.ErrorDetails{Code: "UPLOAD_FAILED", Details: uploadErr.Error()},
			})
			return
		}
		_, dbErr := ctrl.imageUsecase.Create(c.Request.Context(), &domain.Image{
			EntityType:         domain.EntityBlogNews,
			EntityID:           post.ID,
			URL:                url,
			CloudinaryPublicID: publicID,
			IsCover:            true,
		})
		if dbErr != nil {
			ctrl.uploadUsecase.Delete([]string{publicID})
			ctrl.blogNewsUsecase.Delete(c.Request.Context(), post.ID)
			c.JSON(http.StatusInternalServerError, domain.ErrorResponse{
				Message: "Failed to save cover image",
				Error:   &domain.ErrorDetails{Code: "INTERNAL_SERVER_ERROR", Details: dbErr.Error()},
			})
			return
		}
	}

	var galleryFailures []domain.BulkUploadError
	if len(req.Gallery) > 0 {
		successes, failures := ctrl.uploadUsecase.BulkUpload(req.Gallery)
		galleryFailures = failures

		for _, result := range successes {
			_, dbErr := ctrl.imageUsecase.Create(c.Request.Context(), &domain.Image{
				EntityType:         domain.EntityBlogNews,
				EntityID:           post.ID,
				URL:                result.URL,
				CloudinaryPublicID: result.PublicID,
				IsCover:            false,
			})
			if dbErr != nil {
				ctrl.uploadUsecase.Delete([]string{result.PublicID})
			}
		}
	}

	c.JSON(http.StatusCreated, gin.H{
		"success":          true,
		"message":          "Post created successfully",
		"data":             post,
		"gallery_failures": galleryFailures,
	})
}

// Update GoDoc
// @Summary      Update blog or news post
// @Description  Update post fields, replace cover, or add more gallery images
// @Tags         admin blog_news
// @Security     BearerAuth
// @Accept       multipart/form-data
// @Produce      json
// @Param        id path string true "Post ID"
// @Success      200 {object} domain.SuccessResponse{data=domain.BlogNews}
// @Failure      400 {object} domain.ErrorResponse
// @Failure      404 {object} domain.ErrorResponse
// @Router       /api/admin/blog-news/{id} [put]
func (ctrl *BlogNewsController) Update(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{
			Message: "Invalid ID",
			Error:   &domain.ErrorDetails{Code: "BAD_REQUEST", Details: err.Error()},
		})
		return
	}

	post, err := ctrl.blogNewsUsecase.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, domain.ErrorResponse{
			Message: "Post not found",
			Error:   &domain.ErrorDetails{Code: "NOT_FOUND", Details: err.Error()},
		})
		return
	}

	var req UpdateBlogNewsRequest
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{
			Message: "Invalid request",
			Error:   &domain.ErrorDetails{Code: "BAD_REQUEST", Details: err.Error()},
		})
		return
	}

	if req.Category != nil {
		post.Category = *req.Category
	}
	if req.Title != nil {
		post.Title = *req.Title
	}
	if req.Excerpt != nil {
		post.Excerpt = *req.Excerpt
	}
	if req.Content != nil {
		post.Content = *req.Content
	}
	if req.AuthorName != nil {
		post.AuthorName = *req.AuthorName
	}
	if req.Source != nil {
		post.Source = *req.Source
	}
	if req.DisplayOrder != nil {
		post.DisplayOrder = *req.DisplayOrder
	}
	if req.IsPublished != nil {
		post.IsPublished = *req.IsPublished
	}

	post, err = ctrl.blogNewsUsecase.Update(c.Request.Context(), post)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{
			Message: "Failed to update post",
			Error:   &domain.ErrorDetails{Code: "INTERNAL_SERVER_ERROR", Details: err.Error()},
		})
		return
	}

	if req.Cover != nil {
		oldCover, _ := ctrl.imageUsecase.GetCover(c.Request.Context(), domain.EntityBlogNews, post.ID)

		publicID, url, uploadErr := ctrl.uploadUsecase.Upload(req.Cover)
		if uploadErr != nil {
			c.JSON(http.StatusInternalServerError, domain.ErrorResponse{
				Message: "Cover upload failed",
				Error:   &domain.ErrorDetails{Code: "UPLOAD_FAILED", Details: uploadErr.Error()},
			})
			return
		}

		if oldCover != nil {
			_ = ctrl.imageUsecase.Delete(c.Request.Context(), oldCover.ID)
		}

		_, dbErr := ctrl.imageUsecase.Create(c.Request.Context(), &domain.Image{
			EntityType:         domain.EntityBlogNews,
			EntityID:           post.ID,
			URL:                url,
			CloudinaryPublicID: publicID,
			IsCover:            true,
		})
		if dbErr != nil {
			ctrl.uploadUsecase.Delete([]string{publicID})
			c.JSON(http.StatusInternalServerError, domain.ErrorResponse{
				Message: "Failed to save new cover",
				Error:   &domain.ErrorDetails{Code: "INTERNAL_SERVER_ERROR", Details: dbErr.Error()},
			})
			return
		}

		if oldCover != nil {
			ctrl.uploadUsecase.Delete([]string{oldCover.CloudinaryPublicID})
		}
	}

	var galleryFailures []domain.BulkUploadError
	if len(req.Gallery) > 0 {
		successes, failures := ctrl.uploadUsecase.BulkUpload(req.Gallery)
		galleryFailures = failures

		for _, result := range successes {
			_, dbErr := ctrl.imageUsecase.Create(c.Request.Context(), &domain.Image{
				EntityType:         domain.EntityBlogNews,
				EntityID:           post.ID,
				URL:                result.URL,
				CloudinaryPublicID: result.PublicID,
				IsCover:            false,
			})
			if dbErr != nil {
				ctrl.uploadUsecase.Delete([]string{result.PublicID})
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success":          true,
		"message":          "Post updated successfully",
		"data":             post,
		"gallery_failures": galleryFailures,
	})
}

// Delete GoDoc
// @Summary      Delete blog or news post
// @Tags         admin blog_news
// @Security     BearerAuth
// @Produce      json
// @Param        id path string true "Post ID"
// @Success      200 {object} domain.SuccessResponse
// @Failure      400 {object} domain.ErrorResponse
// @Router       /api/admin/blog-news/{id} [delete]
func (ctrl *BlogNewsController) Delete(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{
			Message: "Invalid ID",
			Error:   &domain.ErrorDetails{Code: "BAD_REQUEST", Details: err.Error()},
		})
		return
	}

	images, _ := ctrl.imageUsecase.ListByEntity(c.Request.Context(), domain.EntityBlogNews, id)

	if err := ctrl.blogNewsUsecase.Delete(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{
			Message: "Failed to delete post",
			Error:   &domain.ErrorDetails{Code: "INTERNAL_SERVER_ERROR", Details: err.Error()},
		})
		return
	}

	if images != nil {
		image_utils.HandleImageCleanup(images, ctrl.uploadUsecase, ctrl.imageUsecase)
	}

	c.JSON(http.StatusOK, domain.SuccessResponse{
		Success: true,
		Message: "Post deleted successfully",
	})
}

// GetByID GoDoc
// @Summary      Get post by ID (admin)
// @Tags         admin blog_news
// @Security     BearerAuth
// @Produce      json
// @Param        id path string true "Post ID"
// @Success      200 {object} domain.SuccessResponse{data=domain.BlogNews}
// @Failure      404 {object} domain.ErrorResponse
// @Router       /api/admin/blog-news/{id} [get]
func (ctrl *BlogNewsController) GetByID(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{
			Message: "Invalid ID",
			Error:   &domain.ErrorDetails{Code: "BAD_REQUEST", Details: err.Error()},
		})
		return
	}

	post, err := ctrl.blogNewsUsecase.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, domain.ErrorResponse{
			Message: "Post not found",
			Error:   &domain.ErrorDetails{Code: "NOT_FOUND", Details: err.Error()},
		})
		return
	}

	images, _ := ctrl.imageUsecase.ListByEntity(c.Request.Context(), domain.EntityBlogNews, post.ID)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    post,
		"images":  images,
	})
}

// List GoDoc
// @Summary      List posts (admin)
// @Tags         admin blog_news
// @Security     BearerAuth
// @Produce      json
// @Param        category query string false "Filter by: blog or news"
// @Param        status   query string false "Filter by: published or unpublished"
// @Success      200 {object} domain.SuccessResponse{data=[]AdminPostWithImagesItem}
// @Failure      500 {object} domain.ErrorResponse
// @Router       /api/admin/blog-news [get]
func (ctrl *BlogNewsController) List(c *gin.Context) {
	category := c.Query("category")
	onlyPublished := c.Query("status") == "published"

	posts, err := ctrl.blogNewsUsecase.GetAll(c.Request.Context(), category, onlyPublished)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{
			Message: "Failed to fetch posts",
			Error:   &domain.ErrorDetails{Code: "INTERNAL_SERVER_ERROR", Details: err.Error()},
		})
		return
	}

	responseList := make([]AdminPostWithImagesItem, len(posts))

	// Map each post and its image array explicitly
	for i, post := range posts {
		dbImages, _ := ctrl.imageUsecase.ListByEntity(c.Request.Context(), domain.EntityBlogNews, post.ID)
		images := []domain.Image{}

		if dbImages != nil {
			for _, img := range dbImages {
				images = append(images, *img)
			}
		}

		responseList[i] = AdminPostWithImagesItem{
			Post:   &posts[i],
			Images: images,
		}
	}

	c.JSON(http.StatusOK, domain.SuccessResponse{
		Success: true,
		Message: "Posts retrieved successfully",
		Data:    responseList,
	})
}

// GetPublished GoDoc
// @Summary      List published posts (public)
// @Tags         blog_news
// @Produce      json
// @Param        category query string false "Filter by: blog or news"
// @Success      200 {object} domain.SuccessResponse{data=[]PostWithImagesItem}
// @Router       /api/blog-news [get]
func (ctrl *BlogNewsController) GetPublished(c *gin.Context) {
	category := c.Query("category")

	posts, err := ctrl.blogNewsUsecase.GetAll(c.Request.Context(), category, true)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{
			Message: "Failed to fetch posts",
			Error:   &domain.ErrorDetails{Code: "INTERNAL_SERVER_ERROR", Details: err.Error()},
		})
		return
	}

	// Pre-allocate array slice memory
	responseList := make([]PostWithImagesItem, len(posts))

	// Map each post and its image array explicitly
	for i, post := range posts {
		dbImages, _ := ctrl.imageUsecase.ListByEntity(c.Request.Context(), domain.EntityBlogNews, post.ID)
		images := []ImagesResponse{}

		if dbImages != nil {
			for _, img := range dbImages {
				images = append(images, ImagesResponse{
					URL:     img.URL,
					IsCover: img.IsCover,
				})
			}
		}

		responseList[i] = PostWithImagesItem{
			Post:   &posts[i],
			Images: images,
		}
	}

	// Output uniform wrapper data structure
	c.JSON(http.StatusOK, domain.SuccessResponse{
		Success: true,
		Data:    responseList,
	})
}

// GetBySlug GoDoc
// @Summary      Get post by slug (public)
// @Tags         blog_news
// @Produce      json
// @Param        slug path string true "Post slug"
// @Success      200 {object} domain.SuccessResponse{data=domain.BlogNews}
// @Failure      404 {object} domain.ErrorResponse
// @Router       /api/blog-news/{slug} [get]
func (ctrl *BlogNewsController) GetBySlug(c *gin.Context) {
	slug := c.Param("slug")

	post, err := ctrl.blogNewsUsecase.GetBySlug(c.Request.Context(), slug)
	if err != nil {
		c.JSON(http.StatusNotFound, domain.ErrorResponse{
			Message: "Post not found",
			Error:   &domain.ErrorDetails{Code: "NOT_FOUND", Details: err.Error()},
		})
		return
	}

	images, _ := ctrl.imageUsecase.ListByEntity(c.Request.Context(), domain.EntityBlogNews, post.ID)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    post,
		"images":  images,
	})
}

// TogglePublish GoDoc
// @Summary      Toggle publish status
// @Tags         admin blog_news
// @Security     BearerAuth
// @Produce      json
// @Param        id path string true "Post ID"
// @Success      200 {object} domain.SuccessResponse{data=domain.BlogNews}
// @Failure      400 {object} domain.ErrorResponse
// @Router       /api/admin/blog-news/{id}/publish [patch]
func (ctrl *BlogNewsController) TogglePublish(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{
			Message: "Invalid ID",
			Error:   &domain.ErrorDetails{Code: "BAD_REQUEST", Details: err.Error()},
		})
		return
	}

	post, err := ctrl.blogNewsUsecase.TogglePublish(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{
			Message: "Failed to toggle publish status",
			Error:   &domain.ErrorDetails{Code: "INTERNAL_SERVER_ERROR", Details: err.Error()},
		})
		return
	}

	c.JSON(http.StatusOK, domain.SuccessResponse{
		Success: true,
		Message: "Publish status toggled",
		Data:    post,
	})
}

func makeSlug(title string) string {
	var result []rune
	for _, r := range strings.ToLower(title) {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') {
			result = append(result, r)
		} else if r == ' ' || r == '-' || r == '_' {
			if len(result) > 0 && result[len(result)-1] != '-' {
				result = append(result, '-')
			}
		}
	}
	s := strings.Trim(string(result), "-")
	if s == "" {
		s = "post"
	}
	return fmt.Sprintf("%s-%s", s, uuid.New().String()[:8])
}
