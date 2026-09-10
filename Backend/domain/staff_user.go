package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type StaffUser struct {
	ID           uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	FirstName    string     `gorm:"type:varchar(150);not null" json:"first_name"`
	LastName     string     `gorm:"type:varchar(150);not null" json:"last_name"`
	Email        string     `gorm:"type:varchar(255);uniqueIndex;not null" json:"email"`
	PasswordHash string     `gorm:"type:varchar(255);not null" json:"-"`
	AvatarURL    *string    `gorm:"type:text" json:"avatar_url,omitempty"`
	Role         string     `gorm:"type:varchar(50);not null;default:'Editor'" json:"role"`
	Status       string     `gorm:"type:varchar(50);not null;default:'ACTIVE'" json:"status"`
	LastLoginAt  *time.Time `gorm:"type:timestamptz" json:"last_login_at,omitempty"`
	CreatedAt    time.Time  `gorm:"type:timestamptz;not null;default:now()" json:"created_at"`
	UpdatedAt    time.Time  `gorm:"type:timestamptz;not null;default:now()" json:"updated_at"`
}

func (StaffUser) TableName() string {
	return "staff_users"
}

type StaffUserRepository interface {
	Create(ctx context.Context, user *StaffUser) error
	GetByEmail(ctx context.Context, email string) (*StaffUser, error)
	GetByID(ctx context.Context, id uuid.UUID) (*StaffUser, error) 
	Update(ctx context.Context, user *StaffUser) error
	GetAll(ctx context.Context) ([]StaffUser, error)
}

type StaffUserUsecase interface {
	GetProfile(ctx context.Context, userID uuid.UUID) (*StaffUser, error)
	UpdateProfile(ctx context.Context, userID uuid.UUID, firstName, lastName string) (*StaffUser, error)
	UpdatePassword(ctx context.Context, userID uuid.UUID, oldPassword, newPassword string) error
	ListAdmins(ctx context.Context) ([]StaffUser, error)
	CreateAdmin(ctx context.Context, firstName, lastName, email, password, role string) (*StaffUser, error)
	UpdateAdminStatus(ctx context.Context, adminID uuid.UUID, status string) error
}

