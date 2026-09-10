package controller

import (
	"mime/multipart"
	"net/http"
	"tamcon-backend/domain"
	"tamcon-backend/internal/image_utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ServiceController struct {
	serviceUsecase domain.ServiceUsecase
	uploadUsecase  domain.UploadUsecase
	imageUsecase   domain.ImageUsecase
}

func NewServiceController(serviceUsecase domain.ServiceUsecase, uploadService domain.UploadUsecase, imageUsecase domain.ImageUsecase) *ServiceController {
	return &ServiceController{
		serviceUsecase: serviceUsecase,
		uploadUsecase:  uploadService,
		imageUsecase:   imageUsecase,
	}
}

type ServiceRequest struct {
	Title        string                `json:"title" form:"title" binding:"required"`
	Description  string                `json:"description" form:"description" binding:"required"`
	Features     []string              `json:"features" form:"features" binding:"required"`
	DisplayOrder int                   `json:"display_order" form:"display_order"`
	IsPublished  bool                  `json:"is_published" form:"is_published"`
	File         *multipart.FileHeader `form:"file"`
}

type UpdateServiceRequest struct {
	Title        *string               `json:"title" form:"title"`
	Description  *string               `json:"description" form:"description"`
	Features     *[]string             `json:"features" form:"features"`
	DisplayOrder *int                  `json:"display_order" form:"display_order"`
	IsPublished  *bool                 `json:"is_published" form:"is_published"`
	File         *multipart.FileHeader `form:"file"`
}

type ImagesResponse struct {
	URL     string `json:"url"`
	IsCover bool   `json:"is_cover"`
}

type ServiceResponse struct {
	ID           uuid.UUID        `json:"id"`
	Title        string           `json:"title"`
	Description  string           `json:"description"`
	Features     []string         `json:"features"`
	DisplayOrder int              `json:"display_order"`
	IsPublished  bool             `json:"is_published"`
	Images       []ImagesResponse `json:"images"`
}

type AdminServiceResponse struct {
	ID           uuid.UUID      `json:"id"`
	Title        string         `json:"title"`
	Description  string         `json:"description"`
	Features     []string       `json:"features"`
	DisplayOrder int            `json:"display_order"`
	IsPublished  bool           `json:"is_published"`
	Images       []domain.Image `json:"images"`
}

type ServiceMutator func(*domain.Service)

func (req *UpdateServiceRequest) GetMutators() []ServiceMutator {
	var mutators []ServiceMutator

	if req.Title != nil {
		mutators = append(mutators, func(s *domain.Service) { s.Title = *req.Title })
	}
	if req.Description != nil {
		mutators = append(mutators, func(s *domain.Service) { s.Description = *req.Description })
	}
	if req.Features != nil {
		mutators = append(mutators, func(s *domain.Service) { s.Features = *req.Features })
	}
	if req.DisplayOrder != nil {
		mutators = append(mutators, func(s *domain.Service) { s.DisplayOrder = *req.DisplayOrder })
	}
	if req.IsPublished != nil {
		mutators = append(mutators, func(s *domain.Service) { s.IsPublished = *req.IsPublished })
	}

	return mutators
}

// AddService GoDoc
// @Summary      Add a new service
// @Description  Create a new service with details and cover image
// @Tags         admin service
// @Security     BearerAuth
// @Accept       json,multipart/form-data
// @Produce      json
// @Param        title formData string true "Service title"
// @Param        description formData string true "Service description"
// @Param        features formData []string false "Service features" collectionFormat(multi)
// @Param        display_order formData int false "Display order"
// @Param        is_published formData bool false "Publish status"
// @Param        file formData file false "Service cover image"
// @Success      201 {object} domain.SuccessResponse{data=domain.Service}
// @Failure      400 {object} domain.ErrorResponse
// @Router       /api/admin/service [post]
func (ctrl *ServiceController) AddService(c *gin.Context) {
	var req ServiceRequest

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

	create, err := ctrl.serviceUsecase.Create(c, &domain.Service{
		Title:        req.Title,
		Description:  req.Description,
		Features:     req.Features,
		DisplayOrder: req.DisplayOrder,
		IsPublished:  req.IsPublished,
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{
			Message: "Failed to create service",
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

			ctrl.serviceUsecase.Delete(c, create.ID)

			return
		}

		_, err := ctrl.imageUsecase.Create(c, &domain.Image{
			EntityType:         domain.EntityService,
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

			ctrl.serviceUsecase.Delete(c, create.ID)
			ctrl.uploadUsecase.Delete([]string{publicId})

			return
		}
	}

	c.JSON(http.StatusCreated, domain.SuccessResponse{
		Success: true,
		Message: "Service created successfully",
		Data:    create,
	})
}

// UpdateService GoDoc
// @Summary      Update service
// @Description  Update an existing service by ID
// @Tags         admin service
// @Security     BearerAuth
// @Accept       json,multipart/form-data
// @Produce      json
// @Param        id path string true "Service ID"
// @Param        title formData string false "Service title"
// @Param        description formData string false "Service description"
// @Param        features formData []string false "Service features" collectionFormat(multi)
// @Param        display_order formData int false "Display order"
// @Param        is_published formData bool false "Publish status"
// @Param        file formData file false "Service cover image"
// @Success      200 {object} domain.SuccessResponse{data=domain.Service}
// @Failure      400 {object} domain.ErrorResponse
// @Router       /api/admin/services/{id} [patch]
func (ctrl *ServiceController) UpdateService(c *gin.Context) {
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

	var req UpdateServiceRequest
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

	service, err := ctrl.serviceUsecase.GetByID(c, id)
	if err != nil {
		c.JSON(http.StatusNotFound, domain.ErrorResponse{
			Message: "Service not found",
			Error: &domain.ErrorDetails{
				Code:    "NOT_FOUND",
				Details: err.Error(),
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
		mutate(service)
	}

	service, err = ctrl.serviceUsecase.Update(c, service)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{
			Message: "Failed to update service details",
			Error: &domain.ErrorDetails{
				Code:    "INTERNAL_SERVER_ERROR",
				Details: err.Error(),
			},
		})
		return
	}

	if req.File != nil {
		oldImage, _ := ctrl.imageUsecase.GetCover(c, domain.EntityService, service.ID)

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
			EntityType:         domain.EntityService,
			EntityID:           service.ID,
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

	c.JSON(http.StatusOK, service)
}

// DeleteService GoDoc
// @Summary      Delete service
// @Description  Delete an existing service by ID
// @Tags         admin service
// @Security     BearerAuth
// @Produce      json
// @Param        id path string true "Service ID"
// @Success      204
// @Failure      400 {object} domain.ErrorResponse
// @Router       /api/admin/services/{id} [delete]
func (ctrl *ServiceController) DeleteService(c *gin.Context) {
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

	images, _ := ctrl.imageUsecase.ListByEntity(c, domain.EntityService, id)

	err := ctrl.serviceUsecase.Delete(c, id)

	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{
			Message: "Failed to delete service",
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

// AdminGetServices GoDoc
// @Summary      Get all services (admin)
// @Description  Get all services including unpublished services
// @Tags         admin service
// @Security     BearerAuth
// @Produce      json
// @Param        published-only query bool false "Filter only published services"
// @Success      200 {object} domain.SuccessResponse{data=[]AdminServiceResponse}
// @Failure      400 {object} domain.ErrorResponse
// @Router       /api/admin/services [get]
func (ctrl *ServiceController) AdminGetServices(c *gin.Context) {
	publishedOnly := c.Query("published-only") == "true"
	all, err := ctrl.serviceUsecase.GetAll(c, publishedOnly)

	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{
			Message: "Unable to fetch services",
			Error: &domain.ErrorDetails{
				Code:    "BAD_REQUEST",
				Details: err.Error(),
			},
		})
		return
	}

	// Map backend data to your ServiceResponse structures
	var responseData []AdminServiceResponse

	for _, service := range all {
		// fetch images for the current service
		dbImages, err := ctrl.imageUsecase.ListByEntity(c, domain.EntityService, service.ID)

		// initialize an empty slice so it returns [] instead of null in JSON if empty
		var imagesList = []domain.Image{}

		if err == nil {
			for _, img := range dbImages {
				imagesList = append(imagesList, *img)
			}
		}

		// append the fully constructed service response
		responseData = append(responseData, AdminServiceResponse{
			ID:           service.ID,
			Title:        service.Title,
			Description:  service.Description,
			Features:     service.Features,
			DisplayOrder: service.DisplayOrder,
			IsPublished:  service.IsPublished,
			Images:       imagesList,
		})
	}

	c.JSON(http.StatusOK, domain.SuccessResponse{
		Success: true,
		Data:    responseData,
	})
}

// GetServices GoDoc
// @Summary      Get published services
// @Description  Get all published services available to users
// @Tags         service
// @Produce      json
// @Success      200 {object} domain.SuccessResponse{data=[]ServiceResponse}
// @Failure      400 {object} domain.ErrorResponse
// @Router       /api/services [get]
func (ctrl *ServiceController) GetServices(c *gin.Context) {
	all, err := ctrl.serviceUsecase.GetAll(c, true)

	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{
			Message: "Unable to fetch services",
			Error: &domain.ErrorDetails{
				Code:    "BAD_REQUEST",
				Details: err.Error(),
			},
		})
		return
	}

	// Map backend data to your ServiceResponse structures
	var responseData []ServiceResponse

	for _, service := range all {
		// Fetch images for the current service
		dbImages, err := ctrl.imageUsecase.ListByEntity(c, domain.EntityService, service.ID)

		// Initialize an empty slice so it returns [] instead of null in JSON if empty
		var imagesList = []ImagesResponse{}

		if err == nil {
			for _, img := range dbImages {
				imagesList = append(imagesList, ImagesResponse{
					URL:     img.URL,
					IsCover: img.IsCover, // Ensure types match your domain image struct
				})
			}
		}

		// Append the fully constructed service response
		responseData = append(responseData, ServiceResponse{
			ID:           service.ID,
			Title:        service.Title,
			Description:  service.Description,
			Features:     service.Features,
			DisplayOrder: service.DisplayOrder,
			IsPublished:  service.IsPublished,
			Images:       imagesList,
		})
	}

	c.JSON(http.StatusOK, domain.SuccessResponse{
		Success: true,
		Data:    responseData,
	})
}
