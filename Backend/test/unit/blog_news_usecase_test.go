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

type mockBlogNewsRepo struct {
	CreateFunc    func(ctx context.Context, post *domain.BlogNews) (*domain.BlogNews, error)
	UpdateFunc    func(ctx context.Context, post *domain.BlogNews) (*domain.BlogNews, error)
	DeleteFunc    func(ctx context.Context, id uuid.UUID) error
	GetByIDFunc   func(ctx context.Context, id uuid.UUID) (*domain.BlogNews, error)
	GetBySlugFunc func(ctx context.Context, slug string) (*domain.BlogNews, error)
	GetAllFunc    func(ctx context.Context, category string, onlyPublished bool) ([]domain.BlogNews, error)
}

func (m *mockBlogNewsRepo) Create(ctx context.Context, post *domain.BlogNews) (*domain.BlogNews, error) {
	return m.CreateFunc(ctx, post)
}

func (m *mockBlogNewsRepo) Update(ctx context.Context, post *domain.BlogNews) (*domain.BlogNews, error) {
	return m.UpdateFunc(ctx, post)
}

func (m *mockBlogNewsRepo) Delete(ctx context.Context, id uuid.UUID) error {
	return m.DeleteFunc(ctx, id)
}

func (m *mockBlogNewsRepo) GetByID(ctx context.Context, id uuid.UUID) (*domain.BlogNews, error) {
	return m.GetByIDFunc(ctx, id)
}

func (m *mockBlogNewsRepo) GetBySlug(ctx context.Context, slug string) (*domain.BlogNews, error) {
	return m.GetBySlugFunc(ctx, slug)
}

func (m *mockBlogNewsRepo) GetAll(ctx context.Context, category string, onlyPublished bool) ([]domain.BlogNews, error) {
	return m.GetAllFunc(ctx, category, onlyPublished)
}

var _ = Describe("BlogNews Usecase", func() {
	var (
		repo *mockBlogNewsRepo
		uc   domain.BlogNewsUsecase
		ctx  context.Context
		post *domain.BlogNews
	)

	BeforeEach(func() {
		ctx = context.Background()
		post = &domain.BlogNews{
			ID:           uuid.New(),
			Category:     "blog",
			Title:        "Exciting Tech Updates",
			Content:      "<p>We have launched TAMCONPay POS integration.</p>",
			AuthorName:   "Tamcon Team",
			DisplayOrder: 1,
			IsPublished:  true,
		}
		repo = &mockBlogNewsRepo{}
		uc = usecase.NewBlogNewsUsecase(repo, 5*time.Second)
	})

	Describe("Create", func() {
		It("should successfully generate a slug from the title and create the blog post", func() {
			repo.GetBySlugFunc = func(ctx context.Context, slug string) (*domain.BlogNews, error) {
				return nil, errors.New("not found")
			}
			repo.CreateFunc = func(ctx context.Context, p *domain.BlogNews) (*domain.BlogNews, error) {
				return p, nil
			}

			result, err := uc.Create(ctx, post)
			Expect(err).NotTo(HaveOccurred())
			Expect(result.Slug).To(Equal("exciting-tech-updates"))
			Expect(result.PublishedAt).NotTo(BeNil())
		})

		It("should append a suffix to the generated slug if duplicate exists", func() {
			repo.GetBySlugFunc = func(ctx context.Context, slug string) (*domain.BlogNews, error) {
				return &domain.BlogNews{Slug: "exciting-tech-updates"}, nil
			}
			repo.CreateFunc = func(ctx context.Context, p *domain.BlogNews) (*domain.BlogNews, error) {
				return p, nil
			}

			result, err := uc.Create(ctx, post)
			Expect(err).NotTo(HaveOccurred())
			Expect(result.Slug).To(ContainSubstring("exciting-tech-updates-"))
		})
	})

	Describe("Update", func() {
		It("should update the post and set published_at if is_published goes true", func() {
			repo.UpdateFunc = func(ctx context.Context, p *domain.BlogNews) (*domain.BlogNews, error) {
				return p, nil
			}

			post.IsPublished = true
			result, err := uc.Update(ctx, post)
			Expect(err).NotTo(HaveOccurred())
			Expect(result.PublishedAt).NotTo(BeNil())
		})
	})

	Describe("Delete", func() {
		It("should successfully delete a post", func() {
			repo.DeleteFunc = func(ctx context.Context, id uuid.UUID) error {
				Expect(id).To(Equal(post.ID))
				return nil
			}

			err := uc.Delete(ctx, post.ID)
			Expect(err).NotTo(HaveOccurred())
		})
	})

	Describe("GetByID", func() {
		It("should retrieve the post by ID", func() {
			repo.GetByIDFunc = func(ctx context.Context, id uuid.UUID) (*domain.BlogNews, error) {
				return post, nil
			}

			result, err := uc.GetByID(ctx, post.ID)
			Expect(err).NotTo(HaveOccurred())
			Expect(result.ID).To(Equal(post.ID))
		})
	})

	Describe("GetBySlug", func() {
		It("should retrieve the post by Slug", func() {
			repo.GetBySlugFunc = func(ctx context.Context, slug string) (*domain.BlogNews, error) {
				post.Slug = slug
				return post, nil
			}

			result, err := uc.GetBySlug(ctx, "exciting-tech-updates")
			Expect(err).NotTo(HaveOccurred())
			Expect(result.Slug).To(Equal("exciting-tech-updates"))
		})
	})

	Describe("GetAll", func() {
		It("should retrieve all posts matching category and publish status filters", func() {
			repo.GetAllFunc = func(ctx context.Context, category string, onlyPublished bool) ([]domain.BlogNews, error) {
				Expect(category).To(Equal("blog"))
				Expect(onlyPublished).To(BeTrue())
				return []domain.BlogNews{*post}, nil
			}

			list, err := uc.GetAll(ctx, "blog", true)
			Expect(err).NotTo(HaveOccurred())
			Expect(len(list)).To(Equal(1))
		})
	})

	Describe("TogglePublish", func() {
		It("should invert publish status and update DB", func() {
			repo.GetByIDFunc = func(ctx context.Context, id uuid.UUID) (*domain.BlogNews, error) {
				post.IsPublished = false
				return post, nil
			}
			repo.UpdateFunc = func(ctx context.Context, p *domain.BlogNews) (*domain.BlogNews, error) {
				return p, nil
			}

			result, err := uc.TogglePublish(ctx, post.ID)
			Expect(err).NotTo(HaveOccurred())
			Expect(result.IsPublished).To(BeTrue())
			Expect(result.PublishedAt).NotTo(BeNil())
		})
	})
})
