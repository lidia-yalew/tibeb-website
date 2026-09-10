package usecase

import (
	"context"
	"errors"
	"time"

	"tamcon-backend/domain"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type imageUsecase struct {
	imageRepo domain.ImageRepository
	timeout   time.Duration
}

func NewImageUsecase(
	imageRepo domain.ImageRepository,
	timeout time.Duration,
) domain.ImageUsecase {
	return &imageUsecase{
		imageRepo: imageRepo,
		timeout:   timeout,
	}
}

func (u *imageUsecase) Create(
	ctx context.Context,
	image *domain.Image,
) (*domain.Image, error) {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()

	return u.imageRepo.Create(ctx, image)
}

func (u *imageUsecase) GetByID(
	ctx context.Context,
	id uuid.UUID,
) (*domain.Image, error) {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()

	return u.imageRepo.GetByID(ctx, id)
}

func (u *imageUsecase) GetCover(ctx context.Context, entityType domain.EntityType, entityID uuid.UUID) (*domain.Image, error) {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()

	return u.imageRepo.GetCover(ctx, entityType, entityID)
}

func (u *imageUsecase) SetCover(ctx context.Context, id uuid.UUID) error {
	return u.imageRepo.Transaction(ctx, func(repo domain.ImageRepository) error {
		ctx, cancel := context.WithTimeout(ctx, u.timeout)
		defer cancel()

		image, err := repo.GetByID(ctx, id)
		if err != nil {
			return err
		}

		cover, err := repo.GetCover(ctx, image.EntityType, image.EntityID)
		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			return err
		}

		if cover != nil && cover.ID != image.ID {
			cover.IsCover = false
			if _, err := repo.Update(ctx, cover); err != nil {
				return err
			}
		}

		image.IsCover = true
		_, err = repo.Update(ctx, image)
		return err
	})
}

func (u *imageUsecase) ListByEntity(
	ctx context.Context,
	entityType domain.EntityType,
	entityID uuid.UUID,
) ([]*domain.Image, error) {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()

	return u.imageRepo.ListByEntity(ctx, entityType, entityID)
}

func (u *imageUsecase) Delete(
	ctx context.Context,
	id uuid.UUID,
) error {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()

	return u.imageRepo.Delete(ctx, id)
}

func (u *imageUsecase) DeleteByImageIds(ctx context.Context, imageIds []string) error {
	return u.imageRepo.DeleteByImageIds(ctx, imageIds)
}

func (u *imageUsecase) DeleteByEntity(ctx context.Context, entityType domain.EntityType, entityID uuid.UUID) error {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()

	return u.imageRepo.DeleteByEntity(ctx, entityType, entityID)
}
