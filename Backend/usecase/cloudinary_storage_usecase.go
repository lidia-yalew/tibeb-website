package usecase

import (
	"context"
	"errors"
	"mime/multipart"
	"sync"
	"tamcon-backend/domain"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/admin"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

type CloudinaryStorage struct {
	client *cloudinary.Cloudinary
}

func NewCloudinaryStorage(
	client *cloudinary.Cloudinary,
) domain.Storage {
	return &CloudinaryStorage{
		client: client,
	}
}

func (c *CloudinaryStorage) Upload(
	file *multipart.FileHeader,
	imageId string,
) (string, string, error) {

	src, err := file.Open()
	if err != nil {
		return "", "", err
	}

	defer src.Close()

	result, err := c.client.Upload.Upload(
		context.Background(),
		src,
		uploader.UploadParams{
			PublicID: imageId,
		},
	)

	if err != nil {
		return "", "", err
	}

	if result.Error.Message != "" {
		println("Cloudinary upload error:", result.Error.Message)

		return "", "", errors.New("upload failed")
	}

	return result.PublicID, result.SecureURL, nil
}

func (c *CloudinaryStorage) BulkUpload(
	inputs []domain.StorageInput,
) ([]domain.BulkUploadResult, []domain.BulkUploadError) {
	var wg sync.WaitGroup

	successChan := make(chan domain.BulkUploadResult, len(inputs))
	failedChan := make(chan domain.BulkUploadError, len(inputs))

	for _, input := range inputs {
		wg.Add(1)

		go func(in domain.StorageInput) {
			defer wg.Done()

			// Use the existing single Upload method logic internally
			publicID, url, err := c.Upload(in.File, in.ImageID)
			if err != nil {
				failedChan <- domain.BulkUploadError{
					Filename: in.File.Filename,
					Error:    err.Error(),
				}
				return
			}

			successChan <- domain.BulkUploadResult{
				Filename: in.File.Filename,
				PublicID: publicID,
				URL:      url,
			}
		}(input)
	}

	wg.Wait()
	close(successChan)
	close(failedChan)

	var successResults []domain.BulkUploadResult
	for res := range successChan {
		successResults = append(successResults, res)
	}

	var failedResults []domain.BulkUploadError
	for res := range failedChan {
		failedResults = append(failedResults, res)
	}

	return successResults, failedResults
}

func (c *CloudinaryStorage) Delete(imageIds []string) ([]string, []string) {
	// Call the Admin API instead of the Upload API
	result, err := c.client.Admin.DeleteAssets(
		context.Background(),
		admin.DeleteAssetsParams{
			PublicIDs: imageIds,
		},
	)

	// Complete API/Network failure means all requested IDs failed
	if err != nil {
		println("Cloudinary delete error:", err.Error())

		return nil, imageIds // all failed
	}

	var deletedIds []string
	var failedIds []string

	// Cloudinary returns a map: result.Deleted[public_id] = status string ("deleted", "not_found", etc.)
	for _, id := range imageIds {
		status, exists := result.Deleted[id]

		if !exists || (status != "deleted" && status != "not_found") {
			failedIds = append(failedIds, id)
		} else {
			deletedIds = append(deletedIds, id)
		}
	}

	if len(deletedIds) == 0 {
		deletedIds = nil
	}

	if len(failedIds) == 0 {
		failedIds = nil
	}

	return deletedIds, failedIds
}
