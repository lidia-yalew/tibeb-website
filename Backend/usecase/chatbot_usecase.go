package usecase

import (
	"context"
	"fmt"
	"strings"

	"tamcon-backend/domain"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

type chatbotUsecase struct {
	apiKey          string
	aiKnowledgeRepo domain.AIKnowledgeRepository
}

func NewChatbotUsecase(apiKey string, repo domain.AIKnowledgeRepository) (domain.ChatbotUsecase, error) {
	return &chatbotUsecase{
		apiKey:          apiKey,
		aiKnowledgeRepo: repo,
	}, nil
}


// Check if message is off-topic
func isOffTopic(userMessage string) bool {
	msg := strings.ToLower(userMessage)

	// Explicitly blocked off-topic words
	blockedKeywords := []string{
		"football", "soccer", "recipe", "cook", "movie", "game", "gaming", "crypto",
		"bitcoin", "weather", "politics", "president", "song", "lyrics", "joke",
	}

	for _, kw := range blockedKeywords {
		if strings.Contains(msg, kw) {
			return true
		}
	}
	return false
}

func (u *chatbotUsecase) GenerateResponse(ctx context.Context, history []domain.ChatMessage, userMessage string) (string, error) {
	// Guardrail check
	if isOffTopic(userMessage) {
		return "I am Tibeb AI, specialized in assisting with Tibeb Consultancy's training, data intelligence, research, and organizational development services. How can I help you with our services today?", nil
	}

	// Fetch dynamic knowledge from DB
	knowledge, err := u.aiKnowledgeRepo.Get(ctx)
	systemPrompt := `You are Tibeb AI, the official AI Customer Support Assistant for Tibeb Consultancy & Training PLC (Addis Ababa, Ethiopia).
	
STRICT RULES & GUARDRAILS:
1. ONLY answer questions directly related to Tibeb Consultancy, our services, team members, contact information, and project inquiries.
2. IF the user asks an OFF-TOPIC question, POLITELY DECLINE.
3. Be professional, warm, concise, and helpful.`

	if err == nil && knowledge.Content != "" {
		systemPrompt = knowledge.Content
	}

	client, err := genai.NewClient(ctx, option.WithAPIKey(u.apiKey))
	if err != nil {
		return "", fmt.Errorf("failed to create gemini client: %w", err)
	}
	defer client.Close()

	model := client.GenerativeModel("gemini-3.6-flash")
	model.SetTemperature(0.2)
	model.SystemInstruction = &genai.Content{
		Parts: []genai.Part{genai.Text(systemPrompt)},
	}

	cs := model.StartChat()
	geminiHistory := make([]*genai.Content, len(history))
	for i, msg := range history {
		role := msg.Role
		if role == "assistant" {
			role = "model"
		}
		geminiHistory[i] = &genai.Content{
			Role:  role,
			Parts: []genai.Part{genai.Text(msg.Content)},
		}
	}
	cs.History = geminiHistory

	resp, err := cs.SendMessage(ctx, genai.Text(userMessage))
	if err != nil {
		return "", fmt.Errorf("failed to get response from gemini: %w", err)
	}

	if len(resp.Candidates) == 0 || len(resp.Candidates[0].Content.Parts) == 0 {
		return "I apologize, I am unable to generate a response at the moment.", nil
	}

	part := resp.Candidates[0].Content.Parts[0]
	if txt, ok := part.(genai.Text); ok {
		return string(txt), nil
	}
	return "I apologize, I am unable to generate a response at the moment.", nil
}
