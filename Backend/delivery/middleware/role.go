package middleware

import (
	"net/http"
	"tamcon-backend/domain"

	"github.com/gin-gonic/gin"
)

// AdminDeleteProtection restricts DELETE operations to Super Admins only
func AdminDeleteProtection() gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Method == "DELETE" {
			roleVal, exists := c.Get("role")
			if !exists || roleVal.(string) != "Super Admin" {
				c.AbortWithStatusJSON(http.StatusForbidden, domain.ErrorResponse{
					Success: false,
					Message: "Access denied",
					Error: &domain.ErrorDetails{
						Code:    "FORBIDDEN",
						Details: "Only Super Admins can delete resources.",
					},
				})
				return
			}
		}
		c.Next()
	}
}
