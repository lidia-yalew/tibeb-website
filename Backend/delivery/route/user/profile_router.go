package user

import (
	"tamcon-backend/config"
	"tamcon-backend/delivery/controller"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NewProfileRouter(
	cfg *config.Config,
	timeout time.Duration,
	db *gorm.DB,
	publicGroup *gin.RouterGroup,
	protectedGroup *gin.RouterGroup,
	profileController *controller.ProfileController,
) {
	protectedGroup.GET("/me", profileController.GetProfile)
	protectedGroup.PUT("/me", profileController.UpdateProfile)
	protectedGroup.PUT("/me/password", profileController.UpdatePassword)

	// Admin management endpoints
	protectedGroup.GET("/admins", profileController.ListAdmins)
	protectedGroup.POST("/admins", profileController.CreateAdmin)
	protectedGroup.PUT("/admins/:id/status", profileController.UpdateAdminStatus)
}