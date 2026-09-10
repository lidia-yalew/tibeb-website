package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"tamcon-backend/domain"
)

type AIKnowledgeController struct {
	Usecase domain.AIKnowledgeUsecase
}

func NewAIKnowledgeController(u domain.AIKnowledgeUsecase) *AIKnowledgeController {
	return &AIKnowledgeController{Usecase: u}
}

func (ctrl *AIKnowledgeController) Get(c *gin.Context) {
	k, err := ctrl.Usecase.GetKnowledge(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, k)
}

type updateAIKnowledgeReq struct {
	Content string `json:"content" binding:"required"`
}

func (ctrl *AIKnowledgeController) Update(c *gin.Context) {
	var req updateAIKnowledgeReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := ctrl.Usecase.UpdateKnowledge(c.Request.Context(), req.Content); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "AI knowledge updated successfully"})
}
