package repository

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"tamcon-backend/domain"
)

type testimonialRepository struct {
	db *gorm.DB
}

func NewTestimonialRepository(db *gorm.DB) domain.TestimonialRepository {
	return &testimonialRepository{db: db}
}

func (r *testimonialRepository) Create(ctx context.Context, t *domain.Testimonial) (*domain.Testimonial, error) {
	err := r.db.WithContext(ctx).Create(t).Error
	return t, err
}

func (r *testimonialRepository) Update(ctx context.Context, t *domain.Testimonial) (*domain.Testimonial, error) {
	err := r.db.WithContext(ctx).Save(t).Error
	return t, err
}

func (r *testimonialRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&domain.Testimonial{}, "id = ?", id).Error
}

func (r *testimonialRepository) GetByID(ctx context.Context, id uuid.UUID) (*domain.Testimonial, error) {
	var t domain.Testimonial
	err := r.db.WithContext(ctx).First(&t, "id = ?", id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	return &t, err
}

func (r *testimonialRepository) GetAll(ctx context.Context, status string) ([]domain.Testimonial, error) {
	var list []domain.Testimonial
	query := r.db.WithContext(ctx)
	if status != "" {
		query = query.Where("status = ?", status)
	}
	err := query.Order("submitted_at desc, created_at desc").Find(&list).Error
	return list, err
}

func (r *testimonialRepository) GetPublished(ctx context.Context) ([]domain.Testimonial, error) {
	var list []domain.Testimonial
	err := r.db.WithContext(ctx).Where("is_published = ? AND status = ?", true, "approved").Order("submitted_at desc").Find(&list).Error
	return list, err
}
