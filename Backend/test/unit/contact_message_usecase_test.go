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

// --- Mock Repository ---
type mockContactRepo struct {
	CreateFunc  func(ctx context.Context, msg *domain.ContactMessage) error
	GetAllFunc  func(ctx context.Context) ([]domain.ContactMessage, error)
	GetByIDFunc func(ctx context.Context, id uuid.UUID) (*domain.ContactMessage, error)
	UpdateFunc  func(ctx context.Context, msg *domain.ContactMessage) error
	DeleteFunc  func(ctx context.Context, id uuid.UUID) error
}

func (m *mockContactRepo) Create(ctx context.Context, msg *domain.ContactMessage) error {
	return m.CreateFunc(ctx, msg)
}
func (m *mockContactRepo) GetAll(ctx context.Context) ([]domain.ContactMessage, error) {
	return m.GetAllFunc(ctx)
}
func (m *mockContactRepo) GetByID(ctx context.Context, id uuid.UUID) (*domain.ContactMessage, error) {
	return m.GetByIDFunc(ctx, id)
}
func (m *mockContactRepo) Update(ctx context.Context, msg *domain.ContactMessage) error {
	return m.UpdateFunc(ctx, msg)
}
func (m *mockContactRepo) Delete(ctx context.Context, id uuid.UUID) error {
	return m.DeleteFunc(ctx, id)
}

// --- Specs ---
var _ = Describe("Contact Message Usecase Test", func() {
	var (
		ctx            context.Context
		repo           *mockContactRepo
		msgUsecase     domain.ContactMessageUsecase
		testMsg        *domain.ContactMessage
		optionalPhone  string
		optionalOrg    string
		optionalSubj   string
	)

	BeforeEach(func() {
		ctx = context.Background()
		repo = &mockContactRepo{}
		msgUsecase = usecase.NewContactMessageUsecase(repo, 2*time.Second)

		optionalPhone = "+251911234567"
		optionalOrg = "Tamcon PLC"
		optionalSubj = "Project Inquiry"

		testMsg = &domain.ContactMessage{
			ID:           uuid.New(),
			Name:         "Abebe Kebede",
			Email:        "abebe@example.com",
			Phone:        &optionalPhone,
			Organization: &optionalOrg,
			Subject:      &optionalSubj,
			Message:      "I would like to request a demo of your payment software.",
			Status:       domain.StatusUnread,
			SubmittedAt:  time.Now(),
		}
	})

	Describe("SubmitMessage", func() {
		It("should successfully save the message and default status to unread", func() {
			repo.CreateFunc = func(ctx context.Context, msg *domain.ContactMessage) error {
				Expect(msg.Name).To(Equal(testMsg.Name))
				Expect(msg.Status).To(Equal(domain.StatusUnread))
				Expect(msg.SubmittedAt).To(BeTemporally("~", time.Now(), 2*time.Second))
				return nil
			}

			err := msgUsecase.SubmitMessage(ctx, testMsg)
			Expect(err).NotTo(HaveOccurred())
		})
	})

	Describe("ListMessages", func() {
		It("should successfully retrieve all messages from the database", func() {
			repo.GetAllFunc = func(ctx context.Context) ([]domain.ContactMessage, error) {
				return []domain.ContactMessage{*testMsg}, nil
			}

			list, err := msgUsecase.ListMessages(ctx)
			Expect(err).NotTo(HaveOccurred())
			Expect(list).To(HaveLen(1))
			Expect(list[0].Name).To(Equal("Abebe Kebede"))
		})
	})

	Describe("UpdateStatus", func() {
		It("should successfully update status with a valid status option", func() {
			repo.GetByIDFunc = func(ctx context.Context, id uuid.UUID) (*domain.ContactMessage, error) {
				Expect(id).To(Equal(testMsg.ID))
				return testMsg, nil
			}

			repo.UpdateFunc = func(ctx context.Context, msg *domain.ContactMessage) error {
				Expect(msg.Status).To(Equal(domain.StatusRead))
				return nil
			}

			updated, err := msgUsecase.UpdateStatus(ctx, testMsg.ID, domain.StatusRead)
			Expect(err).NotTo(HaveOccurred())
			Expect(updated.Status).To(Equal(domain.StatusRead))
		})

		It("should fail and reject if status option is invalid", func() {
			_, err := msgUsecase.UpdateStatus(ctx, testMsg.ID, domain.MessageStatus("invalid-status"))
			Expect(err).To(HaveOccurred())
			Expect(err.Error()).To(ContainSubstring("invalid status value"))
		})
	})

	Describe("DeleteMessage", func() {
		It("should delete the message if it exists in the database", func() {
			repo.GetByIDFunc = func(ctx context.Context, id uuid.UUID) (*domain.ContactMessage, error) {
				return testMsg, nil
			}
			repo.DeleteFunc = func(ctx context.Context, id uuid.UUID) error {
				Expect(id).To(Equal(testMsg.ID))
				return nil
			}

			err := msgUsecase.DeleteMessage(ctx, testMsg.ID)
			Expect(err).NotTo(HaveOccurred())
		})

		It("should fail if the message does not exist", func() {
			repo.GetByIDFunc = func(ctx context.Context, id uuid.UUID) (*domain.ContactMessage, error) {
				return nil, errors.New("record not found")
			}

			err := msgUsecase.DeleteMessage(ctx, testMsg.ID)
			Expect(err).To(HaveOccurred())
		})
	})
})
