package route

import (
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"tamcon-backend/config"
	"tamcon-backend/delivery/controller"
	"tamcon-backend/repository"
	"tamcon-backend/usecase"
)

func NewAIKnowledgeRouter(cfg *config.Config, timeout time.Duration, db *gorm.DB, publicGroup *gin.RouterGroup, protectedGroup *gin.RouterGroup) {
	repo := repository.NewAIKnowledgeRepository(db)
	uc := usecase.NewAIKnowledgeUsecase(repo, timeout)
	ctrl := controller.NewAIKnowledgeController(uc)

	protectedGroup.GET("/ai-knowledge", ctrl.Get)
	protectedGroup.PUT("/ai-knowledge", ctrl.Update)
}
