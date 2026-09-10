package controller

import (
	"log"
	"net/http"
	"tamcon-backend/domain"
	"tamcon-backend/internal/image_utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ImageController struct {
	uploadUsecase domain.UploadUsecase
	imageUsecase  domain.ImageUsecase
}

func NewImageController(uploadService domain.UploadUsecase, imageUsecase domain.ImageUsecase) *ImageController {
	return &ImageController{
		uploadUsecase: uploadService,
		imageUsecase:  imageUsecase,
	}
}

func (ctrl *ImageController) UploadImage(c *gin.Context) {
	fileHeader, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "No image file provided in multipart body",
		})
		return
	}

	if ctrl.uploadUsecase == nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"success": false,
			"error":   "Cloudinary storage is not configured on server",
		})
		return
	}

	publicID, url, err := ctrl.uploadUsecase.Upload(fileHeader)
	if err != nil {
		log.Printf("Cloudinary upload failed: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Cloudinary upload failed: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":              true,
		"url":                  url,
		"cloudinary_public_id": publicID,
	})
}

func (ctrl *ImageController) DeleteImage(c *gin.Context) {
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

	image, imgErr := ctrl.imageUsecase.GetByID(c, id)

	if imgErr == nil {
		images := []*domain.Image{image}
		image_utils.HandleImageCleanup(images, ctrl.uploadUsecase, ctrl.imageUsecase)
	} else {
		c.JSON(http.StatusNotFound, domain.ErrorResponse{
			Message: "Image not found",
			Error: &domain.ErrorDetails{
				Code: "NOT_FOUND",
			},
		})
	}

	c.JSON(http.StatusNoContent, nil)
}
