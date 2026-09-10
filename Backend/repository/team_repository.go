package repository

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"tamcon-backend/domain"
)

type teamRepository struct {
	db *gorm.DB
}

func NewTeamRepository(db *gorm.DB) domain.TeamRepository {
	return &teamRepository{db: db}
}

func (r *teamRepository) Create(ctx context.Context, member *domain.TeamMember) (*domain.TeamMember, error) {
	err := r.db.WithContext(ctx).Create(member).Error
	return member, err
}

func (r *teamRepository) Update(ctx context.Context, member *domain.TeamMember) (*domain.TeamMember, error) {
	err := r.db.WithContext(ctx).Save(member).Error
	return member, err
}

func (r *teamRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&domain.TeamMember{}, "id = ?", id).Error
}

func (r *teamRepository) GetByID(ctx context.Context, id uuid.UUID) (*domain.TeamMember, error) {
	var member domain.TeamMember
	err := r.db.WithContext(ctx).First(&member, "id = ?", id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	return &member, err
}

func (r *teamRepository) GetAll(ctx context.Context) ([]domain.TeamMember, error) {
	var members []domain.TeamMember
	err := r.db.WithContext(ctx).Order("created_at desc").Find(&members).Error
	return members, err
}
