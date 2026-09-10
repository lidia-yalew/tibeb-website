package domain

import (
	"context"
	"time"
)

type AIKnowledge struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Content   string    `json:"content" gorm:"type:text"`
	UpdatedAt time.Time `json:"updated_at"`
}

type AIKnowledgeRepository interface {
	Get(ctx context.Context) (AIKnowledge, error)
	Upsert(ctx context.Context, content string) error
}

type AIKnowledgeUsecase interface {
	GetKnowledge(ctx context.Context) (AIKnowledge, error)
	UpdateKnowledge(ctx context.Context, content string) error
}
