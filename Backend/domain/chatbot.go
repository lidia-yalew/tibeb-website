package domain

import "context"

type ChatMessage struct {
	Role    string `json:"role"`    
	Content string `json:"content"`
}

type ChatRequest struct {
	History []ChatMessage `json:"history" binding:"required"`
	Message string        `json:"message" binding:"required"`
}

type ChatResponse struct {
	Reply string `json:"reply"`
}

type ChatbotUsecase interface {
	GenerateResponse(ctx context.Context, history []ChatMessage, userMessage string) (string, error)
}
