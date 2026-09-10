package route

import (
	"log"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"tamcon-backend/config"
	"tamcon-backend/delivery/controller"
	"tamcon-backend/delivery/middleware"
	"tamcon-backend/delivery/route/auth"
	"tamcon-backend/delivery/route/blognews"
	"tamcon-backend/delivery/route/chatbot"
	"tamcon-backend/delivery/route/contact"
	"tamcon-backend/delivery/route/image"
	staff "tamcon-backend/delivery/route/user"
	"tamcon-backend/domain"
	"tamcon-backend/internal/token"
	"tamcon-backend/repository"
	"tamcon-backend/usecase"
)

func Setup(cfg *config.Config, timeout time.Duration, db *gorm.DB, router *gin.Engine) {
	// AutoMigrate Tibeb GORM Models individually to prevent one failure from blocking others
	models := []interface{}{
		&domain.StaffUser{},
		&domain.RefreshToken{},
		&domain.TeamMember{},
		&domain.PortfolioProject{},
		&domain.FAQ{},
		&domain.Testimonial{},
		&domain.BlogNews{},
		&domain.ContactMessage{},
		&domain.Image{},
		&domain.AIKnowledge{},
	}

	for _, model := range models {
		if err := db.AutoMigrate(model); err != nil {
			log.Printf("Warning: GORM AutoMigrate encountered error for model %T: %v", model, err)
		}
	}

	tokenService := token.NewTokenService(cfg.JWTSecret, cfg.JWTAccess, cfg.JWTRefreshTTL)
	
	// Initialize Cloudinary if URL is provided
	var uploadUsecase domain.UploadUsecase
	if cfg.CloudinaryURL != "" {
		cld, err := cloudinary.NewFromURL(cfg.CloudinaryURL)
		if err != nil {
			log.Printf("Warning: Failed to initialize Cloudinary: %v", err)
		} else {
			storage := usecase.NewCloudinaryStorage(cld)
			uploadUsecase = usecase.NewUploadUsecase(storage, config.DefaultUploadConfig)
		}
	}

	userRepo := repository.NewStaffUserRepo(db)
	refreshTokenRepo := repository.NewRefreshTokenRepository(db)
	contactRepo := repository.NewContactMessageRepository(db)
	imageRepo := repository.NewImageRepository(db)
	blogNewsRepo := repository.NewBlogNewsRepository(db)

	authUsecase := usecase.NewAuthUsecase(userRepo, refreshTokenRepo, tokenService, timeout)
	profileUsecase := usecase.NewStaffUserUsecase(userRepo, timeout)
	contactUsecase := usecase.NewContactMessageUsecase(contactRepo, timeout)

	var chatbotUsecase domain.ChatbotUsecase
	aiKnowledgeRepo := repository.NewAIKnowledgeRepository(db)
	if cfg.GeminiAPIKey != "" {
		cbUc, err := usecase.NewChatbotUsecase(cfg.GeminiAPIKey, aiKnowledgeRepo)
		if err == nil {
			chatbotUsecase = cbUc
		}
	}
	imageUsecase := usecase.NewImageUsecase(imageRepo, timeout)
	blogNewsUsecase := usecase.NewBlogNewsUsecase(blogNewsRepo, timeout)

	authController := controller.NewAuthController(authUsecase)
	profileController := controller.NewProfileController(profileUsecase)
	contactController := controller.NewContactMessageController(contactUsecase)
	blogNewsController := controller.NewBlogNewsController(blogNewsUsecase, uploadUsecase, imageUsecase)
	imageControllerController := controller.NewImageController(uploadUsecase, imageUsecase)

	publicGroup := router.Group("/api/v1")
	protectedGroup := router.Group("/api/v1/admin")
	protectedGroup.Use(middleware.AuthMiddleware(tokenService))
	protectedGroup.Use(middleware.AdminDeleteProtection())

	// Register Auth Routes
	auth.NewLoginRouter(cfg, timeout, db, publicGroup, protectedGroup, authController)
	auth.NewRefreshRouter(cfg, timeout, db, publicGroup, protectedGroup, authController)
	auth.NewLogoutRouter(cfg, timeout, db, publicGroup, protectedGroup, authController)
	auth.NewForgotPasswordRouter(publicGroup, authController)
	staff.NewProfileRouter(cfg, timeout, db, publicGroup, protectedGroup, profileController)

	// Register Tibeb Specific Routes
	RegisterTeamRoutes(publicGroup, protectedGroup, db)
	RegisterPortfolioRoutes(publicGroup, protectedGroup, db)
	RegisterFAQRoutes(publicGroup, protectedGroup, db)
	RegisterTestimonialRoutes(publicGroup, protectedGroup, db)

	// Register Contact, Blog, AI Chatbot, and Cloudinary Image Routes
	contact.NewContactRouter(cfg, timeout, db, publicGroup, protectedGroup, contactController)
	blognews.NewBlogNewsRouter(cfg, timeout, db, publicGroup, protectedGroup, blogNewsController)
	image.NewImageRouter(cfg, timeout, db, publicGroup, protectedGroup, imageControllerController)
	NewAIKnowledgeRouter(cfg, timeout, db, publicGroup, protectedGroup)

	if chatbotUsecase != nil {
		chatbotController := controller.NewChatbotController(chatbotUsecase)
		chatbot.NewChatbotRouter(cfg, timeout, db, publicGroup, protectedGroup, chatbotController)
	}
}
