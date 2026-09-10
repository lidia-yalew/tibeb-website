package image

import (
	"tamcon-backend/config"
	"tamcon-backend/delivery/controller"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NewImageRouter(
	cfg *config.Config,
	timeout time.Duration,
	db *gorm.DB,
	publicGroup *gin.RouterGroup,
	protectedGroup *gin.RouterGroup,
	imageController *controller.ImageController,
) {
	protectedGroup.POST("/upload", imageController.UploadImage)
	protectedGroup.DELETE("/images/:id", imageController.DeleteImage)
}
