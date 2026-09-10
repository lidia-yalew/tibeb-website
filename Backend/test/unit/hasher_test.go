package unit

import (
	"tamcon-backend/internal/hasher"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

var _ = Describe("Hasher Utility", func() {
	Describe("Password Hashing", func() {
		It("should successfully hash a password and verify it", func() {
			password := "securePassword123"
			hashed, err := hasher.HashPassword(password)
			Expect(err).NotTo(HaveOccurred())
			Expect(hashed).NotTo(Equal(password))

			// Verify correct password
			Expect(hasher.CheckPassword(password, hashed)).To(BeTrue())

			// Verify wrong password
			Expect(hasher.CheckPassword("wrongPassword", hashed)).To(BeFalse())
		})
	})

	Describe("SHA-256 Token Hashing", func() {
		It("should produce consistent SHA-256 hashes", func() {
			token := "sample_token_value"
			hash1 := hasher.HashToken(token)
			hash2 := hasher.HashToken(token)

			Expect(hash1).To(Equal(hash2))
			Expect(len(hash1)).To(Equal(64)) // Hex length
		})
	})
})
