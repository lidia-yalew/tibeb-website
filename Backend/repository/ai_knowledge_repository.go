package repository

import (
	"context"
	"errors"

	"gorm.io/gorm"
	"tamcon-backend/domain"
)

type aiKnowledgeRepository struct {
	db *gorm.DB
}

func NewAIKnowledgeRepository(db *gorm.DB) domain.AIKnowledgeRepository {
	return &aiKnowledgeRepository{db: db}
}

func (r *aiKnowledgeRepository) Get(ctx context.Context) (domain.AIKnowledge, error) {
	var k domain.AIKnowledge
	err := r.db.WithContext(ctx).First(&k).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.AIKnowledge{Content: ""}, nil
		}
		return domain.AIKnowledge{}, err
	}
	return k, nil
}

func (r *aiKnowledgeRepository) Upsert(ctx context.Context, content string) error {
	var k domain.AIKnowledge
	err := r.db.WithContext(ctx).First(&k).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		k.Content = content
		return r.db.WithContext(ctx).Create(&k).Error
	}

	k.Content = content
	return r.db.WithContext(ctx).Save(&k).Error
}
