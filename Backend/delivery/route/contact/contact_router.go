package contact

import (
	"time"

	"tamcon-backend/config"
	"tamcon-backend/delivery/controller"
	"tamcon-backend/delivery/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NewContactRouter(
	cfg *config.Config,
	timeout time.Duration,
	db *gorm.DB,
	publicGroup *gin.RouterGroup,
	protectedGroup *gin.RouterGroup,
	ctrl *controller.ContactMessageController,
) {
	publicGroup.POST("/contacts", middleware.RateLimitMiddleware(5), ctrl.Submit)

	protectedGroup.GET("/contacts", ctrl.List)
	protectedGroup.PUT("/contacts/:id/status", ctrl.UpdateStatus)
	protectedGroup.DELETE("/contacts/:id", ctrl.Delete)
}
