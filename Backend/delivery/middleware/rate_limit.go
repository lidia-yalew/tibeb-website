
package middleware
import (
	"net/http"
	"sync"
	"time"
	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
	"tamcon-backend/domain"

)
type ipLimiter struct {
	limiter  *rate.Limiter
	lastSeen time.Time
}
var (
	limiters = make(map[string]*ipLimiter)
	mu       sync.Mutex
)

func init() {
	go func() {
		for {
			time.Sleep(1 * time.Minute)
			mu.Lock()
			for ip, lim := range limiters {
				if time.Since(lim.lastSeen) > 5*time.Minute {
					delete(limiters, ip)
				}
			}
			mu.Unlock()
		}
	}()
}

func RateLimitMiddleware(requestsPerMin int) gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()
		mu.Lock()
		lim, exists := limiters[ip]
		if !exists {
			limit := rate.Limit(float64(requestsPerMin) / 60.0)
			lim = &ipLimiter{
				limiter:  rate.NewLimiter(limit, 3),
				lastSeen: time.Now(),
			}
			limiters[ip] = lim
		}
		lim.lastSeen = time.Now()
		mu.Unlock()

				if !lim.limiter.Allow() {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, domain.ErrorResponse{
				Success: false,
				Message: "Too many requests",
				Error: &domain.ErrorDetails{
					Code:    "TOO_MANY_REQUESTS",
					Details: "Too many requests. Please wait a moment before trying again.",
				},
			})
			return
		}

		c.Next()
	}
}

func ClearLimiters() {
	mu.Lock()
	defer mu.Unlock()
	limiters = make(map[string]*ipLimiter)
}
