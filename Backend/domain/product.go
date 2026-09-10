package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type Product struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Name         string    `gorm:"type:varchar(200);not null" json:"name" binding:"required"`
	Description  string    `gorm:"type:text;not null" json:"description"`
	Category     string    `gorm:"type:varchar(100)" json:"category"`
	WebsiteURL   string    `gorm:"type:text" json:"website_url"`
	DisplayOrder int       `gorm:"type:integer;not null;default:0" json:"display_order"`
	IsPublished  bool      `gorm:"type:boolean;not null;default:false" json:"is_published"`
	CreatedAt    time.Time `gorm:"type:timestamptz;not null;default:now()" json:"created_at"`
	UpdatedAt    time.Time `gorm:"type:timestamptz;not null;default:now()" json:"updated_at"`
}

func (Product) TableName() string { return "products" }

type ProductRepository interface {
	Create(ctx context.Context, product *Product) (*Product, error)
	Update(ctx context.Context, product *Product) (*Product, error)
	Delete(ctx context.Context, id uuid.UUID) error
	GetByID(ctx context.Context, id uuid.UUID) (*Product, error)
	GetAll(ctx context.Context, onlyPublished bool) ([]Product, error)
}

type ProductUsecase interface {
	Create(ctx context.Context, product *Product) (*Product, error)
	Update(ctx context.Context, product *Product) (*Product, error)
	Delete(ctx context.Context, id uuid.UUID) error
	GetByID(ctx context.Context, id uuid.UUID) (*Product, error)
	GetAll(ctx context.Context, onlyPublished bool) ([]Product, error)
}
