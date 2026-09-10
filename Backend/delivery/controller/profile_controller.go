package controller

import (
	"net/http"
	"tamcon-backend/domain"
	"tamcon-backend/internal/userutil"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ProfileController struct {
	userUsecase domain.StaffUserUsecase
}

func NewProfileController(userUsecase domain.StaffUserUsecase) *ProfileController {
	return &ProfileController{
		userUsecase: userUsecase,
	}
}

type profileResponse struct {
	Success bool              `json:"success" default:"true"`
	Data    *domain.StaffUser `json:"data"`
}

type passwordResponse struct {
	Success bool   `json:"success" default:"true"`
	Message string `json:"message" default:"Password updated successfully"`
}

// GetProfile GoDoc
// @Summary      Get current user profile
// @Description  Get detailed profile information of the authenticated staff member
// @Tags         profile
// @Security     BearerAuth
// @Produce      json
// @Success      200 {object} profileResponse
// @Failure      401 {object} domain.ErrorResponse
// @Failure      404 {object} domain.ErrorResponse
// @Router       /api/admin/me [get]
func (ctrl *ProfileController) GetProfile(c *gin.Context){
	userIDStr, exists := c.Get(string(userutil.UserIDKey))

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": "Unauthorized"})
		return
	}
	
	userID, err := uuid.Parse(userIDStr.(string))
	if err!= nil{
		c.JSON(http.StatusNotFound, gin.H{"success": false, "error": err.Error()})
		return
	}

	user, err := ctrl.userUsecase.GetProfile(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": user})
}

type updateProfileRequest struct {
	FirstName string `json:"first_name" binding:"required"`
	LastName  string `json:"last_name" binding:"required"`
}


// UpdateProfile GoDoc
// @Summary      Update user profile
// @Description  Update the first and last name of the authenticated staff member
// @Tags         profile
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        profile body updateProfileRequest true "Profile update payload"
// @Success      200 {object} profileResponse
// @Failure      400 {object} domain.ErrorResponse
// @Failure      401 {object} domain.ErrorResponse
// @Router       /api/admin/me [put]
func (ctrl *ProfileController) UpdateProfile(c *gin.Context) {
	userIDStr, exists := c.Get(string(userutil.UserIDKey))
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": "Unauthorized"})
		return
	}
	var req updateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Invalid request body"})
		return
	}
	userID, _ := uuid.Parse(userIDStr.(string))
	user, err := ctrl.userUsecase.UpdateProfile(c.Request.Context(), userID, req.FirstName, req.LastName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": user})
}


type updatePasswordRequest struct {
	OldPassword string `json:"old_password" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=6"`
}



// UpdatePassword GoDoc
// @Summary      Update user password
// @Description  Change the password of the authenticated staff member
// @Tags         profile
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        password body updatePasswordRequest true "Password update payload"
// @Success      200 {object} passwordResponse
// @Failure      400 {object} domain.ErrorResponse
// @Failure      401 {object} domain.ErrorResponse
// @Router       /api/admin/me/password [put]
func (ctrl *ProfileController) UpdatePassword(c *gin.Context) {
	userIDStr, exists := c.Get(string(userutil.UserIDKey))
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": "Unauthorized"})
		return
	}
	var req updatePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid request body (new password must be at least 6 characters)",
		})
		return
	}
	userID, _ := uuid.Parse(userIDStr.(string))
	err := ctrl.userUsecase.UpdatePassword(c.Request.Context(), userID, req.OldPassword, req.NewPassword)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Password updated successfully"})
}

// ListAdmins GoDoc
func (ctrl *ProfileController) ListAdmins(c *gin.Context) {
	admins, err := ctrl.userUsecase.ListAdmins(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "admins": admins})
}

type createAdminRequest struct {
	FirstName string `json:"first_name" binding:"required"`
	LastName  string `json:"last_name" binding:"required"`
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required,min=6"`
	Role      string `json:"role" binding:"required"`
}

// CreateAdmin GoDoc
func (ctrl *ProfileController) CreateAdmin(c *gin.Context) {
	role, exists := c.Get("role")
	if !exists || role.(string) != "Super Admin" {
		c.JSON(http.StatusForbidden, gin.H{"success": false, "message": "Only Super Admins can perform this action"})
		return
	}

	var req createAdminRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}

	admin, err := ctrl.userUsecase.CreateAdmin(c.Request.Context(), req.FirstName, req.LastName, req.Email, req.Password, req.Role)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"success": true, "admin": admin})
}

type updateAdminStatusRequest struct {
	Status string `json:"status" binding:"required"`
}

// UpdateAdminStatus GoDoc
func (ctrl *ProfileController) UpdateAdminStatus(c *gin.Context) {
	role, exists := c.Get("role")
	if !exists || role.(string) != "Super Admin" {
		c.JSON(http.StatusForbidden, gin.H{"success": false, "message": "Only Super Admins can perform this action"})
		return
	}

	adminIDStr := c.Param("id")
	adminID, err := uuid.Parse(adminIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid admin ID"})
		return
	}

	var req updateAdminStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid status payload"})
		return
	}

	err = ctrl.userUsecase.UpdateAdminStatus(c.Request.Context(), adminID, req.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Admin status updated"})
}