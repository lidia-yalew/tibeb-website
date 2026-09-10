package auth

import (
	"time"

	"tamcon-backend/config"
	"tamcon-backend/delivery/controller"
	"tamcon-backend/delivery/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NewLoginRouter(
	cfg *config.Config,
	timeout time.Duration,
	db *gorm.DB,
	publicGroup *gin.RouterGroup,
	protectedGroup *gin.RouterGroup,
	authController *controller.AuthController,
) {
	publicGroup.POST("/admin/login",middleware.RateLimitMiddleware(5), authController.Login)
}
