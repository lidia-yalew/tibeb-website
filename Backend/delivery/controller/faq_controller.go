package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"tamcon-backend/domain"
)

type FAQController struct {
	faqUsecase domain.FAQUsecase
}

func NewFAQController(u domain.FAQUsecase) *FAQController {
	return &FAQController{faqUsecase: u}
}

func (ctrl *FAQController) GetAll(c *gin.Context) {
	onlyPublished := c.Query("all") != "true"
	faqs, err := ctrl.faqUsecase.GetAll(c.Request.Context(), onlyPublished)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, faqs)
}

func (ctrl *FAQController) Create(c *gin.Context) {
	var faq domain.FAQ
	if err := c.ShouldBindJSON(&faq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	created, err := ctrl.faqUsecase.Create(c.Request.Context(), &faq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, created)
}

func (ctrl *FAQController) Update(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}
	var faq domain.FAQ
	if err := c.ShouldBindJSON(&faq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	faq.ID = id
	updated, err := ctrl.faqUsecase.Update(c.Request.Context(), &faq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, updated)
}

func (ctrl *FAQController) Delete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}
	if err := ctrl.faqUsecase.Delete(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "FAQ deleted successfully"})
}
