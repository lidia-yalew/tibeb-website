package unit

import (
	"context"
	"tamcon-backend/domain"
	"tamcon-backend/usecase"
	"time"

	"github.com/google/uuid"
	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
	"gorm.io/gorm"
)

type mockImageRepo struct {
	CreateFunc           func(ctx context.Context, image *domain.Image) (*domain.Image, error)
	UpdateFunc           func(ctx context.Context, image *domain.Image) (*domain.Image, error)
	GetByIDFunc          func(ctx context.Context, id uuid.UUID) (*domain.Image, error)
	GetCoverFunc         func(ctx context.Context, entityType domain.EntityType, entityID uuid.UUID) (*domain.Image, error)
	SetCoverFunc         func(ctx context.Context, id uuid.UUID) error
	ListByEntityFunc     func(ctx context.Context, entityType domain.EntityType, entityID uuid.UUID) ([]*domain.Image, error)
	DeleteFunc           func(ctx context.Context, id uuid.UUID) error
	DeleteByEntityFunc   func(ctx context.Context, entityType domain.EntityType, entityID uuid.UUID) error
	DeleteByImageIdsFunc func(ctx context.Context, imageIds []string) error
	TransactionFunc      func(ctx context.Context, fn func(repo domain.ImageRepository) error) error
}

func (m *mockImageRepo) Transaction(ctx context.Context, fn func(repo domain.ImageRepository) error) error {
	if m.TransactionFunc != nil {
		return m.TransactionFunc(ctx, fn)
	}
	return fn(m)
}

func (m *mockImageRepo) Create(ctx context.Context, image *domain.Image) (*domain.Image, error) {
	return m.CreateFunc(ctx, image)
}

func (m *mockImageRepo) Update(ctx context.Context, image *domain.Image) (*domain.Image, error) {
	return m.UpdateFunc(ctx, image)
}

func (m *mockImageRepo) GetByID(ctx context.Context, id uuid.UUID) (*domain.Image, error) {
	return m.GetByIDFunc(ctx, id)
}

func (m *mockImageRepo) GetCover(ctx context.Context, entityType domain.EntityType, entityID uuid.UUID) (*domain.Image, error) {
	return m.GetCoverFunc(ctx, entityType, entityID)
}

func (m *mockImageRepo) SetCover(ctx context.Context, id uuid.UUID) error {
	return m.SetCoverFunc(ctx, id)
}

func (m *mockImageRepo) ListByEntity(ctx context.Context, entityType domain.EntityType, entityID uuid.UUID) ([]*domain.Image, error) {
	return m.ListByEntityFunc(ctx, entityType, entityID)
}

func (m *mockImageRepo) Delete(ctx context.Context, id uuid.UUID) error {
	return m.DeleteFunc(ctx, id)
}

func (m *mockImageRepo) DeleteByEntity(ctx context.Context, entityType domain.EntityType, entityID uuid.UUID) error {
	return m.DeleteByEntityFunc(ctx, entityType, entityID)
}

func (m *mockImageRepo) DeleteByImageIds(ctx context.Context, imageIds []string) error {
	return m.DeleteByImageIdsFunc(ctx, imageIds)
}

var _ = Describe("Image Usecase", func() {
	var (
		repo *mockImageRepo
		uc   domain.ImageUsecase
		ctx  context.Context
		img  *domain.Image
	)

	BeforeEach(func() {
		ctx = context.Background()
		repo = &mockImageRepo{}
		uc = usecase.NewImageUsecase(repo, 5*time.Second)
		img = &domain.Image{
			ID:           uuid.New(),
			EntityType:   domain.EntityService,
			EntityID:     uuid.New(),
			URL:          "https://cdn.example.com/cover.jpg",
			DisplayOrder: 1,
			IsCover:      true,
		}
	})

	Describe("Create", func() {
		It("creates an image", func() {
			repo.CreateFunc = func(ctx context.Context, image *domain.Image) (*domain.Image, error) {
				return image, nil
			}

			result, err := uc.Create(ctx, img)

			Expect(err).NotTo(HaveOccurred())
			Expect(result.ID).To(Equal(img.ID))
		})
	})

	Describe("GetByID", func() {
		It("returns an image by id", func() {
			repo.GetByIDFunc = func(ctx context.Context, id uuid.UUID) (*domain.Image, error) {
				return img, nil
			}

			result, err := uc.GetByID(ctx, img.ID)

			Expect(err).NotTo(HaveOccurred())
			Expect(result.ID).To(Equal(img.ID))
		})
	})

	Describe("GetCover", func() {
		It("returns the cover image", func() {
			repo.GetCoverFunc = func(ctx context.Context, entityType domain.EntityType, entityID uuid.UUID) (*domain.Image, error) {
				return img, nil
			}

			result, err := uc.GetCover(ctx, domain.EntityService, img.EntityID)

			Expect(err).NotTo(HaveOccurred())
			Expect(result.ID).To(Equal(img.ID))
		})
	})

	Describe("SetCover", func() {
		It("switches the cover image inside a transaction", func() {
			newCover := &domain.Image{
				ID:         uuid.New(),
				EntityType: domain.EntityService,
				EntityID:   img.EntityID,
				IsCover:    false,
			}
			oldCover := &domain.Image{
				ID:         uuid.New(),
				EntityType: domain.EntityService,
				EntityID:   img.EntityID,
				IsCover:    true,
			}

			repo.TransactionFunc = func(ctx context.Context, fn func(repo domain.ImageRepository) error) error {
				innerRepo := &mockImageRepo{}
				innerRepo.GetByIDFunc = func(ctx context.Context, id uuid.UUID) (*domain.Image, error) {
					return newCover, nil
				}
				innerRepo.GetCoverFunc = func(ctx context.Context, entityType domain.EntityType, entityID uuid.UUID) (*domain.Image, error) {
					return oldCover, nil
				}
				innerRepo.UpdateFunc = func(ctx context.Context, image *domain.Image) (*domain.Image, error) {
					return image, nil
				}
				return fn(innerRepo)
			}

			err := uc.SetCover(ctx, newCover.ID)

			Expect(err).NotTo(HaveOccurred())
			Expect(oldCover.IsCover).To(BeFalse())
			Expect(newCover.IsCover).To(BeTrue())
		})

		It("returns the repository error when the target image is missing", func() {
			repo.TransactionFunc = func(ctx context.Context, fn func(repo domain.ImageRepository) error) error {
				innerRepo := &mockImageRepo{}
				innerRepo.GetByIDFunc = func(ctx context.Context, id uuid.UUID) (*domain.Image, error) {
					return nil, gorm.ErrRecordNotFound
				}
				return fn(innerRepo)
			}

			err := uc.SetCover(ctx, uuid.New())
			Expect(err).To(Equal(gorm.ErrRecordNotFound))
		})
	})

	Describe("ListByEntity", func() {
		It("returns images for an entity", func() {
			repo.ListByEntityFunc = func(ctx context.Context, entityType domain.EntityType, entityID uuid.UUID) ([]*domain.Image, error) {
				return []*domain.Image{img}, nil
			}

			result, err := uc.ListByEntity(ctx, domain.EntityService, img.EntityID)

			Expect(err).NotTo(HaveOccurred())
			Expect(result).To(HaveLen(1))
		})
	})

	Describe("Delete", func() {
		It("deletes an image by id", func() {
			repo.DeleteFunc = func(ctx context.Context, id uuid.UUID) error {
				Expect(id).To(Equal(img.ID))
				return nil
			}

			err := uc.Delete(ctx, img.ID)

			Expect(err).NotTo(HaveOccurred())
		})
	})

	Describe("DeleteByImageIds", func() {
		It("delegates to the repository", func() {
			repo.DeleteByImageIdsFunc = func(ctx context.Context, imageIds []string) error {
				Expect(imageIds).To(Equal([]string{"img-1"}))
				return nil
			}

			err := uc.DeleteByImageIds(ctx, []string{"img-1"})

			Expect(err).NotTo(HaveOccurred())
		})
	})

	Describe("DeleteByEntity", func() {
		It("delegates to the repository", func() {
			repo.DeleteByEntityFunc = func(ctx context.Context, entityType domain.EntityType, entityID uuid.UUID) error {
				Expect(entityType).To(Equal(domain.EntityService))
				Expect(entityID).To(Equal(img.EntityID))
				return nil
			}

			err := uc.DeleteByEntity(ctx, domain.EntityService, img.EntityID)

			Expect(err).NotTo(HaveOccurred())
		})
	})
})
