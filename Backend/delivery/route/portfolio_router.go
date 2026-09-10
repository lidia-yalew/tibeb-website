package route

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"tamcon-backend/delivery/controller"
	"tamcon-backend/repository"
	"tamcon-backend/usecase"
)

func RegisterPortfolioRoutes(publicGroup, protectedGroup *gin.RouterGroup, db *gorm.DB) {
	repo := repository.NewPortfolioRepository(db)
	uc := usecase.NewPortfolioUsecase(repo)
	ctrl := controller.NewPortfolioController(uc)

	publicGroup.GET("/portfolio", ctrl.GetAll)
	publicGroup.GET("/portfolio/:id", ctrl.GetByID)

	protectedGroup.POST("/portfolio", ctrl.Create)
	protectedGroup.PUT("/portfolio/:id", ctrl.Update)
	protectedGroup.DELETE("/portfolio/:id", ctrl.Delete)
}
