package usecase

import (
	"fmt"
	"mime/multipart"
	"path/filepath"
	"strings"
	"sync"
	"tamcon-backend/config"
	"tamcon-backend/domain"

	"github.com/google/uuid"
)

type uploadUsecase struct {
	storage domain.Storage
	config  config.UploadConfig
}

func NewUploadUsecase(
	storage domain.Storage,
	config config.UploadConfig,
) domain.UploadUsecase {
	return &uploadUsecase{
		storage: storage,
		config:  config,
	}
}

func (s *uploadUsecase) Validate(
	file *multipart.FileHeader,
) error {
	if file.Size > s.config.MaxFileSize {
		return fmt.Errorf("file size exceeds limit")
	}

	ext := strings.ToLower(filepath.Ext(file.Filename))

	if !contains(
		s.config.AllowedExtensions,
		ext,
	) {
		return fmt.Errorf("file extension not allowed")
	}

	mime := file.Header.Get("Content-Type")

	if !contains(
		s.config.AllowedMimeTypes,
		mime,
	) {
		return fmt.Errorf("file type not allowed")
	}

	return nil
}

func (s *uploadUsecase) Upload(
	file *multipart.FileHeader,
) (string, string, error) {
	publicId := uuid.NewString()

	_, url, err := s.storage.Upload(
		file,
		publicId,
	)

	return publicId, url, err
}

func (s *uploadUsecase) Delete(imageIds []string) ([]string, []string) {
	return s.storage.Delete(imageIds)
}

func contains(
	list []string,
	value string,
) bool {
	for _, item := range list {
		if item == value {
			return true
		}
	}

	return false
}

func (s *uploadUsecase) BulkUpload(
	files []*multipart.FileHeader,
) ([]domain.BulkUploadResult, []domain.BulkUploadError) {
	var wg sync.WaitGroup

	// Channels to safely collect valid inputs and validation failures concurrently
	validInputsChan := make(chan domain.StorageInput, len(files))
	failedResultsChan := make(chan domain.BulkUploadError, len(files))

	for _, file := range files {
		wg.Add(1)

		go func(f *multipart.FileHeader) {
			defer wg.Done()

			// 1. Run local validation rules
			if err := s.Validate(f); err != nil {
				failedResultsChan <- domain.BulkUploadError{
					Filename: f.Filename,
					Error:    err.Error(),
				}
				return
			}

			// 2. Prepare structural input for storage layer
			validInputsChan <- domain.StorageInput{
				File:    f,
				ImageID: uuid.NewString(),
			}
		}(file)
	}

	wg.Wait()
	close(validInputsChan)
	close(failedResultsChan)

	// Drain validation failures into our final slice
	var finalFailed []domain.BulkUploadError
	for fail := range failedResultsChan {
		finalFailed = append(finalFailed, fail)
	}

	// Gather valid items for the storage adapter
	var storageInputs []domain.StorageInput
	for input := range validInputsChan {
		storageInputs = append(storageInputs, input)
	}

	// 3. Dispatch remaining valid files to storage bulk processing
	if len(storageInputs) > 0 {
		successResults, storageErrors := s.storage.BulkUpload(storageInputs)

		finalFailed = append(finalFailed, storageErrors...)
		return successResults, finalFailed
	}

	return nil, finalFailed
}
