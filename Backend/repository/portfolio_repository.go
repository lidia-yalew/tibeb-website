package repository

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"tamcon-backend/domain"
)

type portfolioRepository struct {
	db *gorm.DB
}

func NewPortfolioRepository(db *gorm.DB) domain.PortfolioRepository {
	return &portfolioRepository{db: db}
}

func (r *portfolioRepository) Create(ctx context.Context, project *domain.PortfolioProject) (*domain.PortfolioProject, error) {
	err := r.db.WithContext(ctx).Create(project).Error
	return project, err
}

func (r *portfolioRepository) Update(ctx context.Context, project *domain.PortfolioProject) (*domain.PortfolioProject, error) {
	err := r.db.WithContext(ctx).Save(project).Error
	return project, err
}

func (r *portfolioRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&domain.PortfolioProject{}, "id = ?", id).Error
}

func (r *portfolioRepository) GetByID(ctx context.Context, id uuid.UUID) (*domain.PortfolioProject, error) {
	var project domain.PortfolioProject
	err := r.db.WithContext(ctx).First(&project, "id = ?", id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	return &project, err
}

func (r *portfolioRepository) GetAll(ctx context.Context, category string) ([]domain.PortfolioProject, error) {
	var projects []domain.PortfolioProject
	query := r.db.WithContext(ctx)
	if category != "" {
		query = query.Where("category = ?", category)
	}
	err := query.Order("created_at desc").Find(&projects).Error
	return projects, err
}
