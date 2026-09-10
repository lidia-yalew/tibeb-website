package controller

import (
	"mime/multipart"
	"net/http"
	"tamcon-backend/domain"
	"tamcon-backend/internal/image_utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ProductController struct {
	productUsecase domain.ProductUsecase
	uploadUsecase  domain.UploadUsecase
	imageUsecase   domain.ImageUsecase
}

func NewProductController(productUsecase domain.ProductUsecase, uploadService domain.UploadUsecase, imageUsecase domain.ImageUsecase) *ProductController {
	return &ProductController{
		productUsecase: productUsecase,
		uploadUsecase:  uploadService,
		imageUsecase:   imageUsecase,
	}
}

type ProductRequest struct {
	Name         string                `json:"name" form:"name" binding:"required"`
	Description  string                `json:"description" form:"description" binding:"required"`
	Category     string                `json:"category" form:"category" binding:"required"`
	WebsiteURL   string                `json:"website_url" form:"website_url" binding:"required,url"`
	DisplayOrder int                   `json:"display_order" form:"display_order"`
	IsPublished  bool                  `json:"is_published" form:"is_published"`
	File         *multipart.FileHeader `form:"file"`
}

type UpdateProductRequest struct {
	Name         *string               `json:"name" form:"name"`
	Description  *string               `json:"description" form:"description"`
	Category     *string               `json:"category" form:"category"`
	WebsiteURL   *string               `json:"website_url" form:"website_url" binding:"omitempty,url"`
	DisplayOrder *int                  `json:"display_order" form:"display_order"`
	IsPublished  *bool                 `json:"is_published" form:"is_published"`
	File         *multipart.FileHeader `form:"file"`
}

type ProductResponse struct {
	ID           uuid.UUID       `json:"id"`
	Name         string          `json:"name"`
	Description  string          `json:"description"`
	Category     string          `json:"category"`
	WebsiteURL   string          `json:"website_url"`
	DisplayOrder int             `json:"display_order"`
	IsPublished  bool            `json:"is_published"`
	Image        *ImagesResponse `json:"image"`
	CreatedAt    interface{}     `json:"created_at"`
	UpdatedAt    interface{}     `json:"updated_at"`
}

type AdminProductResponse struct {
	ID           uuid.UUID       `json:"id"`
	Name         string          `json:"name"`
	Description  string          `json:"description"`
	Category     string          `json:"category"`
	WebsiteURL   string          `json:"website_url"`
	DisplayOrder int             `json:"display_order"`
	IsPublished  bool            `json:"is_published"`
	Image        *ImagesResponse `json:"image"`
	CreatedAt    interface{}     `json:"created_at"`
	UpdatedAt    interface{}     `json:"updated_at"`
}

type ProductMutator func(*domain.Product)

func (req *UpdateProductRequest) GetMutators() []ProductMutator {
	var mutators []ProductMutator

	if req.Name != nil {
		mutators = append(mutators, func(p *domain.Product) { p.Name = *req.Name })
	}
	if req.Description != nil {
		mutators = append(mutators, func(p *domain.Product) { p.Description = *req.Description })
	}
	if req.Category != nil {
		mutators = append(mutators, func(p *domain.Product) { p.Category = *req.Category })
	}
	if req.WebsiteURL != nil {
		mutators = append(mutators, func(p *domain.Product) { p.WebsiteURL = *req.WebsiteURL })
	}
	if req.DisplayOrder != nil {
		mutators = append(mutators, func(p *domain.Product) { p.DisplayOrder = *req.DisplayOrder })
	}
	if req.IsPublished != nil {
		mutators = append(mutators, func(p *domain.Product) { p.IsPublished = *req.IsPublished })
	}

	return mutators
}

// AddProduct GoDoc
// @Summary      Add a new product
// @Description  Create a new product with details and cover image
// @Tags         admin product
// @Security     BearerAuth
// @Accept       json,multipart/form-data
// @Produce      json
// @Param        name formData string true "Product name"
// @Param        description formData string true "Product description"
// @Param        category formData string false "Product category"
// @Param        website_url formData string false "Product website URL"
// @Param        display_order formData int false "Display order"
// @Param        is_published formData bool false "Publish status"
// @Param        file formData file false "Product cover image"
// @Success      201 {object} domain.SuccessResponse{data=domain.Product}
// @Failure      400 {object} domain.ErrorResponse
// @Router       /api/admin/product [post]
func (ctrl *ProductController) AddProduct(c *gin.Context) {
	var req ProductRequest

	contentType := c.ContentType()
	var bindErr error

	if contentType == "application/json" {
		bindErr = c.ShouldBindJSON(&req)
	} else {
		// Falls back to form/multipart binding if files are included
		bindErr = c.ShouldBind(&req)
	}

	if bindErr != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{
			Message: "Invalid request format",
			Error: &domain.ErrorDetails{
				Code:    "BAD_REQUEST",
				Details: bindErr.Error(),
			},
		})
		return
	}

	file := req.File
	if file != nil {
		err := ctrl.uploadUsecase.Validate(file)

		if err != nil {
			c.JSON(http.StatusBadRequest, domain.ErrorResponse{
				Message: "Invalid file upload",
				Error: &domain.ErrorDetails{
					Code:    "BAD_REQUEST",
					Details: err.Error(),
				},
			})
			return
		}
	}

	create, err := ctrl.productUsecase.Create(c, &domain.Product{
		Name:         req.Name,
		Description:  req.Description,
		Category:     req.Category,
		WebsiteURL:   req.WebsiteURL,
		DisplayOrder: req.DisplayOrder,
		IsPublished:  req.IsPublished,
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{
			Message: "Failed to create product",
			Error: &domain.ErrorDetails{
				Code:    "INTERNAL_SERVER_ERROR",
				Details: err.Error(),
			},
		})
		return
	}

	if file != nil {
		publicId, url, uploadErr := ctrl.uploadUsecase.Upload(file)

		if uploadErr != nil {
			c.JSON(http.StatusBadRequest, domain.ErrorResponse{
				Message: "Upload error",
				Error: &domain.ErrorDetails{
					Code:    "UPLOAD_FAILED",
					Details: uploadErr.Error(),
				},
			})

			ctrl.productUsecase.Delete(c, create.ID)

			return
		}

		_, err := ctrl.imageUsecase.Create(c, &domain.Image{
			EntityType:         domain.EntityProduct,
			EntityID:           create.ID,
			URL:                url,
			CloudinaryPublicID: publicId,
			IsCover:            true,
		})

		if err != nil {
			c.JSON(http.StatusInternalServerError, domain.ErrorResponse{
				Message: "Failed to create image record",
				Error: &domain.ErrorDetails{
					Code:    "INTERNAL_SERVER_ERROR",
					Details: err.Error(),
				},
			})

			ctrl.productUsecase.Delete(c, create.ID)
			ctrl.uploadUsecase.Delete([]string{publicId})

			return
		}
	}

	c.JSON(http.StatusCreated, domain.SuccessResponse{
		Success: true,
		Message: "Product created successfully",
		Data:    create,
	})
}

// UpdateProduct GoDoc
// @Summary      Update product
// @Description  Update an existing product by ID
// @Tags         admin product
// @Security     BearerAuth
// @Accept       json,multipart/form-data
// @Produce      json
// @Param        id path string true "Product ID"
// @Param        name formData string false "Product name"
// @Param        description formData string false "Product description"
// @Param        category formData string false "Product category"
// @Param        website_url formData string false "Product website URL"
// @Param        display_order formData int false "Display order"
// @Param        is_published formData bool false "Publish status"
// @Param        file formData file false "Product cover image"
// @Success      200 {object} domain.SuccessResponse{data=domain.Product}
// @Failure      400 {object} domain.ErrorResponse
// @Router       /api/admin/products/{id} [patch]
func (ctrl *ProductController) UpdateProduct(c *gin.Context) {
	id, idErr := uuid.Parse(c.Param("id"))
	if idErr != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{
			Message: "Invalid id",
			Error: &domain.ErrorDetails{
				Code:    "BAD_REQUEST",
				Details: idErr.Error(),
			},
		})
		return
	}

	var req UpdateProductRequest
	contentType := c.ContentType()
	var bindErr error

	if contentType == "application/json" {
		bindErr = c.ShouldBindJSON(&req)
	} else {
		// Falls back to form/multipart binding if files are included
		bindErr = c.ShouldBind(&req)
	}

	if bindErr != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{
			Message: "Invalid request payload",
			Error: &domain.ErrorDetails{
				Code:    "BAD_REQUEST",
				Details: bindErr.Error(),
			},
		})
		return
	}

	product, err := ctrl.productUsecase.GetByID(c, id)
	if err != nil || product == nil {
		c.JSON(http.StatusNotFound, domain.ErrorResponse{
			Message: "Product not found",
			Error: &domain.ErrorDetails{
				Code:    "NOT_FOUND",
				Details: "Product not found",
			},
		})
		return
	}

	if req.File != nil {
		err := ctrl.uploadUsecase.Validate(req.File)

		if err != nil {
			c.JSON(http.StatusBadRequest, domain.ErrorResponse{
				Message: "Invalid file upload",
				Error: &domain.ErrorDetails{
					Code:    "BAD_REQUEST",
					Details: err.Error(),
				},
			})
			return
		}
	}

	mutators := req.GetMutators()
	for _, mutate := range mutators {
		mutate(product)
	}

	product, err = ctrl.productUsecase.Update(c, product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{
			Message: "Failed to update product details",
			Error: &domain.ErrorDetails{
				Code:    "INTERNAL_SERVER_ERROR",
				Details: err.Error(),
			},
		})
		return
	}

	if req.File != nil {
		oldImage, _ := ctrl.imageUsecase.GetCover(c, domain.EntityProduct, product.ID)

		publicID, url, err := ctrl.uploadUsecase.Upload(req.File)
		if err != nil {
			c.JSON(http.StatusInternalServerError, domain.ErrorResponse{
				Message: "Failed to upload file asset",
				Error:   &domain.ErrorDetails{Code: "UPLOAD_FAILED", Details: err.Error()},
			})
			return
		}

		if oldImage != nil {
			_ = ctrl.imageUsecase.Delete(c, oldImage.ID)
		}

		_, err = ctrl.imageUsecase.Create(c, &domain.Image{
			EntityType:         domain.EntityProduct,
			EntityID:           product.ID,
			URL:                url,
			CloudinaryPublicID: publicID,
			IsCover:            true,
		})

		if err != nil {
			ctrl.uploadUsecase.Delete([]string{publicID})
			c.JSON(http.StatusInternalServerError, domain.ErrorResponse{
				Message: "Failed to save new image reference",
				Error:   &domain.ErrorDetails{Code: "INTERNAL_SERVER_ERROR", Details: err.Error()},
			})
			return
		}

		if oldImage != nil {
			ctrl.uploadUsecase.Delete([]string{oldImage.CloudinaryPublicID})
		}
	}

	c.JSON(http.StatusOK, product)
}

// DeleteProduct GoDoc
// @Summary      Delete product
// @Description  Delete an existing product by ID
// @Tags         admin product
// @Security     BearerAuth
// @Produce      json
// @Param        id path string true "Product ID"
// @Success      204
// @Failure      400 {object} domain.ErrorResponse
// @Router       /api/admin/products/{id} [delete]
func (ctrl *ProductController) DeleteProduct(c *gin.Context) {
	id, idErr := uuid.Parse(c.Param("id"))

	if idErr != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{
			Message: "Invalid id",
			Error: &domain.ErrorDetails{
				Code:    "BAD_REQUEST",
				Details: idErr.Error(),
			},
		})
		return
	}

	images, _ := ctrl.imageUsecase.ListByEntity(c, domain.EntityProduct, id)

	err := ctrl.productUsecase.Delete(c, id)

	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{
			Message: "Failed to delete product",
			Error: &domain.ErrorDetails{
				Code:    "BAD_REQUEST",
				Details: err.Error(),
			},
		})
		return
	}

	if images != nil {
		image_utils.HandleImageCleanup(images, ctrl.uploadUsecase, ctrl.imageUsecase)
	}

	c.JSON(http.StatusNoContent, nil)
}

// AdminGetProducts GoDoc
// @Summary      Get all products (admin)
// @Description  Get all products including unpublished products
// @Tags         admin product
// @Security     BearerAuth
// @Produce      json
// @Param        published-only query bool false "Filter only published products"
// @Success      200 {object} domain.SuccessResponse{data=[]AdminProductResponse}
// @Failure      400 {object} domain.ErrorResponse
// @Router       /api/admin/products [get]
func (ctrl *ProductController) AdminGetProducts(c *gin.Context) {
	publishedOnly := c.Query("published-only") == "true"
	all, err := ctrl.productUsecase.GetAll(c, publishedOnly)

	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{
			Message: "Unable to fetch products",
			Error: &domain.ErrorDetails{
				Code:    "BAD_REQUEST",
				Details: err.Error(),
			},
		})
		return
	}

	// Map backend data to AdminProductResponse structures
	var responseData = []AdminProductResponse{}

	for _, product := range all {
		// Fetch cover image for the current product
		dbImage, _ := ctrl.imageUsecase.GetCover(c, domain.EntityProduct, product.ID)

		var imageResponse *ImagesResponse
		if dbImage != nil {
			imageResponse = &ImagesResponse{
				URL:     dbImage.URL,
				IsCover: dbImage.IsCover,
			}
		}

		// Append the fully constructed product response
		responseData = append(responseData, AdminProductResponse{
			ID:           product.ID,
			Name:         product.Name,
			Description:  product.Description,
			Category:     product.Category,
			WebsiteURL:   product.WebsiteURL,
			DisplayOrder: product.DisplayOrder,
			IsPublished:  product.IsPublished,
			Image:        imageResponse,
			CreatedAt:    product.CreatedAt,
			UpdatedAt:    product.UpdatedAt,
		})
	}

	c.JSON(http.StatusOK, domain.SuccessResponse{
		Success: true,
		Data:    responseData,
	})
}

// GetProducts GoDoc
// @Summary      Get published products
// @Description  Get all published products available to users
// @Tags         product
// @Produce      json
// @Success      200 {object} domain.SuccessResponse{data=[]ProductResponse}
// @Failure      400 {object} domain.ErrorResponse
// @Router       /api/products [get]
func (ctrl *ProductController) GetProducts(c *gin.Context) {
	all, err := ctrl.productUsecase.GetAll(c, true)

	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{
			Message: "Unable to fetch products",
			Error: &domain.ErrorDetails{
				Code:    "BAD_REQUEST",
				Details: err.Error(),
			},
		})
		return
	}

	// Map backend data to ProductResponse structures
	var responseData = []ProductResponse{}

	for _, product := range all {
		// Fetch cover image for the current product
		dbImage, _ := ctrl.imageUsecase.GetCover(c, domain.EntityProduct, product.ID)

		var imageResponse *ImagesResponse
		if dbImage != nil {
			imageResponse = &ImagesResponse{
				URL:     dbImage.URL,
				IsCover: dbImage.IsCover,
			}
		}

		// Append the fully constructed product response
		responseData = append(responseData, ProductResponse{
			ID:           product.ID,
			Name:         product.Name,
			Description:  product.Description,
			Category:     product.Category,
			WebsiteURL:   product.WebsiteURL,
			DisplayOrder: product.DisplayOrder,
			IsPublished:  product.IsPublished,
			Image:        imageResponse,
			CreatedAt:    product.CreatedAt,
			UpdatedAt:    product.UpdatedAt,
		})
	}

	c.JSON(http.StatusOK, domain.SuccessResponse{
		Success: true,
		Data:    responseData,
	})
}
