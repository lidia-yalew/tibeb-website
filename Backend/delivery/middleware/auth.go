package middleware

import (
	"net/http"
	"strings"

	"tamcon-backend/internal/token"
	"tamcon-backend/internal/userutil"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(tokenService *token.TokenService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var tokenStr string

		// try to extract token from Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader != "" {
			parts := strings.Split(authHeader, " ")
			if len(parts) == 2 && strings.ToLower(parts[0]) == "bearer" {
				tokenStr = parts[1]
			}
		}

		// fallback: Try to extract token from cookie if header was missing or invalid
		if tokenStr == "" {
			if cookie, err := c.Cookie("access_token"); err == nil {
				tokenStr = cookie
			}
		}

		// Return 401 if token is not found in either source
		if tokenStr == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "UNAUTHORIZED",
					"message": "Authentication token is required via Bearer header or access_token cookie",
				},
			})
			return
		}

		// Validate the extracted token
		claims, err := tokenService.ValidateToken(tokenStr)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "UNAUTHORIZED",
					"message": "Invalid or expired token",
				},
			})
			return
		}

		// Set user details in context
		c.Set(string(userutil.UserIDKey), claims.UserID)
		c.Set(string(userutil.EmailKey), claims.Email)
		c.Set("role", claims.Role)

		c.Next()
	}
}
