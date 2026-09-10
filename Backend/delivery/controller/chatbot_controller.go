package controller

import (
	"net/http"
	"tamcon-backend/domain"

	"github.com/gin-gonic/gin"
)

type ChatbotController struct{
	usecase domain.ChatbotUsecase
}

func NewChatbotController(usecase domain.ChatbotUsecase) *ChatbotController {
	return &ChatbotController{
		usecase: usecase,
	}
}

type chatResponseSuccess struct {
	Success bool   `json:"success" default:"true"`
	Reply   string `json:"reply" example:"Hello! How can I help you today?"`
}

// Chat GoDoc
// @Summary      Send message to Chatbot
// @Description  Send a user message along with chat history to the Gemini chatbot
// @Tags         chatbot
// @Accept       json
// @Produce      json
// @Param        request body domain.ChatRequest true "Chat prompt request payload"
// @Success      200 {object} chatResponseSuccess
// @Failure      400 {object} domain.ErrorResponse
// @Failure      500 {object} domain.ErrorResponse
// @Router       /api/chat [post]
func (ctrl *ChatbotController) Chat(c *gin.Context) {
	var req domain.ChatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": "Invalid request payload (history and message are required)",
		})

		return
	}

	reply, err := ctrl.usecase.GenerateResponse(c.Request.Context(), req.History, req.Message)
	if err != nil{
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"reply":   reply,
	})
} 