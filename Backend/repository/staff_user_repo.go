package repository

import (
	"context"
	"errors"
	"tamcon-backend/domain"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type staffUserRepo struct {
	db *gorm.DB
}

func NewStaffUserRepo(db *gorm.DB) domain.StaffUserRepository{
	return &staffUserRepo{db: db}
}

func (r *staffUserRepo) Create(ctx context.Context, user *domain.StaffUser) error {
	return r.db.WithContext(ctx).Create(user).Error
}

func (r *staffUserRepo) GetByEmail(ctx context.Context, email string) (*domain.StaffUser, error) {
	var user domain.StaffUser
	err := r.db.WithContext(ctx).Where("email = ?", email).First(&user).Error
	if err != nil{
		if errors.Is(err, gorm.ErrRecordNotFound){
			return nil, nil
		}
		return nil, err

	}
	return &user, nil

}

func (r *staffUserRepo) GetByID(ctx context.Context, id uuid.UUID) (*domain.StaffUser, error){
	var user domain.StaffUser
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&user).Error
	if err != nil{
		if errors.Is(err, gorm.ErrRecordNotFound){
			return nil, nil
		}
		return nil, err
	}
	return &user, nil

}

func (r *staffUserRepo) Update(ctx context.Context, user *domain.StaffUser) error {
	return r.db.WithContext(ctx).Save(user).Error
}

func (r *staffUserRepo) GetAll(ctx context.Context) ([]domain.StaffUser, error) {
	var users []domain.StaffUser
	err := r.db.WithContext(ctx).Order("created_at desc").Find(&users).Error
	return users, err
}