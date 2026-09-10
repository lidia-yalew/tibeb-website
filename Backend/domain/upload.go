package domain

import "mime/multipart"

type BulkUploadResult struct {
	Filename string
	PublicID string
	URL      string
}

type BulkUploadError struct {
	Filename string
	Error    string
}

type StorageInput struct {
	File    *multipart.FileHeader
	ImageID string
}

type Storage interface {
	Upload(
		file *multipart.FileHeader,
		imageID string,
	) (url string, publicID string, err error)
	BulkUpload(
		inputs []StorageInput,
	) (success []BulkUploadResult, failed []BulkUploadError)
	Delete(
		imageIDs []string,
	) (deletedIDs []string, failedIDs []string)
}

type UploadUsecase interface {
	Validate(file *multipart.FileHeader) error
	Upload(file *multipart.FileHeader) (publicID, url string, err error)
	BulkUpload(
		files []*multipart.FileHeader,
	) (success []BulkUploadResult, failed []BulkUploadError)
	Delete(imageIDs []string) (deletedIDs, failedIDs []string)
}
