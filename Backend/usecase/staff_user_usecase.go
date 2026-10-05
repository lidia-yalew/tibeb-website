package usecase

import (
	"context"
	"errors"
	"strings"
	"tamcon-backend/domain"
	"tamcon-backend/internal/hasher"
	"time"

	"github.com/google/uuid"
)

type staffUserUsecase struct {
	userRepo domain.StaffUserRepository
	timeout  time.Duration
}

func NewStaffUserUsecase(userRepo domain.StaffUserRepository, timeout time.Duration) domain.StaffUserUsecase {
	return &staffUserUsecase{userRepo: userRepo, timeout: timeout}
}

func (u *staffUserUsecase) GetProfile(ctx context.Context, userID uuid.UUID) (*domain.StaffUser, error) {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()

	user, err := u.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	if user == nil{
		return nil, errors.New("User not found")
	}
	return user, nil
}

func (u *staffUserUsecase) UpdateProfile(ctx context.Context, userID uuid.UUID, firstName, lastName string) (*domain.StaffUser, error) {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()

	user, err := u.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	if user == nil{
		return nil, errors.New("User not found")
	}

	user.FirstName = strings.TrimSpace(firstName)
	user.LastName = strings.TrimSpace(lastName)
	user.UpdatedAt = time.Now()

	if err := u.userRepo.Update(ctx, user); err != nil {
		return nil, err
	}
	return user, nil
}

func (u *staffUserUsecase) UpdatePassword(ctx context.Context, userID uuid.UUID, oldPassword, newPassword string) error {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()

	user, err := u.userRepo.GetByID(ctx, userID)
	if err != nil {
		return err
	}

	if user == nil{
		return errors.New("User not found")
	}

	if !hasher.CheckPassword(oldPassword, user.PasswordHash) {
		return errors.New("Invalid password")
	}

	if hasher.CheckPassword(newPassword, user.PasswordHash) {
		return errors.New("New password must differ from current password")
	}

	if err := hasher.ValidatePasswordComplexity(newPassword); err != nil {
		return err
	}

	newHash, err := hasher.HashPassword(newPassword)
	if err != nil {
		return err
	}

	user.PasswordHash = newHash
	user.UpdatedAt = time.Now()

	if err := u.userRepo.Update(ctx, user); err != nil {
		return err
	}
	return nil
}

func (u *staffUserUsecase) ListAdmins(ctx context.Context) ([]domain.StaffUser, error) {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()
	return u.userRepo.GetAll(ctx)
}

func (u *staffUserUsecase) CreateAdmin(ctx context.Context, firstName, lastName, email, password, role string) (*domain.StaffUser, error) {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()

	// Check if exists
	existing, err := u.userRepo.GetByEmail(ctx, email)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, errors.New("admin with this email already exists")
	}

	if err := hasher.ValidatePasswordComplexity(password); err != nil {
		return nil, err
	}

	hashedPassword, err := hasher.HashPassword(password)
	if err != nil {
		return nil, err
	}

	user := &domain.StaffUser{
		FirstName:    strings.TrimSpace(firstName),
		LastName:     strings.TrimSpace(lastName),
		Email:        strings.ToLower(strings.TrimSpace(email)),
		PasswordHash: hashedPassword,
		Role:         role,
		Status:       "ACTIVE",
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	if err := u.userRepo.Create(ctx, user); err != nil {
		return nil, err
	}
	return user, nil
}

func (u *staffUserUsecase) UpdateAdminStatus(ctx context.Context, adminID uuid.UUID, status string) error {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()

	user, err := u.userRepo.GetByID(ctx, adminID)
	if err != nil {
		return err
	}
	if user == nil {
		return errors.New("admin not found")
	}

	user.Status = status
	user.UpdatedAt = time.Now()

	return u.userRepo.Update(ctx, user)
}