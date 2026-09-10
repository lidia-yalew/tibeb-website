package usecase

import (
	"context"
	"errors"
	"tamcon-backend/domain"
	"time"

	"github.com/google/uuid"
)

type productUsecase struct {
	productRepo domain.ProductRepository
	timeout     time.Duration
}

func NewProductUsecase(productRepo domain.ProductRepository, timeout time.Duration) domain.ProductUsecase {
	return &productUsecase{productRepo: productRepo, timeout: timeout}
}

func (p productUsecase) Create(ctx context.Context, product *domain.Product) (*domain.Product, error) {
	ctx, cancel := context.WithTimeout(ctx, p.timeout)
	defer cancel()

	return p.productRepo.Create(ctx, product)
}

func (p productUsecase) Update(ctx context.Context, product *domain.Product) (*domain.Product, error) {
	ctx, cancel := context.WithTimeout(ctx, p.timeout)
	defer cancel()

	_, err := p.productRepo.GetByID(ctx, product.ID)
	if err != nil {
		return nil, errors.New("product not found")
	}

	product.UpdatedAt = time.Now()

	return p.productRepo.Update(ctx, product)
}

func (p productUsecase) Delete(ctx context.Context, id uuid.UUID) error {
	ctx, cancel := context.WithTimeout(ctx, p.timeout)
	defer cancel()

	err := p.productRepo.Delete(ctx, id)

	if err != nil {
		return err
	}

	return nil
}

func (p productUsecase) GetAll(ctx context.Context, onlyPublished bool) ([]domain.Product, error) {
	ctx, cancel := context.WithTimeout(ctx, p.timeout)
	defer cancel()

	return p.productRepo.GetAll(ctx, onlyPublished)
}

func (p productUsecase) GetByID(ctx context.Context, id uuid.UUID) (*domain.Product, error) {
	ctx, cancel := context.WithTimeout(ctx, p.timeout)
	defer cancel()

	return p.productRepo.GetByID(ctx, id)
}
