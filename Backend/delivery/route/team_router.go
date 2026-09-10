package route

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"tamcon-backend/delivery/controller"
	"tamcon-backend/repository"
	"tamcon-backend/usecase"
)

func RegisterTeamRoutes(publicGroup, protectedGroup *gin.RouterGroup, db *gorm.DB) {
	repo := repository.NewTeamRepository(db)
	uc := usecase.NewTeamUsecase(repo)
	ctrl := controller.NewTeamController(uc)

	publicGroup.GET("/team", ctrl.GetAll)
	publicGroup.GET("/team/:id", ctrl.GetByID)

	protectedGroup.POST("/team", ctrl.Create)
	protectedGroup.PUT("/team/:id", ctrl.Update)
	protectedGroup.DELETE("/team/:id", ctrl.Delete)
}
