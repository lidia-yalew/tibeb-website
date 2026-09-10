package main

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"tamcon-backend/domain"
)

func main() {
	dbURL := "postgresql://postgres:lidiadatabase@localhost:5432/tibeb_db?sslmode=disable"
	db, err := gorm.Open(postgres.Open(dbURL), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	t := domain.Testimonial{
		ClientName:   "test",
		ClientRole:   "tester",
		Organization: "test org",
		Quote:        "for testing",
		Status:       "pending",
		IsPublished:  false,
	}

	if err := db.Create(&t).Error; err != nil {
		log.Fatalf("Insert failed: %v", err)
	}
	log.Println("Insert success")
}
