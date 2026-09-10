package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type MessageStatus string

const (
	StatusUnread MessageStatus = "unread"
	StatusRead   MessageStatus = "read"
)

type ContactMessage struct {
	ID           uuid.UUID     `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	Name         string        `json:"name" gorm:"type:varchar(150);not null" binding:"required,max=150"`
	Email        string        `json:"email" gorm:"type:varchar(255);not null" binding:"required,email,max=255"`
	Phone        *string       `json:"phone" gorm:"type:varchar(50)" binding:"omitempty,max=50"`
	Organization *string       `json:"organization" gorm:"type:varchar(255)" binding:"omitempty,max=255"`
	Subject      *string       `json:"subject" gorm:"type:varchar(300)" binding:"omitempty,max=300"`
	Message      string        `json:"message" gorm:"type:text;not null" binding:"required"`
	Status       MessageStatus `json:"status" gorm:"type:varchar(20);not null;default:'unread'"`
	SubmittedAt  time.Time     `json:"submitted_at" gorm:"type:timestamptz;not null;default:now()"`
}

type ContactMessageRepository interface {
	Create(ctx context.Context, msg *ContactMessage) error
	GetAll(ctx context.Context) ([]ContactMessage, error)
	GetByID(ctx context.Context, id uuid.UUID) (*ContactMessage, error)
	Update(ctx context.Context, msg *ContactMessage) error
	Delete(ctx context.Context, id uuid.UUID) error
}
type ContactMessageUsecase interface {
	SubmitMessage(ctx context.Context, msg *ContactMessage) error
	ListMessages(ctx context.Context) ([]ContactMessage, error)
	UpdateStatus(ctx context.Context, id uuid.UUID, status MessageStatus) (*ContactMessage, error)
	DeleteMessage(ctx context.Context, id uuid.UUID) error
}