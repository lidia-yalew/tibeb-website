package route

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"tamcon-backend/delivery/controller"
	"tamcon-backend/repository"
	"tamcon-backend/usecase"
)

func RegisterFAQRoutes(publicGroup, protectedGroup *gin.RouterGroup, db *gorm.DB) {
	repo := repository.NewFAQRepository(db)
	uc := usecase.NewFAQUsecase(repo)
	ctrl := controller.NewFAQController(uc)

	publicGroup.GET("/faqs", ctrl.GetAll)

	protectedGroup.POST("/faqs", ctrl.Create)
	protectedGroup.PUT("/faqs/:id", ctrl.Update)
	protectedGroup.DELETE("/faqs/:id", ctrl.Delete)
}
