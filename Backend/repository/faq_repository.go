package repository

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"tamcon-backend/domain"
)

type faqRepository struct {
	db *gorm.DB
}

func NewFAQRepository(db *gorm.DB) domain.FAQRepository {
	return &faqRepository{db: db}
}

func (r *faqRepository) Create(ctx context.Context, faq *domain.FAQ) (*domain.FAQ, error) {
	err := r.db.WithContext(ctx).Create(faq).Error
	return faq, err
}

func (r *faqRepository) Update(ctx context.Context, faq *domain.FAQ) (*domain.FAQ, error) {
	err := r.db.WithContext(ctx).Save(faq).Error
	return faq, err
}

func (r *faqRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&domain.FAQ{}, "id = ?", id).Error
}

func (r *faqRepository) GetByID(ctx context.Context, id uuid.UUID) (*domain.FAQ, error) {
	var faq domain.FAQ
	err := r.db.WithContext(ctx).First(&faq, "id = ?", id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	return &faq, err
}

func (r *faqRepository) GetAll(ctx context.Context, onlyPublished bool) ([]domain.FAQ, error) {
	var faqs []domain.FAQ
	query := r.db.WithContext(ctx)
	if onlyPublished {
		query = query.Where("is_published = ?", true)
	}
	err := query.Order("display_order asc, created_at desc").Find(&faqs).Error
	return faqs, err
}
