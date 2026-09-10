package usecase

import (
	"context"

	"github.com/google/uuid"
	"tamcon-backend/domain"
)

type faqUsecase struct {
	repo domain.FAQRepository
}

func NewFAQUsecase(repo domain.FAQRepository) domain.FAQUsecase {
	return &faqUsecase{repo: repo}
}

func (u *faqUsecase) Create(ctx context.Context, faq *domain.FAQ) (*domain.FAQ, error) {
	return u.repo.Create(ctx, faq)
}

func (u *faqUsecase) Update(ctx context.Context, faq *domain.FAQ) (*domain.FAQ, error) {
	return u.repo.Update(ctx, faq)
}

func (u *faqUsecase) Delete(ctx context.Context, id uuid.UUID) error {
	return u.repo.Delete(ctx, id)
}

func (u *faqUsecase) GetByID(ctx context.Context, id uuid.UUID) (*domain.FAQ, error) {
	return u.repo.GetByID(ctx, id)
}

func (u *faqUsecase) GetAll(ctx context.Context, onlyPublished bool) ([]domain.FAQ, error) {
	return u.repo.GetAll(ctx, onlyPublished)
}
