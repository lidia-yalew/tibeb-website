package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

type Service struct {
	ID           uuid.UUID      `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Title        string         `gorm:"type:varchar(200);not null" json:"title" binding:"required"`
	Description  string         `gorm:"type:text;not null" json:"description"`
	Features     pq.StringArray `gorm:"type:text[];not null;default:'{}'" json:"features" swaggertype:"array,string"`
	DisplayOrder int            `gorm:"type:integer;not null;default:0" json:"display_order"`
	IsPublished  bool           `gorm:"type:boolean;not null;default:true" json:"is_published"`
	CreatedAt    time.Time      `gorm:"type:timestamptz;not null;default:now()" json:"created_at"`
	UpdatedAt    time.Time      `gorm:"type:timestamptz;not null;default:now()" json:"updated_at"`
}

func (Service) TableName() string { return "services" }

type ServiceRepository interface {
	Create(ctx context.Context, service *Service) (*Service, error)
	Update(ctx context.Context, service *Service) (*Service, error)
	Delete(ctx context.Context, id uuid.UUID) error
	GetByID(ctx context.Context, id uuid.UUID) (*Service, error)
	GetAll(ctx context.Context, onlyPublished bool) ([]Service, error)
}

type ServiceUsecase interface {
	Create(ctx context.Context, service *Service) (*Service, error)
	Update(ctx context.Context, service *Service) (*Service, error)
	Delete(ctx context.Context, id uuid.UUID) error
	GetByID(ctx context.Context, id uuid.UUID) (*Service, error)
	GetAll(ctx context.Context, onlyPublished bool) ([]Service, error)
}
