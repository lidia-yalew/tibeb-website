package repository

import (
	"context"
	"tamcon-backend/domain"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type productRepo struct {
	db *gorm.DB
}

func NewProductRepo(db *gorm.DB) domain.ProductRepository {
	return &productRepo{db: db}
}

func (p productRepo) Create(ctx context.Context, product *domain.Product) (*domain.Product, error) {
	err := p.db.WithContext(ctx).Create(product).Error
	if err != nil {
		return nil, err
	}

	return product, nil
}

func (p productRepo) Update(ctx context.Context, product *domain.Product) (*domain.Product, error) {
	err := p.db.WithContext(ctx).Save(product).Error
	if err != nil {
		return nil, err
	}

	return product, nil
}

func (p productRepo) Delete(ctx context.Context, id uuid.UUID) error {
	err := p.db.WithContext(ctx).Delete(&domain.Product{}, "id = ?", id).Error
	if err != nil {
		return err
	}

	return nil
}

func (p productRepo) GetByID(ctx context.Context, id uuid.UUID) (*domain.Product, error) {
	var product domain.Product
	err := p.db.WithContext(ctx).Where("id = ?", id).First(&product).Error

	if err != nil {
		return nil, err
	}

	return &product, nil
}

func (p productRepo) GetAll(ctx context.Context, onlyPublished bool) ([]domain.Product, error) {
	var products []domain.Product
	query := p.db.WithContext(ctx).Model(&domain.Product{})

	if onlyPublished {
		query = query.Where("is_published = ?", true)
	}

	err := query.Order("display_order ASC").Find(&products).Error
	if err != nil {
		return nil, err
	}

	return products, nil
}
