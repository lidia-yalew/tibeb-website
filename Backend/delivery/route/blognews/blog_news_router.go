package blognews

import (
	"time"

	"tamcon-backend/config"
	"tamcon-backend/delivery/controller"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NewBlogNewsRouter(
	cfg *config.Config,
	timeout time.Duration,
	db *gorm.DB,
	publicGroup *gin.RouterGroup,
	protectedGroup *gin.RouterGroup,
	ctrl *controller.BlogNewsController,
) {

	protectedGroup.POST("/blog-news", ctrl.Create)
	protectedGroup.GET("/blog-news", ctrl.List)
	protectedGroup.GET("/blog-news/:id", ctrl.GetByID)
	protectedGroup.PUT("/blog-news/:id", ctrl.Update)
	protectedGroup.DELETE("/blog-news/:id", ctrl.Delete)
	protectedGroup.PATCH("/blog-news/:id/publish", ctrl.TogglePublish)


	publicGroup.GET("/blog-news", ctrl.GetPublished)
	publicGroup.GET("/blog-news/:slug", ctrl.GetBySlug)
}
