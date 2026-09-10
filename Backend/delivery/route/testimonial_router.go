package route

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"tamcon-backend/delivery/controller"
	"tamcon-backend/repository"
	"tamcon-backend/usecase"
)

func RegisterTestimonialRoutes(publicGroup, protectedGroup *gin.RouterGroup, db *gorm.DB) {
	repo := repository.NewTestimonialRepository(db)
	uc := usecase.NewTestimonialUsecase(repo)
	ctrl := controller.NewTestimonialController(uc)

	// Public routes
	publicGroup.GET("/testimonials", ctrl.GetPublished)
	publicGroup.POST("/testimonials/submit", ctrl.PublicSubmit)

	// Admin protected routes
	protectedGroup.GET("/testimonials/admin", ctrl.GetAllAdmin)
	protectedGroup.POST("/testimonials", ctrl.AdminCreate)
	protectedGroup.PATCH("/testimonials/:id/publish", ctrl.PublishToggle)
	protectedGroup.DELETE("/testimonials/:id", ctrl.Delete)
}
