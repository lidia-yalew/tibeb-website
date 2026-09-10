package auth

import (
	"tamcon-backend/delivery/controller"
	"github.com/gin-gonic/gin"
)

func NewForgotPasswordRouter(publicGroup *gin.RouterGroup, authController *controller.AuthController) {
	authGroup := publicGroup.Group("/auth")
	{
		authGroup.POST("/forgot-password", authController.ForgotPassword)
		authGroup.POST("/reset-password", authController.ResetPassword)
	}
}
