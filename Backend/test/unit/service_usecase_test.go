package unit

import (
	"context"
	"errors"
	"time"

	"tamcon-backend/domain"
	"tamcon-backend/usecase"

	"github.com/google/uuid"
	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

type mockServiceRepo struct {
	CreateFunc  func(ctx context.Context, s *domain.Service) (*domain.Service, error)
	UpdateFunc  func(ctx context.Context, s *domain.Service) (*domain.Service, error)
	DeleteFunc  func(ctx context.Context, id uuid.UUID) error
	GetByIDFunc func(ctx context.Context, id uuid.UUID) (*domain.Service, error)
	GetAllFunc  func(ctx context.Context, onlyPublished bool) ([]domain.Service, error)
}

func (m *mockServiceRepo) Create(ctx context.Context, s *domain.Service) (*domain.Service, error) {
	return m.CreateFunc(ctx, s)
}

func (m *mockServiceRepo) Update(ctx context.Context, s *domain.Service) (*domain.Service, error) {
	return m.UpdateFunc(ctx, s)
}

func (m *mockServiceRepo) Delete(ctx context.Context, id uuid.UUID) error {
	return m.DeleteFunc(ctx, id)
}

func (m *mockServiceRepo) GetByID(ctx context.Context, id uuid.UUID) (*domain.Service, error) {
	return m.GetByIDFunc(ctx, id)
}

func (m *mockServiceRepo) GetAll(ctx context.Context, onlyPublished bool) ([]domain.Service, error) {
	return m.GetAllFunc(ctx, onlyPublished)
}

var _ = Describe("Service Usecase", func() {

	var (
		repo *mockServiceRepo
		uc   domain.ServiceUsecase
		ctx  context.Context

		service *domain.Service
	)

	BeforeEach(func() {
		ctx = context.Background()

		service = &domain.Service{
			ID:           uuid.New(),
			Title:        "Development",
			Description:  "Software Development",
			DisplayOrder: 1,
			IsPublished:  true,
		}

		repo = &mockServiceRepo{}

		uc = usecase.NewServiceUsecase(repo, 5*time.Second)
	})

	Describe("Create", func() {

		It("should create service", func() {

			repo.CreateFunc = func(ctx context.Context, s *domain.Service) (*domain.Service, error) {
				return s, nil
			}

			result, err := uc.Create(ctx, service)

			Expect(err).NotTo(HaveOccurred())
			Expect(result.Title).To(Equal(service.Title))
		})
	})

	Describe("Update", func() {

		It("should return service not found when the service does not exist", func() {
			repo.GetByIDFunc = func(ctx context.Context, id uuid.UUID) (*domain.Service, error) {
				return nil, errors.New("db error")
			}

			result, err := uc.Update(ctx, service)

			Expect(err).To(HaveOccurred())
			Expect(err.Error()).To(Equal("service not found"))
			Expect(result).To(BeNil())
		})

		It("should update service", func() {
			repo.GetByIDFunc = func(ctx context.Context, id uuid.UUID) (*domain.Service, error) {
				return &domain.Service{}, nil
			}

			repo.UpdateFunc = func(ctx context.Context, s *domain.Service) (*domain.Service, error) {
				s.Title = "Updated"
				return s, nil
			}

			result, err := uc.Update(ctx, service)

			Expect(err).NotTo(HaveOccurred())
			Expect(result.Title).To(Equal("Updated"))
			Expect(result.UpdatedAt).NotTo(BeZero())
		})
	})

	Describe("GetByID", func() {
		It("should return a service by id", func() {
			repo.GetByIDFunc = func(ctx context.Context, id uuid.UUID) (*domain.Service, error) {
				return service, nil
			}

			result, err := uc.GetByID(ctx, service.ID)

			Expect(err).NotTo(HaveOccurred())
			Expect(result.ID).To(Equal(service.ID))
		})
	})

	Describe("Delete", func() {

		It("should delete service", func() {

			called := false

			repo.DeleteFunc = func(ctx context.Context, id uuid.UUID) error {
				called = true
				return nil
			}

			err := uc.Delete(ctx, service.ID)

			Expect(err).NotTo(HaveOccurred())
			Expect(called).To(BeTrue())
		})
	})

	Describe("GetAll", func() {

		It("should return published services", func() {

			repo.GetAllFunc = func(ctx context.Context, onlyPublished bool) ([]domain.Service, error) {
				return []domain.Service{
					*service,
				}, nil
			}

			result, err := uc.GetAll(ctx, true)

			Expect(err).NotTo(HaveOccurred())
			Expect(result).To(HaveLen(1))
			Expect(result[0].Title).To(Equal(service.Title))
		})
	})

})
