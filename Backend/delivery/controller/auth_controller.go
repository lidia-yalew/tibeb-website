package controller

import (
	"net/http"

	"tamcon-backend/config"
	"tamcon-backend/domain"

	"github.com/gin-gonic/gin"
)

type AuthController struct {
	authUsecase domain.AuthUsecase
}

func NewAuthController(authUsecase domain.AuthUsecase) *AuthController {
	return &AuthController{
		authUsecase: authUsecase,
	}
}

type loginRequest struct {
	Email    string `json:"email" binding:"required,email" example:"admin@gmail.com"`
	Password string `json:"password" binding:"required" example:"admin@1234"`
}

type forgotPasswordRequest struct {
	Email string `json:"email" binding:"required,email" example:"admin@gmail.com"`
}

type resetPasswordRequest struct {
	Token       string `json:"token" binding:"required"`
	NewPassword string `json:"newPassword" binding:"required,min=6"`
}

type loginResponse struct {
	Success bool `json:"success" default:"true"`
	Data    struct {
		AccessToken string            `json:"access_token"`
		User        *domain.StaffUser `json:"user"`
	} `json:"data"`
}

type refreshResponse struct {
	Success bool `json:"success" default:"true"`
	Data    struct {
		AccessToken string `json:"access_token"`
	} `json:"data"`
}

type logoutResponse struct {
	Success bool   `json:"success" default:"true"`
	Message string `json:"message"`
}

// Login GoDoc
// @Summary      User Login
// @Description  Authenticate user and return JWT access token, and set refresh token cookie
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        credentials body loginRequest true "Login credentials"
// @Success      200 {object} loginResponse
// @Failure      400 {object} domain.ErrorResponse
// @Failure      401 {object} domain.ErrorResponse
// @Router       /api/admin/login [post]
func (ctrl *AuthController) Login(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "BAD_REQUEST",
				"message": "Invalid email or password format",
			},
		})
		return
	}

	user, accessToken, refreshToken, err := ctrl.authUsecase.Login(c.Request.Context(), req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "UNAUTHORIZED",
				"message": err.Error(),
			},
		})
		return
	}

	c.SetCookie(
		"access_token",
		accessToken,
		int(config.Get().JWTAccess.Seconds()),
		"/",
		"",
		!config.Get().IsDev(),
		true,
	)

	c.SetCookie(
		"refresh_token",
		refreshToken,
		int(config.Get().JWTRefreshTTL.Seconds()),
		"/",
		"",
		!config.Get().IsDev(),
		true,
	)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"access_token": accessToken,
			"user":         user,
		},
	})
}

// Refresh GoDoc
// @Summary      Refresh Access Token
// @Description  Generate a new access token using the refresh token cookie
// @Tags         auth
// @Produce      json
// @Success      200 {object} refreshResponse
// @Failure      400 {object} domain.ErrorResponse
// @Failure      401 {object} domain.ErrorResponse
// @Router       /api/admin/refresh [post]
func (ctrl *AuthController) Refresh(c *gin.Context) {
	cookie, err := c.Cookie("refresh_token")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "BAD_REQUEST",
				"message": "Refresh token is missing from request cookies",
			},
		})
		return
	}

	newAccessToken, newRefreshToken, err := ctrl.authUsecase.RefreshToken(c.Request.Context(), cookie)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "UNAUTHORIZED",
				"message": err.Error(),
			},
		})
		return
	}

	c.SetCookie(
		"access_token",
		newAccessToken,
		int(config.Get().JWTAccess.Seconds()),
		"/",
		"",
		!config.Get().IsDev(),
		true,
	)

	c.SetCookie(
		"refresh_token",
		newRefreshToken,
		int(config.Get().JWTRefreshTTL.Seconds()),
		"/",
		"",
		!config.Get().IsDev(),
		true,
	)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"access_token": newAccessToken,
		},
	})
}

// Logout GoDoc
// @Summary      User Logout
// @Description  Revoke the user refresh token and clear cookie
// @Tags         auth
// @Produce      json
// @Param        all query bool false "Revoke all sessions/devices"
// @Success      200 {object} logoutResponse
// @Router       /api/admin/logout [post]
func (ctrl *AuthController) Logout(c *gin.Context) {

	allDevices := c.Query("all") == "true"

	cookie, err := c.Cookie("refresh_token")
	if err == nil {
		_ = ctrl.authUsecase.Logout(c.Request.Context(), cookie, allDevices)
	}

	c.SetCookie(
		"access_token",
		"",
		-1,
		"/",
		"",
		!config.Get().IsDev(),
		true,
	)
	c.SetCookie(
		"refresh_token",
		"",
		-1,
		"/",
		"",
		!config.Get().IsDev(),
		true,
	)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Successfully logged out",
	})
}

// ForgotPassword GoDoc
// @Summary      Request Password Reset
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        email body forgotPasswordRequest true "Email address"
// @Success      200 {object} logoutResponse
// @Router       /api/v1/auth/forgot-password [post]
func (ctrl *AuthController) ForgotPassword(c *gin.Context) {
	var req forgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{
			Success: false,
			Message: "Invalid email format",
		})
		return
	}

	err := ctrl.authUsecase.ForgotPassword(c.Request.Context(), req.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{
			Success: false,
			Message: "Failed to process request",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "If an account with that email exists, a reset link has been sent.",
	})
}

// ResetPassword GoDoc
// @Summary      Reset Password
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        credentials body resetPasswordRequest true "Reset credentials"
// @Success      200 {object} logoutResponse
// @Router       /api/v1/auth/reset-password [post]
func (ctrl *AuthController) ResetPassword(c *gin.Context) {
	var req resetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{
			Success: false,
			Message: "Invalid request payload",
		})
		return
	}

	err := ctrl.authUsecase.ResetPassword(c.Request.Context(), req.Token, req.NewPassword)
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{
			Success: false,
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Password has been reset successfully.",
	})
}
