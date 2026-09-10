package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type Testimonial struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	ClientName   string    `gorm:"type:varchar(150);not null" json:"client_name" binding:"required"`
	ClientRole   string    `gorm:"type:varchar(150)" json:"client_role"`
	Organization string    `gorm:"type:varchar(150)" json:"organization"`
	Quote        string    `gorm:"type:text;not null" json:"quote" binding:"required"`
	Status       string    `gorm:"type:varchar(20);not null;default:'pending'" json:"status"`
	IsPublished  bool      `gorm:"type:boolean;not null;default:false" json:"is_published"`
	SubmittedAt  time.Time `gorm:"type:timestamptz;not null;default:now()" json:"submitted_at"`
	CreatedAt    time.Time `gorm:"type:timestamptz;not null;default:now()" json:"created_at"`
	UpdatedAt    time.Time `gorm:"type:timestamptz;not null;default:now()" json:"updated_at"`
}

func (Testimonial) TableName() string {
	return "testimonials"
}

type TestimonialRepository interface {
	Create(ctx context.Context, t *Testimonial) (*Testimonial, error)
	Update(ctx context.Context, t *Testimonial) (*Testimonial, error)
	Delete(ctx context.Context, id uuid.UUID) error
	GetByID(ctx context.Context, id uuid.UUID) (*Testimonial, error)
	GetAll(ctx context.Context, status string) ([]Testimonial, error)
	GetPublished(ctx context.Context) ([]Testimonial, error)
}

type TestimonialUsecase interface {
	Create(ctx context.Context, t *Testimonial) (*Testimonial, error)
	Submit(ctx context.Context, t *Testimonial) (*Testimonial, error)
	Update(ctx context.Context, t *Testimonial) (*Testimonial, error)
	Delete(ctx context.Context, id uuid.UUID) error
	GetByID(ctx context.Context, id uuid.UUID) (*Testimonial, error)
	GetAll(ctx context.Context, status string) ([]Testimonial, error)
	GetPublished(ctx context.Context) ([]Testimonial, error)
	TogglePublish(ctx context.Context, id uuid.UUID, status string, isPublished bool) (*Testimonial, error)
}
