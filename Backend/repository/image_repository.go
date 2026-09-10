package repository

import (
	"context"
	"tamcon-backend/domain"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type imageRepository struct {
	db *gorm.DB
}

func NewImageRepository(db *gorm.DB) domain.ImageRepository {
	return &imageRepository{
		db: db,
	}
}

func (r *imageRepository) Transaction(
	ctx context.Context,
	fn func(repo domain.ImageRepository) error,
) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		return fn(&imageRepository{
			db: tx,
		})
	})
}

func (r *imageRepository) Create(ctx context.Context, image *domain.Image) (*domain.Image, error) {
	if err := r.db.WithContext(ctx).Create(image).Error; err != nil {
		return nil, err
	}

	return image, nil
}

func (r *imageRepository) Update(
	ctx context.Context,
	image *domain.Image,
) (*domain.Image, error) {

	if err := r.db.WithContext(ctx).
		Save(image).Error; err != nil {
		return nil, err
	}

	return image, nil
}

func (r *imageRepository) GetByID(ctx context.Context, id uuid.UUID) (*domain.Image, error) {
	var image domain.Image

	if err := r.db.WithContext(ctx).
		First(&image, "id = ?", id).Error; err != nil {
		return nil, err
	}

	return &image, nil
}

func (r *imageRepository) GetCover(
	ctx context.Context,
	entityType domain.EntityType,
	entityID uuid.UUID,
) (*domain.Image, error) {

	var image domain.Image

	err := r.db.WithContext(ctx).
		Where(
			"entity_type = ? AND entity_id = ? AND is_cover = ?",
			entityType,
			entityID,
			true,
		).
		First(&image).Error

	if err != nil {
		return nil, err
	}

	return &image, nil
}

func (r *imageRepository) Delete(ctx context.Context, id uuid.UUID) error {
	result := r.db.WithContext(ctx).Delete(&domain.Image{}, "id = ?", id)

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}

func (r *imageRepository) DeleteByEntity(
	ctx context.Context,
	entityType domain.EntityType,
	entityID uuid.UUID,
) error {
	return r.db.WithContext(ctx).
		Where("entity_type = ? AND entity_id = ?", entityType, entityID).
		Delete(&domain.Image{}).
		Error
}

func (r *imageRepository) DeleteByImageIds(ctx context.Context, imageIds []string) error {
	return r.db.WithContext(ctx).Delete(&domain.Image{}, "cloudinary_public_id IN ?", imageIds).Error
}

func (r *imageRepository) ListByEntity(
	ctx context.Context,
	entityType domain.EntityType,
	entityID uuid.UUID,
) ([]*domain.Image, error) {

	var images []*domain.Image

	err := r.db.WithContext(ctx).
		Where("entity_type = ? AND entity_id = ?", entityType, entityID).
		Order("display_order ASC, created_at ASC").
		Find(&images).Error

	if err != nil {
		return nil, err
	}

	return images, nil
}

func (r *imageRepository) SetCover(
	ctx context.Context,
	id uuid.UUID,
) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var image domain.Image

		if err := tx.First(&image, "id = ?", id).Error; err != nil {
			return err
		}

		result := tx.Model(&domain.Image{}).
			Where("id = ?", id).
			Update("is_cover", true)

		if result.Error != nil {
			return result.Error
		}

		if result.RowsAffected == 0 {
			return gorm.ErrRecordNotFound
		}

		return nil
	})
}
