package auth

import (
	"time"

	"tamcon-backend/config"
	"tamcon-backend/delivery/controller"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NewLogoutRouter(
	cfg *config.Config,
	timeout time.Duration,
	db *gorm.DB,
	publicGroup *gin.RouterGroup,
	protectedGroup *gin.RouterGroup,
	authController *controller.AuthController,
) {
	protectedGroup.POST("/logout", authController.Logout)
}
