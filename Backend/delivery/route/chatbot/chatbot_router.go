package chatbot
import (
	"time"
	"tamcon-backend/config"
	"tamcon-backend/delivery/controller"
	"tamcon-backend/delivery/middleware"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)
func NewChatbotRouter(
	cfg *config.Config,
	timeout time.Duration,
	db *gorm.DB,
	publicGroup *gin.RouterGroup,
	protectedGroup *gin.RouterGroup,
	chatbotController *controller.ChatbotController,
) {

	chatbotGroup := publicGroup.Group("/chat")
	chatbotGroup.Use(middleware.RateLimitMiddleware(10))
	{
		chatbotGroup.POST("", chatbotController.Chat)
	}
}