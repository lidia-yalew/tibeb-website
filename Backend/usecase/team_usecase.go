package usecase

import (
	"context"

	"github.com/google/uuid"
	"tamcon-backend/domain"
)

type teamUsecase struct {
	repo domain.TeamRepository
}

func NewTeamUsecase(repo domain.TeamRepository) domain.TeamUsecase {
	return &teamUsecase{repo: repo}
}

func (u *teamUsecase) Create(ctx context.Context, member *domain.TeamMember) (*domain.TeamMember, error) {
	return u.repo.Create(ctx, member)
}

func (u *teamUsecase) Update(ctx context.Context, member *domain.TeamMember) (*domain.TeamMember, error) {
	return u.repo.Update(ctx, member)
}

func (u *teamUsecase) Delete(ctx context.Context, id uuid.UUID) error {
	return u.repo.Delete(ctx, id)
}

func (u *teamUsecase) GetByID(ctx context.Context, id uuid.UUID) (*domain.TeamMember, error) {
	return u.repo.GetByID(ctx, id)
}

func (u *teamUsecase) GetAll(ctx context.Context) ([]domain.TeamMember, error) {
	return u.repo.GetAll(ctx)
}
