package usecase

import (
	"context"
	"errors"
	"fmt"
	"net/smtp"
	"tamcon-backend/config"
	"tamcon-backend/domain"
	"tamcon-backend/internal/hasher"
	"tamcon-backend/internal/token"
	"time"

	"github.com/google/uuid"
)

type authUsecase struct {
	userRepo     domain.StaffUserRepository
	refreshTokenRepo domain.RefreshTokenRepository
	tokenService *token.TokenService
	timeout       time.Duration
}

func NewAuthUsecase(userRepo domain.StaffUserRepository, refreshTokenRepo domain.RefreshTokenRepository, tokenService *token.TokenService, timeout time.Duration) domain.AuthUsecase {
	return &authUsecase{userRepo: userRepo, refreshTokenRepo: refreshTokenRepo, tokenService: tokenService, timeout: timeout}
}

func (a *authUsecase) Login(ctx context.Context, email, password string) (*domain.StaffUser, string, string, error) {
	ctx, cancel := context.WithTimeout(ctx, a.timeout)
	defer cancel()

	user, err := a.userRepo.GetByEmail(ctx, email)
	if err != nil {
		return nil, "", "", err
	}
	if user == nil {
		return nil, "", "", errors.New("invalid email or password")
	}
	if user.Status != "ACTIVE" {
		return nil, "", "", errors.New("user is inactive or suspended")
	}

	if !hasher.CheckPassword(password, user.PasswordHash) {
		return nil, "", "", errors.New("invalid email or password")
	}

	accessToken, err := a.tokenService.GenerateAccessToken(user.ID.String(),user.Email, user.Role)
	if err != nil {
		return nil, "", "", err
	}
	refreshToken, expiresAt, err := a.tokenService.GenerateRefreshToken(user.ID.String())
	if err != nil {
		return nil, "", "", err
	} 

	hashedToken := hasher.HashToken(refreshToken)
		
	dbToken := &domain.RefreshToken{
		StaffUserID: user.ID,
		TokenHash:   hashedToken,
		ExpiresAt:   expiresAt,
	}
	err = a.refreshTokenRepo.Create(ctx, dbToken)
	if err != nil {
		return nil, "", "", err
	}
	
	now := time.Now()
	user.LastLoginAt = &now
	a.userRepo.Update(ctx, user)

	return user, accessToken, refreshToken, nil
}


func (a *authUsecase) RefreshToken(ctx context.Context, refreshTokenStr string) (string, string, error) {
	ctx, cancel := context.WithTimeout(ctx, a.timeout)
	defer cancel()

	_, err := a.tokenService.ValidateRefreshToken(refreshTokenStr)
	if err != nil {
		return "", "", errors.New("invalid or expired session")
	}

	tokenHash := hasher.HashToken(refreshTokenStr)
	dbToken, err := a.refreshTokenRepo.GetByHash(ctx, tokenHash)
	if err != nil {
		return "", "", err
	}
	if dbToken == nil {
		return "", "", errors.New("session not found or already revoked")
	}

	if time.Now().After(dbToken.ExpiresAt) {
		return "", "", errors.New("session has expired")
	}
	user, err := a.userRepo.GetByID(ctx, dbToken.StaffUserID)
	if err != nil {
		return "", "", err
	}
	if user == nil || user.Status != "ACTIVE" {
		return "", "", errors.New("user account is inactive or not found")
	}

	dbToken.Revoked = true
	_ = a.refreshTokenRepo.Update(ctx, dbToken)

	newAccessToken, err := a.tokenService.GenerateAccessToken(user.ID.String(), user.Email, user.Role)
	if err != nil {
		return "", "", err
	}

	newRefreshToken, newExpiresAt, err := a.tokenService.GenerateRefreshToken(user.ID.String())
	if err != nil {
		return "", "", err
	}

	newHashedToken := hasher.HashToken(newRefreshToken)
	newDbToken := &domain.RefreshToken{
		StaffUserID: user.ID,
		TokenHash:   newHashedToken,
		ExpiresAt:   newExpiresAt,
	}
	err = a.refreshTokenRepo.Create(ctx, newDbToken)
	if err != nil {
		return "", "", err
	}

	return newAccessToken, newRefreshToken, nil
}

func (a *authUsecase) Logout(ctx context.Context, refreshTokenStr string, allDevices bool) error {
	ctx, cancel := context.WithTimeout(ctx, a.timeout)
	defer cancel()
	tokenHash := hasher.HashToken(refreshTokenStr)
	dbToken, err := a.refreshTokenRepo.GetByHash(ctx, tokenHash)
	if err != nil {
		return err
	}
	if dbToken == nil {
		return nil 
	}

	if allDevices {
		return a.refreshTokenRepo.RevokeAllByUserID(ctx, dbToken.StaffUserID)
	}
	
	dbToken.Revoked = true
	return a.refreshTokenRepo.Update(ctx, dbToken)
}

func (a *authUsecase) ForgotPassword(ctx context.Context, email string) error {
	ctx, cancel := context.WithTimeout(ctx, a.timeout)
	defer cancel()

	user, err := a.userRepo.GetByEmail(ctx, email)
	if err != nil || user == nil {
		// Don't leak whether the user exists
		return nil
	}

	hashPrefix := user.PasswordHash
	if len(hashPrefix) > 10 {
		hashPrefix = hashPrefix[:10]
	}

	tokenStr, err := a.tokenService.GeneratePasswordResetToken(user.ID.String(), hashPrefix)
	if err != nil {
		return err
	}

	clientURL := config.Get().CorsURL
	var cURL string
	if len(clientURL) > 0 {
		cURL = clientURL[0]
	} else {
		cURL = "http://localhost:5173"
	}
	resetLink := fmt.Sprintf("%s/admin/reset-password?token=%s", cURL, tokenStr)

	// Send Email
	go func(recipientEmail, resetLink string) {
		senderEmail := config.Get().EmailUser
		senderPass := config.Get().EmailPass
		if senderEmail == "" || senderPass == "" {
			fmt.Printf("Forgot Password link for %s: %s\n", recipientEmail, resetLink)
			return
		}

		auth := smtp.PlainAuth("", senderEmail, senderPass, "smtp.gmail.com")
		to := []string{recipientEmail}
		msg := fmt.Appendf(nil, "To: %s\r\n"+
			"Subject: Password Reset Request\r\n"+
			"\r\n"+
			"Click the following link to reset your password. This link will expire in 15 minutes.\r\n\r\n%s\r\n", recipientEmail, resetLink)

		err := smtp.SendMail("smtp.gmail.com:587", auth, senderEmail, to, msg)
		if err != nil {
			fmt.Printf("Failed to send reset email to %s: %v\n", recipientEmail, err)
		}
	}(user.Email, resetLink)

	return nil
}

func (a *authUsecase) ResetPassword(ctx context.Context, tokenStr, newPassword string) error {
	ctx, cancel := context.WithTimeout(ctx, a.timeout)
	defer cancel()

	userID, hashPrefix, err := a.tokenService.ValidatePasswordResetToken(tokenStr)
	if err != nil {
		return errors.New("invalid or expired reset token")
	}

	uid, err := uuid.Parse(userID)
	if err != nil {
		return errors.New("invalid user ID in token")
	}
	
	user, err := a.userRepo.GetByID(ctx, uid)
	if err != nil || user == nil {
		return errors.New("user not found")
	}

	currentPrefix := user.PasswordHash
	if len(currentPrefix) > 10 {
		currentPrefix = currentPrefix[:10]
	}
	if currentPrefix != hashPrefix {
		return errors.New("this password reset link has already been used")
	}

	if err := hasher.ValidatePasswordComplexity(newPassword); err != nil {
		return err
	}

	hashedPassword, err := hasher.HashPassword(newPassword)
	if err != nil {
		return err
	}

	user.PasswordHash = hashedPassword
	return a.userRepo.Update(ctx, user)
}
