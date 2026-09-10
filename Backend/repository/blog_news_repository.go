package repository

import (
	"context"
	"tamcon-backend/domain"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type blogNewsRepository struct {
	db *gorm.DB
}

func NewBlogNewsRepository(db *gorm.DB) domain.BlogNewsRepository {
	return &blogNewsRepository{db: db}
}

func (r *blogNewsRepository) Create(ctx context.Context, post *domain.BlogNews) (*domain.BlogNews, error) {
	if err := r.db.WithContext(ctx).Create(post).Error; err != nil {
		return nil, err
	}
	return post, nil
}

func (r *blogNewsRepository) Update(ctx context.Context, post *domain.BlogNews) (*domain.BlogNews, error) {
	if err := r.db.WithContext(ctx).Save(post).Error; err != nil {
		return nil, err
	}
	return post, nil
}

func (r *blogNewsRepository) Delete(ctx context.Context, id uuid.UUID) error {
	result := r.db.WithContext(ctx).Delete(&domain.BlogNews{}, "id = ?", id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

func (r *blogNewsRepository) GetByID(ctx context.Context, id uuid.UUID) (*domain.BlogNews, error) {
	var post domain.BlogNews
	if err := r.db.WithContext(ctx).First(&post, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &post, nil
}

func (r *blogNewsRepository) GetBySlug(ctx context.Context, slug string) (*domain.BlogNews, error) {
	var post domain.BlogNews
	if err := r.db.WithContext(ctx).Where("slug = ?", slug).First(&post).Error; err != nil {
		return nil, err
	}
	return &post, nil
}

func (r *blogNewsRepository) GetAll(ctx context.Context, category string, onlyPublished bool) ([]domain.BlogNews, error) {
	var posts []domain.BlogNews
	q := r.db.WithContext(ctx).Order("display_order ASC, created_at DESC")
	if category != "" {
		q = q.Where("category = ?", category)
	}
	if onlyPublished {
		q = q.Where("is_published = ?", true)
	}
	if err := q.Find(&posts).Error; err != nil {
		return nil, err
	}
	return posts, nil
}
