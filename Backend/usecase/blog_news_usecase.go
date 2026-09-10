package usecase

import (
	"context"
	"time"

	"tamcon-backend/domain"
	"tamcon-backend/internal/slugutil"

	"github.com/google/uuid"
)

type blogNewsUsecase struct {
	repo    domain.BlogNewsRepository
	timeout time.Duration
}

func NewBlogNewsUsecase(repo domain.BlogNewsRepository, timeout time.Duration) domain.BlogNewsUsecase {
	return &blogNewsUsecase{repo: repo, timeout: timeout}
}



func (u *blogNewsUsecase) Create(ctx context.Context, post *domain.BlogNews) (*domain.BlogNews, error) {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()

	post.Slug = slugutil.Generate(post.Title)

	existing, _ := u.repo.GetBySlug(ctx, post.Slug)
	if existing != nil {
		post.Slug = post.Slug + "-" + uuid.NewString()[:8]
	}

	if post.IsPublished && post.PublishedAt == nil {
		now := time.Now()
		post.PublishedAt = &now
	}

	return u.repo.Create(ctx, post)
}

func (u *blogNewsUsecase) Update(ctx context.Context, post *domain.BlogNews) (*domain.BlogNews, error) {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()

	if post.IsPublished && post.PublishedAt == nil {
		now := time.Now()
		post.PublishedAt = &now
	}

	return u.repo.Update(ctx, post)
}

func (u *blogNewsUsecase) Delete(ctx context.Context, id uuid.UUID) error {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()
	return u.repo.Delete(ctx, id)
}

func (u *blogNewsUsecase) GetByID(ctx context.Context, id uuid.UUID) (*domain.BlogNews, error) {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()
	return u.repo.GetByID(ctx, id)
}

func (u *blogNewsUsecase) GetBySlug(ctx context.Context, slug string) (*domain.BlogNews, error) {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()
	return u.repo.GetBySlug(ctx, slug)
}

func (u *blogNewsUsecase) GetAll(ctx context.Context, category string, onlyPublished bool) ([]domain.BlogNews, error) {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()
	return u.repo.GetAll(ctx, category, onlyPublished)
}

func (u *blogNewsUsecase) TogglePublish(ctx context.Context, id uuid.UUID) (*domain.BlogNews, error) {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()

	post, err := u.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	post.IsPublished = !post.IsPublished

	if post.IsPublished && post.PublishedAt == nil {
		now := time.Now()
		post.PublishedAt = &now
	}

	return u.repo.Update(ctx, post)
}
