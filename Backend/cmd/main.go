package main

import (
	"context"
	"log/slog"
	"os"
	"tamcon-backend/config"
	"tamcon-backend/db"
	"tamcon-backend/delivery/route"
	"tamcon-backend/docs"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Enter your JWT token as: Bearer <token>
func main() {
	_ = context.Background()

	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	slog.SetDefault(logger)

	cfg := config.Get()

	// Using GORM for all database interactions

	dbGorm := config.ConnectGORM(cfg)

	config.RunMigrations(cfg.DBURL, db.MigrationsFS)

	timeout := 10 * time.Second

	r := gin.Default()

	_ = r.SetTrustedProxies(cfg.TrustedProxies)

	r.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.CorsURL,
		AllowMethods:     []string{"GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	docs.SwaggerInfo.Title = "Tamcon Official Website API"
	docs.SwaggerInfo.Description = "API for the Tamcon Official Website"
	docs.SwaggerInfo.Version = "1.0"
	docs.SwaggerInfo.Schemes = []string{"http", "https"}

	// only enable swagger in development mode
	if cfg.IsDev() {
		r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	}

	route.Setup(cfg, timeout, dbGorm, r)

	slog.Info("Starting server", "port", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		slog.Error("Failed to start the server", "error", err)
		os.Exit(1)
	}
}
