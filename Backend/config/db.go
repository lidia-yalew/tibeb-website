package config

import (
	"context"
	"log/slog"
	"os"
	"time"
	"github.com/jackc/pgx/v5/pgxpool"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectPostgres(cfg *Config) *pgxpool.Pool {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	config, err := pgxpool.ParseConfig(cfg.DBURL)
	if err != nil {
		slog.Error("Unable to parse database URL", "error", err)
		os.Exit(1)
	}

	config.MaxConns = 25
	config.MinConns = 5
	config.MaxConnIdleTime = 30 * time.Minute
	config.MaxConnLifetime = 1 * time.Hour

	dbpool, err := pgxpool.NewWithConfig(ctx, config)

	slog.Info("Attempting to connect to database", "url_length", len(cfg.DBURL))
	if err != nil {
		slog.Error("Unable to create connection pool", "error", err)
		os.Exit(1)
	}
	if err := dbpool.Ping(ctx); err != nil {
		slog.Error("Unable to ping database", "error", err)
		os.Exit(1)
	}
	slog.Info("Connected to Postgres successfully!")
	return dbpool
}


func ConnectGORM(cfg *Config) *gorm.DB{
	db, err := gorm.Open(postgres.Open(cfg.DBURL), &gorm.Config{})
	if err != nil {
		slog.Error("Failed to connect to database via GORM", "error", err)
		os.Exit(1)
	}

	slog.Info("GORM connected to database successfully 🚀")
	return db

}