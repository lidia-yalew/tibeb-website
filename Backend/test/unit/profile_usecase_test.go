package unit

import (
	"context"
	"time"

	"tamcon-backend/domain"
	"tamcon-backend/internal/hasher"
	"tamcon-backend/usecase"

	"github.com/google/uuid"
	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

// --- Specs ---
var _ = Describe("Staff User Profile Usecase", func() {
	var (
		profileUsecase domain.StaffUserUsecase
		userRepo       *mockUserRepo
		ctx            context.Context
		testUser       *domain.StaffUser
		rawPassword    string
	)

	BeforeEach(func() {
		ctx = context.Background()
		rawPassword = "oldSecurePassword123"
		hashedPassword, _ := hasher.HashPassword(rawPassword)

		testUser = &domain.StaffUser{
			ID:           uuid.New(),
			FirstName:    "John",
			LastName:     "Doe",
			Email:        "john.doe@test.com",
			PasswordHash: hashedPassword,
			Role:         "Editor",
			Status:       "ACTIVE",
		}

		userRepo = &mockUserRepo{
			GetByIDFunc: func(ctx context.Context, id uuid.UUID) (*domain.StaffUser, error) {
				if id == testUser.ID {
					return testUser, nil
				}
				return nil, nil
			},
			UpdateFunc: func(ctx context.Context, user *domain.StaffUser) error {
				return nil
			},
		}

		profileUsecase = usecase.NewStaffUserUsecase(userRepo, 2*time.Second)
	})

	Describe("GetProfile", func() {
		It("should successfully return user profile by ID", func() {
			user, err := profileUsecase.GetProfile(ctx, testUser.ID)
			Expect(err).NotTo(HaveOccurred())
			Expect(user).NotTo(BeNil())
			Expect(user.ID).To(Equal(testUser.ID))
			Expect(user.Email).To(Equal(testUser.Email))
		})

		It("should return error if user is not found", func() {
			user, err := profileUsecase.GetProfile(ctx, uuid.New())
			Expect(err).To(HaveOccurred())
			Expect(err.Error()).To(Equal("User not found"))
			Expect(user).To(BeNil())
		})
	})

	Describe("UpdateProfile", func() {
		It("should successfully update first and last names", func() {
			userRepo.UpdateFunc = func(ctx context.Context, user *domain.StaffUser) error {
				testUser.FirstName = user.FirstName
				testUser.LastName = user.LastName
				return nil
			}

			updatedUser, err := profileUsecase.UpdateProfile(ctx, testUser.ID, "Jane", "Smith")
			Expect(err).NotTo(HaveOccurred())
			Expect(updatedUser).NotTo(BeNil())
			Expect(updatedUser.FirstName).To(Equal("Jane"))
			Expect(updatedUser.LastName).To(Equal("Smith"))
		})

		It("should return error if user to update does not exist", func() {
			_, err := profileUsecase.UpdateProfile(ctx, uuid.New(), "Jane", "Smith")
			Expect(err).To(HaveOccurred())
			Expect(err.Error()).To(Equal("User not found"))
		})
	})

	Describe("UpdatePassword", func() {
		It("should successfully change password when old password matches", func() {
			originalHash := testUser.PasswordHash

			var updatedUserHash string
			userRepo.UpdateFunc = func(ctx context.Context, user *domain.StaffUser) error {
				updatedUserHash = user.PasswordHash
				return nil
			}

			err := profileUsecase.UpdatePassword(ctx, testUser.ID, rawPassword, "newSecurePassword12345")
			Expect(err).NotTo(HaveOccurred())
			Expect(updatedUserHash).NotTo(BeEmpty())
			// 2. Compare against the original captured hash!
			Expect(updatedUserHash).NotTo(Equal(originalHash))
			Expect(hasher.CheckPassword("newSecurePassword12345", updatedUserHash)).To(BeTrue())
		})


		It("should return error if old password is incorrect", func() {
			err := profileUsecase.UpdatePassword(ctx, testUser.ID, "wrongPassword123", "newSecurePassword12345")
			Expect(err).To(HaveOccurred())
			Expect(err.Error()).To(Equal("Invalid password"))
		})

		It("should return error if user does not exist", func() {
			err := profileUsecase.UpdatePassword(ctx, uuid.New(), rawPassword, "newSecurePassword12345")
			Expect(err).To(HaveOccurred())
			Expect(err.Error()).To(Equal("User not found"))
		})
	})
})
