package usecase

import (
	"context"
	"errors"
	"tamcon-backend/domain"
	"time"

	"github.com/google/uuid"
)

type contactMessageUsecase struct {
	repo    domain.ContactMessageRepository
	timeout time.Duration
}

func NewContactMessageUsecase(repo domain.ContactMessageRepository, timeout time.Duration) domain.ContactMessageUsecase {
	return &contactMessageUsecase{
		repo:    repo,
		timeout: timeout,
	}
}
func (u *contactMessageUsecase) SubmitMessage(ctx context.Context, msg *domain.ContactMessage) error {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()
	// Default values for new submissions
	msg.Status = domain.StatusUnread
	msg.SubmittedAt = time.Now()
	return u.repo.Create(ctx, msg)
}
func (u *contactMessageUsecase) ListMessages(ctx context.Context) ([]domain.ContactMessage, error) {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()
	return u.repo.GetAll(ctx)
}
func (u *contactMessageUsecase) UpdateStatus(ctx context.Context, id uuid.UUID, status domain.MessageStatus) (*domain.ContactMessage, error) {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()
	
	if status != domain.StatusUnread && status != domain.StatusRead {
		return nil, errors.New("invalid status value")
	}
	msg, err := u.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	msg.Status = status
	if err := u.repo.Update(ctx, msg); err != nil {
		return nil, err
	}
	return msg, nil
}
func (u *contactMessageUsecase) DeleteMessage(ctx context.Context, id uuid.UUID) error {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()

	_, err := u.repo.GetByID(ctx, id)
	if err != nil {
		return err
	}
	return u.repo.Delete(ctx, id)
}