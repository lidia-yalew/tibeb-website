package usecase

import (
	"context"
	"time"

	"tamcon-backend/domain"
)

type aiKnowledgeUsecase struct {
	repo           domain.AIKnowledgeRepository
	contextTimeout time.Duration
}

func NewAIKnowledgeUsecase(repo domain.AIKnowledgeRepository, timeout time.Duration) domain.AIKnowledgeUsecase {
	return &aiKnowledgeUsecase{
		repo:           repo,
		contextTimeout: timeout,
	}
}

func (u *aiKnowledgeUsecase) GetKnowledge(c context.Context) (domain.AIKnowledge, error) {
	ctx, cancel := context.WithTimeout(c, u.contextTimeout)
	defer cancel()
	return u.repo.Get(ctx)
}

func (u *aiKnowledgeUsecase) UpdateKnowledge(c context.Context, content string) error {
	ctx, cancel := context.WithTimeout(c, u.contextTimeout)
	defer cancel()
	return u.repo.Upsert(ctx, content)
}
