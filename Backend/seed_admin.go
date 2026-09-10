package main

import (
	"fmt"
	"log"

	"tamcon-backend/config"
	"tamcon-backend/domain"

	"golang.org/x/crypto/bcrypt"
)

func main() {
	// Load config and connect to DB exactly like main.go
	cfg := config.Get()
	dbGorm := config.ConnectGORM(cfg)

	email := "admin@tibeb.com"
	password := "admin123"

	// Check if the admin already exists
	var count int64
	dbGorm.Model(&domain.StaffUser{}).Where("email = ?", email).Count(&count)
	if count > 0 {
		fmt.Println("An admin with this email already exists.")
		return
	}

	// Hash the password securely
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("Failed to hash password: %v", err)
	}

	// Create the StaffUser object
	user := domain.StaffUser{
		FirstName:    "Super",
		LastName:     "Admin",
		Email:        email,
		PasswordHash: string(hash),
		Role:         "Super Admin",
		Status:       "ACTIVE",
	}

	// Save to database
	if err := dbGorm.Create(&user).Error; err != nil {
		log.Fatalf("Failed to create admin: %v", err)
	}

	fmt.Println("✅ Successfully created Super Admin!")
	fmt.Printf("Email: %s\n", email)
	fmt.Printf("Password: %s\n", password)
}
