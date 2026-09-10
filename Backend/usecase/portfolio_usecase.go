package usecase

import (
	"context"

	"github.com/google/uuid"
	"tamcon-backend/domain"
)

type portfolioUsecase struct {
	repo domain.PortfolioRepository
}

func NewPortfolioUsecase(repo domain.PortfolioRepository) domain.PortfolioUsecase {
	return &portfolioUsecase{repo: repo}
}

func (u *portfolioUsecase) Create(ctx context.Context, project *domain.PortfolioProject) (*domain.PortfolioProject, error) {
	return u.repo.Create(ctx, project)
}

func (u *portfolioUsecase) Update(ctx context.Context, project *domain.PortfolioProject) (*domain.PortfolioProject, error) {
	return u.repo.Update(ctx, project)
}

func (u *portfolioUsecase) Delete(ctx context.Context, id uuid.UUID) error {
	return u.repo.Delete(ctx, id)
}

func (u *portfolioUsecase) GetByID(ctx context.Context, id uuid.UUID) (*domain.PortfolioProject, error) {
	return u.repo.GetByID(ctx, id)
}

func (u *portfolioUsecase) GetAll(ctx context.Context, category string) ([]domain.PortfolioProject, error) {
	return u.repo.GetAll(ctx, category)
}
