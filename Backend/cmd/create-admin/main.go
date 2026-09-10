package main

import (
	"bufio"
	"context"
	"fmt"
	"log"
	"os"
	"strings"
	"syscall"

	"tamcon-backend/config"
	"tamcon-backend/db"
	"tamcon-backend/domain"
	"tamcon-backend/internal/hasher"
	"tamcon-backend/repository"

	"golang.org/x/term"
)

func main() {
	cfg := config.Get()

	config.RunMigrations(cfg.DBURL, db.MigrationsFS)

	dbGorm := config.ConnectGORM(cfg)

	repo := repository.NewStaffUserRepo(dbGorm)
	ctx := context.Background()

	reader := bufio.NewReader(os.Stdin)

	fmt.Println("=====================================")
	fmt.Println("    TAMCON - Create Staff User       ")
	fmt.Println("=====================================")

	fmt.Print("First Name: ")
	firstName, err := reader.ReadString('\n')
	if err != nil {
		log.Fatalf("Error reading first name: %v", err)
	}
	firstName = strings.TrimSpace(firstName)

	fmt.Print("Last Name: ")
	lastName, err := reader.ReadString('\n')
	if err != nil {
		log.Fatalf("Error reading last name: %v", err)
	}
	lastName = strings.TrimSpace(lastName)

	fmt.Print("Email: ")
	email, err := reader.ReadString('\n')
	if err != nil {
		log.Fatalf("Error reading email: %v", err)
	}
	email = strings.TrimSpace(email)

	fmt.Print("Password: ")
	bytePassword, err := term.ReadPassword(int(syscall.Stdin))
	if err != nil {
		log.Fatalf("Error reading password: %v", err)
	}
	fmt.Println()
	password := strings.TrimSpace(string(bytePassword))

	if firstName == "" || lastName == "" || email == "" || password == "" {
		log.Fatal("Error: All fields are required!")
	}

	hashedPassword, err := hasher.HashPassword(password)
	if err != nil {
		log.Fatalf("Failed to hash password: %v", err)
	}

	user := &domain.StaffUser{
		FirstName:    firstName,
		LastName:     lastName,
		Email:        email,
		PasswordHash: hashedPassword,
		Role:         "Editor",
		Status:       "ACTIVE",
	}

	err = repo.Create(ctx, user)
	if err != nil {
		log.Fatalf("Failed to create staff user: %v", err)
	}

	fmt.Println("-------------------------------------")
	fmt.Printf("Staff user created successfully! 🎉\nID: %s\nRole: %s\nStatus: %s\n", user.ID, user.Role, user.Status)
	fmt.Println("=====================================")
}
