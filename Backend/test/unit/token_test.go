package unit

import (
	"time"

	"tamcon-backend/internal/token"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

var _ = Describe("Token Service", func() {
	var tokenService *token.TokenService
	secret := "my_test_secret_key_which_is_long_enough"

	BeforeEach(func() {
		// Initialize service with 1s Access TTL and 2s Refresh TTL for quick expiration checks
		tokenService = token.NewTokenService(secret, 1*time.Second, 2*time.Second)
	})

	Describe("Access Token", func() {
		It("should successfully generate and validate a token", func() {
			userID := "6e8699ea-5dfa-4c99-a37f-132027b78c61"
			email := "admin@test.com"
			role := "Editor"

			tokenStr, err := tokenService.GenerateAccessToken(userID, email, role)
			Expect(err).NotTo(HaveOccurred())
			Expect(tokenStr).NotTo(BeEmpty())

			claims, err := tokenService.ValidateToken(tokenStr)
			Expect(err).NotTo(HaveOccurred())
			Expect(claims.UserID).To(Equal(userID))
			Expect(claims.Email).To(Equal(email))
			Expect(claims.Role).To(Equal(role))
		})

		It("should fail validation if the token expires", func() {
			tokenStr, _ := tokenService.GenerateAccessToken("user123", "test@test.com", "Editor")
			
			// Wait for 1s token expiration
			time.Sleep(1100 * time.Millisecond)

			_, err := tokenService.ValidateToken(tokenStr)
			Expect(err).To(HaveOccurred())
		})
	})

	Describe("Refresh Token", func() {
		It("should generate a refresh token with the correct expiration time", func() {
			userID := "6e8699ea-5dfa-4c99-a37f-132027b78c61"
			tokenStr, expiresAt, err := tokenService.GenerateRefreshToken(userID)

			Expect(err).NotTo(HaveOccurred())
			Expect(tokenStr).NotTo(BeEmpty())
			Expect(expiresAt).To(BeTemporally(">", time.Now()))
			Expect(expiresAt).To(BeTemporally("<", time.Now().Add(3*time.Second)))
		})
	})
})
