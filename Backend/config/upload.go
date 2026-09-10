package config

type UploadConfig struct {
	MaxFileSize       int64
	MaxFiles          int
	AllowedMimeTypes  []string
	AllowedExtensions []string
}

var DefaultUploadConfig = UploadConfig{
	MaxFileSize: 8 << 20, // 8 MB
	MaxFiles:    5,
	AllowedMimeTypes: []string{
		"image/jpeg",
		"image/png",
		"image/gif",
	},
	AllowedExtensions: []string{
		".jpg",
		".jpeg",
		".png",
		".gif",
	},
}
