package image_utils

import (
	"context"
	"log"
	"tamcon-backend/domain"
	"time"
)

func HandleImageCleanup(images []*domain.Image, uploadUsecase domain.UploadUsecase, imageUsecase domain.ImageUsecase) {
	if len(images) == 0 {
		return
	}

	// This immediately frees up the calling stack frame and schedules execution on the runtime timer loop
	time.AfterFunc(0, func() {
		bgCtx := context.Background()

		publicIDs := make([]string, len(images))
		for i, img := range images {
			publicIDs[i] = img.CloudinaryPublicID
		}

		deletedIDs, failedIDs := uploadUsecase.Delete(publicIDs)

		if len(deletedIDs) > 0 {
			if dbErr := imageUsecase.DeleteByImageIds(bgCtx, deletedIDs); dbErr != nil {
				log.Printf("[CLEANUP-DB-ERROR] Failed to sync deleted items: %v", dbErr)
			}
		}

		// Instead of making a recursive or deep conditional frame for the retry,
		// schedule a completely separate event loop turn if items failed
		if len(failedIDs) > 0 {
			log.Printf("[CLEANUP-WARN] %d assets failed initial delete. Scheduling retry.", len(failedIDs))

			// Schedules a fresh event execution loop 5 seconds later
			time.AfterFunc(5*time.Second, func() {
				retryDeleted, retryFailed := uploadUsecase.Delete(failedIDs)

				if len(retryDeleted) > 0 {
					if dbErr := imageUsecase.DeleteByImageIds(bgCtx, retryDeleted); dbErr != nil {
						log.Printf("[CLEANUP-BG-DB-ERROR] Retry sync failed: %v", dbErr)
					}
				}

				if len(retryFailed) > 0 {
					log.Printf("[CLEANUP-CRITICAL] Assets permanently failed: %v", retryFailed)
				}
			})
		}
	})
}
