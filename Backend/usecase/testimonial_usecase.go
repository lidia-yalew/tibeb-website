package usecase

import (
	"context"

	"github.com/google/uuid"
	"tamcon-backend/domain"
)

type testimonialUsecase struct {
	repo domain.TestimonialRepository
}

func NewTestimonialUsecase(repo domain.TestimonialRepository) domain.TestimonialUsecase {
	return &testimonialUsecase{repo: repo}
}

func (u *testimonialUsecase) Create(ctx context.Context, t *domain.Testimonial) (*domain.Testimonial, error) {
	t.Status = "approved"
	t.IsPublished = true
	return u.repo.Create(ctx, t)
}

func (u *testimonialUsecase) Submit(ctx context.Context, t *domain.Testimonial) (*domain.Testimonial, error) {
	t.Status = "pending"
	t.IsPublished = false
	return u.repo.Create(ctx, t)
}

func (u *testimonialUsecase) Update(ctx context.Context, t *domain.Testimonial) (*domain.Testimonial, error) {
	return u.repo.Update(ctx, t)
}

func (u *testimonialUsecase) Delete(ctx context.Context, id uuid.UUID) error {
	return u.repo.Delete(ctx, id)
}

func (u *testimonialUsecase) GetByID(ctx context.Context, id uuid.UUID) (*domain.Testimonial, error) {
	return u.repo.GetByID(ctx, id)
}

func (u *testimonialUsecase) GetAll(ctx context.Context, status string) ([]domain.Testimonial, error) {
	return u.repo.GetAll(ctx, status)
}

func (u *testimonialUsecase) GetPublished(ctx context.Context) ([]domain.Testimonial, error) {
	return u.repo.GetPublished(ctx)
}

func (u *testimonialUsecase) TogglePublish(ctx context.Context, id uuid.UUID, status string, isPublished bool) (*domain.Testimonial, error) {
	t, err := u.repo.GetByID(ctx, id)
	if err != nil || t == nil {
		return nil, err
	}
	t.Status = status
	t.IsPublished = isPublished
	return u.repo.Update(ctx, t)
}
