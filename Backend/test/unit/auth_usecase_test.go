package unit

import (
	"context"
	"time"

	"tamcon-backend/domain"
	"tamcon-backend/internal/hasher"
	"tamcon-backend/internal/token"
	"tamcon-backend/usecase"

	"github.com/google/uuid"
	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

// --- Mock StaffUserRepository ---
type mockUserRepo struct {
	GetByEmailFunc func(ctx context.Context, email string) (*domain.StaffUser, error)
	GetByIDFunc    func(ctx context.Context, id uuid.UUID) (*domain.StaffUser, error)
	UpdateFunc     func(ctx context.Context, user *domain.StaffUser) error
	GetAllFunc     func(ctx context.Context) ([]domain.StaffUser, error)
}

func (m *mockUserRepo) Create(ctx context.Context, user *domain.StaffUser) error { return nil }
func (m *mockUserRepo) GetByID(ctx context.Context, id uuid.UUID) (*domain.StaffUser, error) {
	return m.GetByIDFunc(ctx, id) 
}
func (m *mockUserRepo) GetByEmail(ctx context.Context, email string) (*domain.StaffUser, error) {
	return m.GetByEmailFunc(ctx, email)
}
func (m *mockUserRepo) Update(ctx context.Context, user *domain.StaffUser) error {
	return m.UpdateFunc(ctx, user)
}
func (m *mockUserRepo) GetAll(ctx context.Context) ([]domain.StaffUser, error) {
	if m.GetAllFunc != nil {
		return m.GetAllFunc(ctx)
	}
	return nil, nil
}

// --- Mock RefreshTokenRepository ---
type mockRefreshTokenRepo struct {
	CreateFunc            func(ctx context.Context, token *domain.RefreshToken) error
	GetByHashFunc         func(ctx context.Context, hash string) (*domain.RefreshToken, error) 
	UpdateFunc            func(ctx context.Context, token *domain.RefreshToken) error         
	RevokeAllByUserIDFunc func(ctx context.Context, userID uuid.UUID) error                   
}

func (m *mockRefreshTokenRepo) Create(ctx context.Context, token *domain.RefreshToken) error {
	return m.CreateFunc(ctx, token)
}
func (m *mockRefreshTokenRepo) GetByHash(ctx context.Context, hash string) (*domain.RefreshToken, error) {
	return m.GetByHashFunc(ctx, hash) 
}
func (m *mockRefreshTokenRepo) Update(ctx context.Context, token *domain.RefreshToken) error {
	return m.UpdateFunc(ctx, token) 
}
func (m *mockRefreshTokenRepo) RevokeAllByUserID(ctx context.Context, userID uuid.UUID) error {
	return m.RevokeAllByUserIDFunc(ctx, userID) 
}

// --- Specs ---
var _ = Describe("Auth Usecase", func() {
	var (
		authUsecase      domain.AuthUsecase
		userRepo         *mockUserRepo
		refreshTokenRepo *mockRefreshTokenRepo
		tokenService     *token.TokenService
		ctx              context.Context
		testUser         *domain.StaffUser
		rawPassword      string
	)

	BeforeEach(func() {
		ctx = context.Background()
		rawPassword = "secretPassword123"
		hashedPassword, _ := hasher.HashPassword(rawPassword)

		testUser = &domain.StaffUser{
			ID:           uuid.New(),
			FirstName:    "Test",
			LastName:     "Admin",
			Email:        "admin@test.com",
			PasswordHash: hashedPassword,
			Role:         "Editor",
			Status:       "ACTIVE",
		}

		userRepo = &mockUserRepo{
			GetByEmailFunc: func(ctx context.Context, email string) (*domain.StaffUser, error) {
				if email == testUser.Email {
					return testUser, nil
				}
				return nil, nil
			},
			UpdateFunc: func(ctx context.Context, user *domain.StaffUser) error {
				return nil
			},
		}

		refreshTokenRepo = &mockRefreshTokenRepo{
			CreateFunc: func(ctx context.Context, token *domain.RefreshToken) error {
				return nil
			},
		}

		tokenService = token.NewTokenService("my_test_secret_key_which_is_long_enough", 15*time.Minute, 168*time.Hour)
		authUsecase = usecase.NewAuthUsecase(userRepo, refreshTokenRepo, tokenService, 5*time.Second)
	})

	Describe("Login", func() {
		Context("with valid credentials", func() {
			It("should successfully authenticate and return user + tokens", func() {
				user, accessToken, refreshToken, err := authUsecase.Login(ctx, testUser.Email, rawPassword)

				Expect(err).NotTo(HaveOccurred())
				Expect(user.Email).To(Equal(testUser.Email))
				Expect(accessToken).NotTo(BeEmpty())
				Expect(refreshToken).NotTo(BeEmpty())
			})
		})

		Context("with non-existent email", func() {
			It("should return an invalid email or password error", func() {
				_, _, _, err := authUsecase.Login(ctx, "nonexistent@test.com", rawPassword)

				Expect(err).To(HaveOccurred())
				Expect(err.Error()).To(Equal("invalid email or password"))
			})
		})

		Context("with incorrect password", func() {
			It("should return an invalid email or password error", func() {
				_, _, _, err := authUsecase.Login(ctx, testUser.Email, "wrongPassword")

				Expect(err).To(HaveOccurred())
				Expect(err.Error()).To(Equal("invalid email or password"))
			})
		})

		Context("with inactive user status", func() {
			BeforeEach(func() {
				testUser.Status = "INACTIVE"
			})

			It("should return a user inactive error", func() {
				_, _, _, err := authUsecase.Login(ctx, testUser.Email, rawPassword)

				Expect(err).To(HaveOccurred())
				Expect(err.Error()).To(Equal("user is inactive or suspended"))
			})
		})
	})

		Describe("RefreshToken", func() {
		var (
			rawRefreshToken string
			hashedToken     string
			dbToken         *domain.RefreshToken
		)

		BeforeEach(func() {
			var err error
			rawRefreshToken, _, err = tokenService.GenerateRefreshToken(testUser.ID.String())
			Expect(err).NotTo(HaveOccurred())
			hashedToken = hasher.HashToken(rawRefreshToken)

			dbToken = &domain.RefreshToken{
				ID:          uuid.New(),
				StaffUserID: testUser.ID,
				TokenHash:   hashedToken,
				ExpiresAt:   time.Now().Add(168 * time.Hour),
				Revoked:     false,
			}

			// Mock repositories behaviour
			refreshTokenRepo.CreateFunc = func(ctx context.Context, token *domain.RefreshToken) error {
				return nil
			}

			userRepo.GetByIDFunc = func(ctx context.Context, id uuid.UUID) (*domain.StaffUser, error) {
				if id == testUser.ID {
					return testUser, nil
				}
				return nil, nil
			}
		})

		Context("with valid refresh token", func() {
			BeforeEach(func() {
				refreshTokenRepo.GetByHashFunc = func(ctx context.Context, hash string) (*domain.RefreshToken, error) {
					if hash == hashedToken {
						return dbToken, nil
					}
					return nil, nil
				}
				refreshTokenRepo.UpdateFunc = func(ctx context.Context, token *domain.RefreshToken) error {
					return nil
				}
			})

			It("should rotate session and return new access & refresh tokens", func() {
				newAccess, newRefresh, err := authUsecase.RefreshToken(ctx, rawRefreshToken)

				Expect(err).NotTo(HaveOccurred())
				Expect(newAccess).NotTo(BeEmpty())
				Expect(newRefresh).NotTo(BeEmpty())
				Expect(dbToken.Revoked).To(BeTrue()) // Verifies it was rotated/revoked
			})
		})

		Context("when token is expired in DB", func() {
			BeforeEach(func() {
				dbToken.ExpiresAt = time.Now().Add(-1 * time.Hour) // Set past expiry
				refreshTokenRepo.GetByHashFunc = func(ctx context.Context, hash string) (*domain.RefreshToken, error) {
					return dbToken, nil
				}
			})

			It("should return session expired error", func() {
				_, _, err := authUsecase.RefreshToken(ctx, rawRefreshToken)
				Expect(err).To(HaveOccurred())
				Expect(err.Error()).To(Equal("session has expired"))
			})
		})

		Context("when token is already revoked", func() {
			BeforeEach(func() {
				refreshTokenRepo.GetByHashFunc = func(ctx context.Context, hash string) (*domain.RefreshToken, error) {
					return nil, nil // Represents missing/revoked
				}
			})

			It("should return session not found error", func() {
				_, _, err := authUsecase.RefreshToken(ctx, rawRefreshToken)
				Expect(err).To(HaveOccurred())
				Expect(err.Error()).To(Equal("session not found or already revoked"))
			})
		})
	})

	Describe("Logout", func() {
		var (
			rawRefreshToken string
			hashedToken     string
			dbToken         *domain.RefreshToken
			revokedAllCalls int
			updateCalls     int
		)

		BeforeEach(func() {
			var err error
			rawRefreshToken, _, err = tokenService.GenerateRefreshToken(testUser.ID.String())
			Expect(err).NotTo(HaveOccurred())
			hashedToken = hasher.HashToken(rawRefreshToken)

			dbToken = &domain.RefreshToken{
				ID:          uuid.New(),
				StaffUserID: testUser.ID,
				TokenHash:   hashedToken,
				ExpiresAt:   time.Now().Add(168 * time.Hour),
				Revoked:     false,
			}

			revokedAllCalls = 0
			updateCalls = 0

			refreshTokenRepo.GetByHashFunc = func(ctx context.Context, hash string) (*domain.RefreshToken, error) {
				if hash == hashedToken {
					return dbToken, nil
				}
				return nil, nil
			}

			refreshTokenRepo.UpdateFunc = func(ctx context.Context, token *domain.RefreshToken) error {
				updateCalls++
				return nil
			}

			// Add Mock method to mockRefreshTokenRepo struct inside test file to keep compiler happy:
			refreshTokenRepo.RevokeAllByUserIDFunc = func(ctx context.Context, userID uuid.UUID) error {
				revokedAllCalls++
				return nil
			}
		})

		Context("Single device logout (allDevices = false)", func() {
			It("should revoke only the current token", func() {
				err := authUsecase.Logout(ctx, rawRefreshToken, false)
				Expect(err).NotTo(HaveOccurred())
				Expect(dbToken.Revoked).To(BeTrue())
				Expect(updateCalls).To(Equal(1))
				Expect(revokedAllCalls).To(Equal(0))
			})
		})

		Context("Global logout (allDevices = true)", func() {
			It("should revoke all tokens for this user", func() {
				err := authUsecase.Logout(ctx, rawRefreshToken, true)
				Expect(err).NotTo(HaveOccurred())
				Expect(revokedAllCalls).To(Equal(1))
				Expect(updateCalls).To(Equal(0))
			})
		})
	})


})


