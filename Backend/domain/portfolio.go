package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type PortfolioProject struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Title       string    `gorm:"type:varchar(255);not null" json:"title" binding:"required"`
	Client      string    `gorm:"type:varchar(255)" json:"client"`
	Description string    `gorm:"type:text" json:"description"`
	Date        string    `gorm:"type:varchar(100)" json:"date"`
	Category    string    `gorm:"type:varchar(100)" json:"category"`
	CreatedAt   time.Time `gorm:"type:timestamptz;not null;default:now()" json:"created_at"`
	UpdatedAt   time.Time `gorm:"type:timestamptz;not null;default:now()" json:"updated_at"`
}

func (PortfolioProject) TableName() string {
	return "portfolio"
}

type PortfolioRepository interface {
	Create(ctx context.Context, project *PortfolioProject) (*PortfolioProject, error)
	Update(ctx context.Context, project *PortfolioProject) (*PortfolioProject, error)
	Delete(ctx context.Context, id uuid.UUID) error
	GetByID(ctx context.Context, id uuid.UUID) (*PortfolioProject, error)
	GetAll(ctx context.Context, category string) ([]PortfolioProject, error)
}

type PortfolioUsecase interface {
	Create(ctx context.Context, project *PortfolioProject) (*PortfolioProject, error)
	Update(ctx context.Context, project *PortfolioProject) (*PortfolioProject, error)
	Delete(ctx context.Context, id uuid.UUID) error
	GetByID(ctx context.Context, id uuid.UUID) (*PortfolioProject, error)
	GetAll(ctx context.Context, category string) ([]PortfolioProject, error)
}
