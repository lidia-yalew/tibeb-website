package userutil

import "context"

type contextKey string

const (
	UserIDKey contextKey = "userId"
	EmailKey  contextKey = "email"
)

func GetUserIDFromContext(ctx context.Context) (string, bool) {
	userID, ok := ctx.Value(UserIDKey).(string)
	return userID, ok
}

func GetEmailFromContext(ctx context.Context) (string, bool) {
	email, ok := ctx.Value(EmailKey).(string)
	return email, ok
}