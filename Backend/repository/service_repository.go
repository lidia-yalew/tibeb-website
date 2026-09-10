package repository

import (
	"context"
	"tamcon-backend/domain"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type serviceRepo struct {
	db *gorm.DB
}

func NewServiceRepo(db *gorm.DB) domain.ServiceRepository {
	return &serviceRepo{db: db}
}

func (s serviceRepo) Create(ctx context.Context, service *domain.Service) (*domain.Service, error) {
	err := s.db.WithContext(ctx).Create(service).Error
	if err != nil {
		return nil, err
	}

	return service, nil
}

func (s serviceRepo) Update(ctx context.Context, service *domain.Service) (*domain.Service, error) {
	err := s.db.WithContext(ctx).Save(service).Error
	if err != nil {
		return nil, err
	}

	return service, nil
}

func (s serviceRepo) Delete(ctx context.Context, id uuid.UUID) error {
	err := s.db.WithContext(ctx).Delete(&domain.Service{}, "id = ?", id).Error
	if err != nil {
		return err
	}

	return nil
}

func (s serviceRepo) GetByID(ctx context.Context, id uuid.UUID) (*domain.Service, error) {
	var service domain.Service
	err := s.db.WithContext(ctx).Where("id = ?", id).First(&service).Error

	if err != nil {
		return nil, err
	}

	return &service, nil
}

func (s serviceRepo) GetAll(ctx context.Context, onlyPublished bool) ([]domain.Service, error) {
	var services []domain.Service
	query := s.db.WithContext(ctx).Model(&domain.Service{})

	if onlyPublished {
		query = query.Where("is_published = ?", true)
	}

	err := query.Order("display_order ASC").Find(&services).Error
	if err != nil {
		return nil, err
	}

	return services, nil
}
