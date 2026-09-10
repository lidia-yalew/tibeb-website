package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type BlogNews struct {
	ID           uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Category     string     `gorm:"type:varchar(10);not null" json:"category"`
	Title        string     `gorm:"type:varchar(300);not null" json:"title"`
	Slug         string     `gorm:"type:varchar(300);not null;uniqueIndex" json:"slug"`
	Excerpt      string     `gorm:"type:text" json:"excerpt"`
	Content      string     `gorm:"type:text;not null" json:"content"`
	AuthorName   string     `gorm:"type:varchar(200);not null" json:"author_name"`
	Source       string     `gorm:"type:varchar(200)" json:"source"`
	DisplayOrder int        `gorm:"not null;default:0" json:"display_order"`
	IsPublished  bool       `gorm:"not null;default:false" json:"is_published"`
	PublishedAt  *time.Time `gorm:"type:timestamptz" json:"published_at"`
	CreatedAt    time.Time  `gorm:"not null;default:now()" json:"created_at"`
	UpdatedAt    time.Time  `gorm:"not null;default:now()" json:"updated_at"`
}

func (BlogNews) TableName() string { return "blog_news" }

type BlogNewsRepository interface {
	Create(ctx context.Context, post *BlogNews) (*BlogNews, error)
	Update(ctx context.Context, post *BlogNews) (*BlogNews, error)
	Delete(ctx context.Context, id uuid.UUID) error
	GetByID(ctx context.Context, id uuid.UUID) (*BlogNews, error)
	GetBySlug(ctx context.Context, slug string) (*BlogNews, error)
	GetAll(ctx context.Context, category string, onlyPublished bool) ([]BlogNews, error)
}

type BlogNewsUsecase interface {
	Create(ctx context.Context, post *BlogNews) (*BlogNews, error)
	Update(ctx context.Context, post *BlogNews) (*BlogNews, error)
	Delete(ctx context.Context, id uuid.UUID) error
	GetByID(ctx context.Context, id uuid.UUID) (*BlogNews, error)
	GetBySlug(ctx context.Context, slug string) (*BlogNews, error)
	GetAll(ctx context.Context, category string, onlyPublished bool) ([]BlogNews, error)
	TogglePublish(ctx context.Context, id uuid.UUID) (*BlogNews, error)
}
