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

type mockProductRepo struct {
	CreateFunc  func(ctx context.Context, p *domain.Product) (*domain.Product, error)
	UpdateFunc  func(ctx context.Context, p *domain.Product) (*domain.Product, error)
	DeleteFunc  func(ctx context.Context, id uuid.UUID) error
	GetByIDFunc func(ctx context.Context, id uuid.UUID) (*domain.Product, error)
	GetAllFunc  func(ctx context.Context, onlyPublished bool) ([]domain.Product, error)
}

func (m *mockProductRepo) Create(ctx context.Context, p *domain.Product) (*domain.Product, error) {
	return m.CreateFunc(ctx, p)
}

func (m *mockProductRepo) Update(ctx context.Context, p *domain.Product) (*domain.Product, error) {
	return m.UpdateFunc(ctx, p)
}

func (m *mockProductRepo) Delete(ctx context.Context, id uuid.UUID) error {
	return m.DeleteFunc(ctx, id)
}

func (m *mockProductRepo) GetByID(ctx context.Context, id uuid.UUID) (*domain.Product, error) {
	return m.GetByIDFunc(ctx, id)
}

func (m *mockProductRepo) GetAll(ctx context.Context, onlyPublished bool) ([]domain.Product, error) {
	return m.GetAllFunc(ctx, onlyPublished)
}

var _ = Describe("Product Usecase", func() {

	var (
		repo    *mockProductRepo
		uc      domain.ProductUsecase
		ctx     context.Context
		product *domain.Product
	)

	BeforeEach(func() {
		ctx = context.Background()

		product = &domain.Product{
			ID:           uuid.New(),
			Name:         "Example Product",
			Description:  "A great product",
			Category:     "Gaming",
			WebsiteURL:   "https://example.com",
			DisplayOrder: 1,
			IsPublished:  true,
		}

		repo = &mockProductRepo{}

		uc = usecase.NewProductUsecase(repo, 5*time.Second)
	})

	Describe("Create", func() {

		It("should create product", func() {

			repo.CreateFunc = func(ctx context.Context, p *domain.Product) (*domain.Product, error) {
				return p, nil
			}

			result, err := uc.Create(ctx, product)

			Expect(err).NotTo(HaveOccurred())
			Expect(result.Name).To(Equal(product.Name))
		})

		It("should handle create error", func() {
			repo.CreateFunc = func(ctx context.Context, p *domain.Product) (*domain.Product, error) {
				return nil, errors.New("database error")
			}

			result, err := uc.Create(ctx, product)

			Expect(err).To(HaveOccurred())
			Expect(result).To(BeNil())
		})
	})

	Describe("Update", func() {

		It("should return product not found when the product does not exist", func() {
			repo.GetByIDFunc = func(ctx context.Context, id uuid.UUID) (*domain.Product, error) {
				return nil, errors.New("db error")
			}

			result, err := uc.Update(ctx, product)

			Expect(err).To(HaveOccurred())
			Expect(err.Error()).To(Equal("product not found"))
			Expect(result).To(BeNil())
		})

		It("should update product", func() {
			repo.GetByIDFunc = func(ctx context.Context, id uuid.UUID) (*domain.Product, error) {
				return &domain.Product{}, nil
			}

			repo.UpdateFunc = func(ctx context.Context, p *domain.Product) (*domain.Product, error) {
				p.Name = "Updated Product"
				return p, nil
			}

			result, err := uc.Update(ctx, product)

			Expect(err).NotTo(HaveOccurred())
			Expect(result.Name).To(Equal("Updated Product"))
			Expect(result.UpdatedAt).NotTo(BeZero())
		})

		It("should handle update error", func() {
			repo.GetByIDFunc = func(ctx context.Context, id uuid.UUID) (*domain.Product, error) {
				return &domain.Product{}, nil
			}

			repo.UpdateFunc = func(ctx context.Context, p *domain.Product) (*domain.Product, error) {
				return nil, errors.New("database error")
			}

			result, err := uc.Update(ctx, product)

			Expect(err).To(HaveOccurred())
			Expect(result).To(BeNil())
		})
	})

	Describe("GetByID", func() {
		It("should return a product by id", func() {
			repo.GetByIDFunc = func(ctx context.Context, id uuid.UUID) (*domain.Product, error) {
				return product, nil
			}

			result, err := uc.GetByID(ctx, product.ID)

			Expect(err).NotTo(HaveOccurred())
			Expect(result.ID).To(Equal(product.ID))
			Expect(result.Name).To(Equal(product.Name))
		})

		It("should return error when product not found", func() {
			repo.GetByIDFunc = func(ctx context.Context, id uuid.UUID) (*domain.Product, error) {
				return nil, errors.New("not found")
			}

			result, err := uc.GetByID(ctx, product.ID)

			Expect(err).To(HaveOccurred())
			Expect(result).To(BeNil())
		})
	})

	Describe("Delete", func() {

		It("should delete product", func() {

			called := false

			repo.DeleteFunc = func(ctx context.Context, id uuid.UUID) error {
				called = true
				return nil
			}

			err := uc.Delete(ctx, product.ID)

			Expect(err).NotTo(HaveOccurred())
			Expect(called).To(BeTrue())
		})

		It("should handle delete error", func() {
			repo.DeleteFunc = func(ctx context.Context, id uuid.UUID) error {
				return errors.New("database error")
			}

			err := uc.Delete(ctx, product.ID)

			Expect(err).To(HaveOccurred())
		})
	})

	Describe("GetAll", func() {

		It("should return published products only when onlyPublished is true", func() {

			repo.GetAllFunc = func(ctx context.Context, onlyPublished bool) ([]domain.Product, error) {
				if onlyPublished {
					return []domain.Product{
						*product,
					}, nil
				}
				return []domain.Product{}, nil
			}

			result, err := uc.GetAll(ctx, true)

			Expect(err).NotTo(HaveOccurred())
			Expect(result).To(HaveLen(1))
			Expect(result[0].Name).To(Equal(product.Name))
			Expect(result[0].IsPublished).To(BeTrue())
		})

		It("should return all products when onlyPublished is false", func() {

			repo.GetAllFunc = func(ctx context.Context, onlyPublished bool) ([]domain.Product, error) {
				return []domain.Product{
					*product,
					{
						ID:           uuid.New(),
						Name:         "Unpublished Product",
						Description:  "Not published yet",
						DisplayOrder: 2,
						IsPublished:  false,
					},
				}, nil
			}

			result, err := uc.GetAll(ctx, false)

			Expect(err).NotTo(HaveOccurred())
			Expect(result).To(HaveLen(2))
		})

		It("should handle GetAll error", func() {
			repo.GetAllFunc = func(ctx context.Context, onlyPublished bool) ([]domain.Product, error) {
				return nil, errors.New("database error")
			}

			result, err := uc.GetAll(ctx, true)

			Expect(err).To(HaveOccurred())
			Expect(result).To(BeNil())
		})
	})

})
