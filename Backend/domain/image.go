package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type EntityType string

const (
	EntityProduct     EntityType = "product"
	EntityBlogNews    EntityType = "blog_news"
	EntityEvent       EntityType = "event"
	EntityService     EntityType = "service"
	EntityTestimonial EntityType = "testimonial"
)

type Image struct {
	ID                 uuid.UUID  `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	EntityType         EntityType `gorm:"type:varchar(50);not null" json:"entity_type"`
	EntityID           uuid.UUID  `gorm:"type:uuid;not null;index:idx_images_entity,priority:2" json:"entity_id"`
	URL                string     `gorm:"type:text;not null" json:"url"`
	CloudinaryPublicID string     `gorm:"type:text" json:"cloudinary_public_id"`
	Caption            string     `gorm:"type:text" json:"caption"`
	DisplayOrder       int        `gorm:"not null;default:0" json:"display_order"`
	IsCover            bool       `gorm:"not null;default:false" json:"is_cover"`
	CreatedAt          time.Time  `gorm:"not null;default:now()" json:"created_at"`
}

func (Image) TableName() string { return "images" }

type ImageRepository interface {
	Transaction(ctx context.Context, fn func(repo ImageRepository) error) error
	Create(ctx context.Context, image *Image) (*Image, error)
	Update(ctx context.Context, image *Image) (*Image, error)
	GetByID(ctx context.Context, id uuid.UUID) (*Image, error)
	GetCover(
		ctx context.Context,
		entityType EntityType,
		entityID uuid.UUID,
	) (*Image, error)
	SetCover(
		ctx context.Context,
		id uuid.UUID,
	) error
	ListByEntity(
		ctx context.Context,
		entityType EntityType,
		entityID uuid.UUID,
	) ([]*Image, error)
	Delete(ctx context.Context, id uuid.UUID) error
	DeleteByEntity(
		ctx context.Context,
		entityType EntityType,
		entityID uuid.UUID,
	) error
	DeleteByImageIds(ctx context.Context, imageIds []string) error
}

type ImageUsecase interface {
	Create(ctx context.Context, image *Image) (*Image, error)
	GetByID(ctx context.Context, id uuid.UUID) (*Image, error)
	GetCover(
		ctx context.Context,
		entityType EntityType,
		entityID uuid.UUID,
	) (*Image, error)
	SetCover(
		ctx context.Context,
		id uuid.UUID,
	) error
	ListByEntity(
		ctx context.Context,
		entityType EntityType,
		entityID uuid.UUID,
	) ([]*Image, error)
	Delete(ctx context.Context, id uuid.UUID) error
	DeleteByEntity(
		ctx context.Context,
		entityType EntityType,
		entityID uuid.UUID,
	) error
	DeleteByImageIds(ctx context.Context, imageIds []string) error
}
