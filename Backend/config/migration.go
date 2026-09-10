package config

import (
	"embed"
	"log"
	"log/slog"
	"strings"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/golang-migrate/migrate/v4/source/iofs"
)

func RunMigrations(databaseURL string, MigrationsFS embed.FS) {
	databaseURL = strings.Replace(databaseURL, "postgresql://", "postgres://", 1)

	slog.Info("Running database migrations via golang-migrate...")
	d, err := iofs.New(MigrationsFS, "migration")
	if err != nil {
		log.Fatalf("Failed to create migration source driver: %v", err)
	}
	m, err := migrate.NewWithSourceInstance("iofs", d, databaseURL)
	if err != nil {
		log.Fatalf("Failed to create migrate instance: %v", err)
	}
	err = m.Up()
	if err != nil {
		if err == migrate.ErrNoChange {
			slog.Info("No new migrations to apply.")
		} else {
			slog.Error("Migration failed", "error", err)
			log.Println("----------------------------------------------------------------")
			log.Println("CRITICAL: If database has dirty or non-tracked schema, run manually:")
			log.Printf("migrate -path db/migration -database \"%s\" force <VERSION>", databaseURL)
			log.Println("----------------------------------------------------------------")
			log.Fatalf("Fatal: Migration failed: %v", err)
		}
	} else {
		slog.Info("Migrations applied successfully! ✅")
	}
}
