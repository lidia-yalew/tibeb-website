package slugutil

import (
	"regexp"
	"strings"
)

func Generate(title string) string {
	slug := strings.ToLower(title)
	re := regexp.MustCompile(`[^a-z0-9]+`)
	slug = re.ReplaceAllString(slug, "-")
	return strings.Trim(slug, "-")
}
