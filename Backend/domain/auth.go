package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type RefreshToken struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	StaffUserID uuid.UUID `gorm:"type:uuid;not null"`
	TokenHash   string    `gorm:"type:varchar(255);uniqueIndex;not null"`
	ExpiresAt   time.Time `gorm:"type:timestamptz;not null"`
	Revoked     bool      `gorm:"type:boolean;not null;default:false"`
	CreatedAt   time.Time `gorm:"type:timestamptz;not null;default:now()"`
}

func (RefreshToken) TableName() string {
	return "refresh_tokens"
}

type RefreshTokenRepository interface {
	Create(ctx context.Context, token *RefreshToken) error
	GetByHash(ctx context.Context, hash string) (*RefreshToken, error)
	Update(ctx context.Context, token *RefreshToken) error
	RevokeAllByUserID(ctx context.Context, userID uuid.UUID) error 

}

type AuthUsecase interface {
	Login(ctx context.Context, email, password string) (*StaffUser, string, string, error)
	RefreshToken(ctx context.Context, refreshTokenStr string) (string, string, error)
	Logout(ctx context.Context, refreshTokenStr string, allDevices bool) error
	ForgotPassword(ctx context.Context, email string) error
	ResetPassword(ctx context.Context, token, newPassword string) error
}
