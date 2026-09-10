package repository

import (
	"context"
	"errors"

	"tamcon-backend/domain"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type refreshTokenRepo struct {
	db *gorm.DB
}

func NewRefreshTokenRepository(db *gorm.DB) domain.RefreshTokenRepository {
	return &refreshTokenRepo{db: db}
}

func (r *refreshTokenRepo) Create(ctx context.Context, token *domain.RefreshToken) error {
	return r.db.WithContext(ctx).Create(token).Error
}

func (r *refreshTokenRepo) GetByHash(ctx context.Context, hash string) (*domain.RefreshToken, error) {
	var token domain.RefreshToken
	err := r.db.WithContext(ctx).Where("token_hash = ? AND revoked = false", hash).First(&token).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &token, nil
}

func (r *refreshTokenRepo) Update(ctx context.Context, token *domain.RefreshToken) error {
	return r.db.WithContext(ctx).Save(token).Error
}

func (r *refreshTokenRepo) RevokeAllByUserID(ctx context.Context, userID uuid.UUID) error {
	return r.db.WithContext(ctx).Model(&domain.RefreshToken{}).
		Where("staff_user_id = ? AND revoked = false", userID).
		Update("revoked", true).Error
}
