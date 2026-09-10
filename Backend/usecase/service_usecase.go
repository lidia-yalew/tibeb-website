package usecase

import (
	"context"
	"errors"
	"tamcon-backend/domain"
	"time"

	"github.com/google/uuid"
)

type serviceUsecase struct {
	serviceRepo domain.ServiceRepository
	timeout     time.Duration
}

func NewServiceUsecase(serviceRepo domain.ServiceRepository, timeout time.Duration) domain.ServiceUsecase {
	return &serviceUsecase{serviceRepo: serviceRepo, timeout: timeout}
}

func (s serviceUsecase) Create(ctx context.Context, service *domain.Service) (*domain.Service, error) {
	ctx, cancel := context.WithTimeout(ctx, s.timeout)
	defer cancel()

	return s.serviceRepo.Create(ctx, service)
}

func (s serviceUsecase) Update(ctx context.Context, service *domain.Service) (*domain.Service, error) {
	ctx, cancel := context.WithTimeout(ctx, s.timeout)
	defer cancel()

	_, err := s.serviceRepo.GetByID(ctx, service.ID)
	if err != nil {
		return nil, errors.New("service not found")
	}

	service.UpdatedAt = time.Now()

	return s.serviceRepo.Update(ctx, service)
}

func (s serviceUsecase) Delete(ctx context.Context, id uuid.UUID) error {
	ctx, cancel := context.WithTimeout(ctx, s.timeout)
	defer cancel()

	err := s.serviceRepo.Delete(ctx, id)

	if err != nil {
		return err
	}

	return nil
}

func (s serviceUsecase) GetAll(ctx context.Context, onlyPublished bool) ([]domain.Service, error) {
	ctx, cancel := context.WithTimeout(ctx, s.timeout)
	defer cancel()

	return s.serviceRepo.GetAll(ctx, onlyPublished)
}

func (s serviceUsecase) GetByID(ctx context.Context, id uuid.UUID) (*domain.Service, error) {
	ctx, cancel := context.WithTimeout(ctx, s.timeout)
	defer cancel()

	return s.serviceRepo.GetByID(ctx, id)
}
