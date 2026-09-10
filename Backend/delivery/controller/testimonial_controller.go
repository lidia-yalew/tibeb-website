package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"tamcon-backend/domain"
)

type TestimonialController struct {
	u domain.TestimonialUsecase
}

func NewTestimonialController(u domain.TestimonialUsecase) *TestimonialController {
	return &TestimonialController{u: u}
}

// Public endpoint: Visitors get only published & approved testimonials
func (ctrl *TestimonialController) GetPublished(c *gin.Context) {
	list, err := ctrl.u.GetPublished(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, list)
}

// Public endpoint: Visitors submit a testimonial (pending approval)
func (ctrl *TestimonialController) PublicSubmit(c *gin.Context) {
	var t domain.Testimonial
	if err := c.ShouldBindJSON(&t); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	created, err := ctrl.u.Submit(c.Request.Context(), &t)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Thank you! Your testimonial has been submitted for review.",
		"id":      created.ID,
	})
}

// Admin endpoint: List testimonials by status filter (pending, approved, rejected)
func (ctrl *TestimonialController) GetAllAdmin(c *gin.Context) {
	status := c.Query("status")
	list, err := ctrl.u.GetAll(c.Request.Context(), status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, list)
}

// Admin endpoint: Add approved testimonial directly
func (ctrl *TestimonialController) AdminCreate(c *gin.Context) {
	var t domain.Testimonial
	if err := c.ShouldBindJSON(&t); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	created, err := ctrl.u.Create(c.Request.Context(), &t)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, created)
}

// Admin endpoint: Toggle publish / status (approve, reject)
func (ctrl *TestimonialController) PublishToggle(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var req struct {
		Status      string `json:"status"`
		IsPublished bool   `json:"is_published"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updated, err := ctrl.u.TogglePublish(c.Request.Context(), id, req.Status, req.IsPublished)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, updated)
}

// Admin endpoint: Delete testimonial
func (ctrl *TestimonialController) Delete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}
	if err := ctrl.u.Delete(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Testimonial permanently deleted"})
}
