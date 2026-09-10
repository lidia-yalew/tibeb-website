package db

import "embed"

//go:embed migration/*.sql
var MigrationsFS embed.FS
