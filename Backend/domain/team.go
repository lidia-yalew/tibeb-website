package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type TeamMember struct {
	ID                 uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Name               string    `gorm:"type:varchar(150);not null" json:"name" binding:"required"`
	Role               string    `gorm:"type:varchar(150);not null" json:"role" binding:"required"`
	Department         string    `gorm:"type:varchar(150)" json:"department"`
	Bio                string    `gorm:"type:text" json:"bio"`
	PhotoURL           string    `gorm:"type:text" json:"photo_url"`
	CloudinaryPublicID string    `gorm:"type:text" json:"cloudinary_public_id"`
	CreatedAt          time.Time `gorm:"type:timestamptz;not null;default:now()" json:"created_at"`
	UpdatedAt          time.Time `gorm:"type:timestamptz;not null;default:now()" json:"updated_at"`
}

func (TeamMember) TableName() string {
	return "team"
}

type TeamRepository interface {
	Create(ctx context.Context, member *TeamMember) (*TeamMember, error)
	Update(ctx context.Context, member *TeamMember) (*TeamMember, error)
	Delete(ctx context.Context, id uuid.UUID) error
	GetByID(ctx context.Context, id uuid.UUID) (*TeamMember, error)
	GetAll(ctx context.Context) ([]TeamMember, error)
}

type TeamUsecase interface {
	Create(ctx context.Context, member *TeamMember) (*TeamMember, error)
	Update(ctx context.Context, member *TeamMember) (*TeamMember, error)
	Delete(ctx context.Context, id uuid.UUID) error
	GetByID(ctx context.Context, id uuid.UUID) (*TeamMember, error)
	GetAll(ctx context.Context) ([]TeamMember, error)
}
