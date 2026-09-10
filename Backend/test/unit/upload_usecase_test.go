package unit

import (
	"mime/multipart"
	"net/textproto"

	"tamcon-backend/config"
	"tamcon-backend/domain"
	"tamcon-backend/usecase"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

type mockStorage struct {
	UploadFunc     func(file *multipart.FileHeader, imageID string) (string, string, error)
	DeleteFunc     func(imageIDs []string) ([]string, []string)
	BulkUploadFunc func(inputs []domain.StorageInput) ([]domain.BulkUploadResult, []domain.BulkUploadError)
}

func (m *mockStorage) Upload(file *multipart.FileHeader, imageID string) (string, string, error) {
	return m.UploadFunc(file, imageID)
}

func (m *mockStorage) Delete(imageIDs []string) ([]string, []string) {
	return m.DeleteFunc(imageIDs)
}

func (m *mockStorage) BulkUpload(inputs []domain.StorageInput) ([]domain.BulkUploadResult, []domain.BulkUploadError) {
	return m.BulkUploadFunc(inputs)
}

func newFileHeader(filename, contentType string, size int64) *multipart.FileHeader {
	return &multipart.FileHeader{
		Filename: filename,
		Size:     size,
		Header: textproto.MIMEHeader{
			"Content-Type": []string{contentType},
		},
	}
}

var _ = Describe("Upload Usecase", func() {
	var (
		storage *mockStorage
		uc      domain.UploadUsecase
	)

	BeforeEach(func() {
		storage = &mockStorage{}
		uc = usecase.NewUploadUsecase(storage, config.UploadConfig{
			MaxFileSize:       1024,
			AllowedExtensions: []string{".jpg", ".png"},
			AllowedMimeTypes:  []string{"image/jpeg", "image/png"},
		})
	})

	Describe("Validate", func() {
		It("accepts allowed files", func() {
			err := uc.Validate(newFileHeader("cover.jpg", "image/jpeg", 512))
			Expect(err).NotTo(HaveOccurred())
		})

		It("rejects files over the size limit", func() {
			err := uc.Validate(newFileHeader("cover.jpg", "image/jpeg", 2048))
			Expect(err).To(HaveOccurred())
			Expect(err.Error()).To(Equal("file size exceeds limit"))
		})

		It("rejects files with unsupported extensions", func() {
			err := uc.Validate(newFileHeader("cover.gif", "image/gif", 512))
			Expect(err).To(HaveOccurred())
			Expect(err.Error()).To(Equal("file extension not allowed"))
		})

		It("rejects files with unsupported mime types", func() {
			err := uc.Validate(newFileHeader("cover.jpg", "application/octet-stream", 512))
			Expect(err).To(HaveOccurred())
			Expect(err.Error()).To(Equal("file type not allowed"))
		})
	})

	Describe("Upload", func() {
		It("returns the generated public id and storage url", func() {
			storage.UploadFunc = func(file *multipart.FileHeader, imageID string) (string, string, error) {
				return "storage-public-id", "https://cdn.example.com/cover.jpg", nil
			}

			publicID, url, err := uc.Upload(newFileHeader("cover.jpg", "image/jpeg", 512))

			Expect(err).NotTo(HaveOccurred())
			Expect(publicID).NotTo(BeEmpty())
			Expect(publicID).NotTo(Equal("storage-public-id"))
			Expect(url).To(Equal("https://cdn.example.com/cover.jpg"))
		})
	})

	Describe("Delete", func() {
		It("delegates to storage delete", func() {
			called := false

			storage.DeleteFunc = func(imageIDs []string) ([]string, []string) {
				called = true
				Expect(imageIDs).To(Equal([]string{"img-1", "img-2"}))
				return []string{"img-1"}, []string{"img-2"}
			}

			deleted, failed := uc.Delete([]string{"img-1", "img-2"})

			Expect(called).To(BeTrue())
			Expect(deleted).To(Equal([]string{"img-1"}))
			Expect(failed).To(Equal([]string{"img-2"}))
		})
	})
})
