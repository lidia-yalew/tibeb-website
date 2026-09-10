package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type FAQ struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Question     string    `gorm:"type:text;not null" json:"question" binding:"required"`
	Answer       string    `gorm:"type:text;not null" json:"answer" binding:"required"`
	Category     string    `gorm:"type:varchar(100);default:'general'" json:"category"`
	DisplayOrder int       `gorm:"type:integer;not null;default:0" json:"display_order"`
	IsPublished  bool      `gorm:"type:boolean;not null;default:true" json:"is_published"`
	CreatedAt    time.Time `gorm:"type:timestamptz;not null;default:now()" json:"created_at"`
	UpdatedAt    time.Time `gorm:"type:timestamptz;not null;default:now()" json:"updated_at"`
}

func (FAQ) TableName() string {
	return "faqs"
}

type FAQRepository interface {
	Create(ctx context.Context, faq *FAQ) (*FAQ, error)
	Update(ctx context.Context, faq *FAQ) (*FAQ, error)
	Delete(ctx context.Context, id uuid.UUID) error
	GetByID(ctx context.Context, id uuid.UUID) (*FAQ, error)
	GetAll(ctx context.Context, onlyPublished bool) ([]FAQ, error)
}

type FAQUsecase interface {
	Create(ctx context.Context, faq *FAQ) (*FAQ, error)
	Update(ctx context.Context, faq *FAQ) (*FAQ, error)
	Delete(ctx context.Context, id uuid.UUID) error
	GetByID(ctx context.Context, id uuid.UUID) (*FAQ, error)
	GetAll(ctx context.Context, onlyPublished bool) ([]FAQ, error)
}
