package config

import (
	"errors"
	"log"
	"reflect"
	"sync"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/go-viper/mapstructure/v2"
	"github.com/spf13/viper"
)

type Config struct {
	DBURL          string        `mapstructure:"DB_URL" validate:"required"`
	Port           string        `mapstructure:"PORT" default:"8080"`
	JWTSecret      string        `mapstructure:"JWT_SECRET" validate:"required"`
	JWTAccess      time.Duration `mapstructure:"JWT_ACCESS_TTL" default:"24h"`
	JWTRefreshTTL  time.Duration `mapstructure:"JWT_REFRESH_TTL" default:"168h"`
	GeminiAPIKey   string        `mapstructure:"GEMINI_API_KEY"`
	CloudinaryURL  string        `mapstructure:"CLOUDINARY_URL"`
	CorsURL        []string      `mapstructure:"CLIENT_URL" default:"http://localhost:3000"` // comma separated list of allowed origins
	AppEnv         string        `mapstructure:"APP_ENV" validate:"oneof=development production"`
	TrustedProxies []string      `mapstructure:"TRUSTED_PROXIES" default:"*"` // comma separated list of trusted proxies, default to all
	EmailUser      string        `mapstructure:"EMAIL_USER"`
	EmailPass      string        `mapstructure:"EMAIL_PASS"`
}

func (c *Config) IsDev() bool {
	return c.AppEnv == "development"
}

var (
	cfg  *Config
	once sync.Once
)

// Get returns the globally shared, initialized configuration.
// It safely initializes the configuration on the first call.
func Get() *Config {
	once.Do(func() {
		cfg = loadConfig()
	})
	return cfg
}

func loadConfig() *Config {
	viper.AddConfigPath(".")
	viper.SetConfigName(".env")
	viper.SetConfigType("env")

	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		var configFileNotFoundError viper.ConfigFileNotFoundError

		if !errors.As(err, &configFileNotFoundError) {
			log.Printf("Warning: error reading config file: %v", err)
		}
	}

	var cfg Config
	t := reflect.TypeOf(cfg)

	// dynamic defaults & env binding via reflection
	for i := 0; i < t.NumField(); i++ {
		field := t.Field(i)
		envKey := field.Tag.Get("mapstructure")
		if envKey == "" {
			continue
		}

		// apply fallback value if a "default" tag is declared on the struct
		if defaultVal := field.Tag.Get("default"); defaultVal != "" {
			viper.SetDefault(envKey, defaultVal)
		}

		// bind explicitly to catch variables originating directly from Render
		_ = viper.BindEnv(envKey)
	}

	// unmarshal everything globally
	decoderConfig := &mapstructure.DecoderConfig{
		Metadata:         nil,
		Result:           &cfg,
		WeaklyTypedInput: true,
		TagName:          "mapstructure",
		DecodeHook: mapstructure.ComposeDecodeHookFunc(
			mapstructure.StringToTimeDurationHookFunc(),
			mapstructure.StringToSliceHookFunc(","),
		),
	}

	decoder, err := mapstructure.NewDecoder(decoderConfig)
	if err != nil {
		log.Fatalf("Failed to create mapstructure decoder: %v", err)
	}

	if err := decoder.Decode(viper.AllSettings()); err != nil {
		log.Fatalf("Unable to decode configuration: %v", err)
	}

	// validation with clean error messages
	validate := validator.New()
	if err := validate.Struct(cfg); err != nil {
		if cfg.AppEnv != "development" && cfg.AppEnv != "production" {
			log.Fatalf("Configuration Error: APP_ENV must be 'development' or 'production' (Current value: %q)", cfg.AppEnv)
		}
		log.Fatalf("Environment configuration validation failed:\n%v", err)
	}

	return &cfg

}
