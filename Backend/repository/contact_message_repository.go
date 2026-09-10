package repository

import (
	"context"
	"tamcon-backend/domain"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type contactMessageRepo struct {
	db *gorm.DB
}


func NewContactMessageRepository(db *gorm.DB) domain.ContactMessageRepository {
	return &contactMessageRepo{db: db}
}

func (r *contactMessageRepo) Create(ctx context.Context, msg *domain.ContactMessage) error {
	return r.db.WithContext(ctx).Create(msg).Error
}
func (r *contactMessageRepo) GetAll(ctx context.Context) ([]domain.ContactMessage, error) {
	
	var messages []domain.ContactMessage
	err := r.db.WithContext(ctx).Order("submitted_at desc").Find(&messages).Error
	return messages, err
}
func (r *contactMessageRepo) GetByID(ctx context.Context, id uuid.UUID) (*domain.ContactMessage, error) {
	var msg domain.ContactMessage
	err := r.db.WithContext(ctx).First(&msg, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &msg, nil
}
func (r *contactMessageRepo) Update(ctx context.Context, msg *domain.ContactMessage) error {
	return r.db.WithContext(ctx).Save(msg).Error
}
func (r *contactMessageRepo) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&domain.ContactMessage{}, "id = ?", id).Error
}


