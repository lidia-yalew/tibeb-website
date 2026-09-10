package controller

import (
	"net/http"

	"tamcon-backend/domain"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ContactMessageController struct {
	usecase domain.ContactMessageUsecase
}

func NewContactMessageController(usecase domain.ContactMessageUsecase) *ContactMessageController {
	return &ContactMessageController{usecase: usecase}
}

// Submit GoDoc
// @Summary      Submit contact message
// @Description  Submit a contact/inquiry message from the contact form
// @Tags         contact
// @Accept       json
// @Produce      json
// @Param        message body domain.ContactMessage true "Contact message details"
// @Success      201 {object} domain.SuccessResponse{data=domain.ContactMessage}
// @Failure      400 {object} domain.ErrorResponse
// @Failure      500 {object} domain.ErrorResponse
// @Router       /api/contacts [post]
func (ctrl *ContactMessageController) Submit(c *gin.Context) {
	var msg domain.ContactMessage
	if err := c.ShouldBindJSON(&msg); err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{
			Message: "Validation failed",
			Error: &domain.ErrorDetails{
				Code:    "VALIDATION_ERROR",
				Details: err.Error(),
			},
		})
		return
	}

	if err := ctrl.usecase.SubmitMessage(c.Request.Context(), &msg); err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{
			Message: "Failed to submit message",
			Error: &domain.ErrorDetails{
				Code:    "INTERNAL_SERVER_ERROR",
				Details: err.Error(),
			},
		})
		return
	}

	c.JSON(http.StatusCreated, domain.SuccessResponse{
		Success: true,
		Message: "Your message has been submitted successfully",
		Data:    msg,
	})
}

// List GoDoc
// @Summary      List all contact messages
// @Description  Retrieve all submitted contact messages for admin review
// @Tags         admin contact
// @Security     BearerAuth
// @Produce      json
// @Success      200 {object} domain.SuccessResponse{data=[]domain.ContactMessage}
// @Failure      500 {object} domain.ErrorResponse
// @Router       /api/admin/contacts [get]
func (ctrl *ContactMessageController) List(c *gin.Context) {
	messages, err := ctrl.usecase.ListMessages(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{
			Message: "Failed to fetch messages",
			Error: &domain.ErrorDetails{
				Code:    "INTERNAL_SERVER_ERROR",
				Details: err.Error(),
			},
		})
		return
	}

	c.JSON(http.StatusOK, domain.SuccessResponse{
		Success: true,
		Message: "Messages retrieved successfully",
		Data:    messages,
	})
}

type UpdateStatusRequest struct {
	Status domain.MessageStatus `json:"status" binding:"required"`
}

// UpdateStatus GoDoc
// @Summary      Update message status
// @Description  Update the read/replied status of a contact message
// @Tags         admin contact
// @Security     BearerAuth
// @Accept       json
// @Produce      json
// @Param        id path string true "Message ID"
// @Param        payload body UpdateStatusRequest true "Updated status payload"
// @Success      200 {object} domain.SuccessResponse{data=domain.ContactMessage}
// @Failure      400 {object} domain.ErrorResponse
// @Failure      500 {object} domain.ErrorResponse
// @Router       /api/admin/contacts/{id}/status [put]
func (ctrl *ContactMessageController) UpdateStatus(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{
			Message: "Invalid message ID format",
			Error: &domain.ErrorDetails{
				Code:    "BAD_REQUEST",
				Details: err.Error(),
			},
		})
		return
	}

	var req UpdateStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{
			Message: "Invalid request payload",
			Error: &domain.ErrorDetails{
				Code:    "VALIDATION_ERROR",
				Details: err.Error(),
			},
		})
		return
	}

	updatedMsg, err := ctrl.usecase.UpdateStatus(c.Request.Context(), id, req.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{
			Message: "Failed to update status",
			Error: &domain.ErrorDetails{
				Code:    "INTERNAL_SERVER_ERROR",
				Details: err.Error(),
			},
		})
		return
	}

	c.JSON(http.StatusOK, domain.SuccessResponse{
		Success: true,
		Message: "Message status updated successfully",
		Data:    updatedMsg,
	})
}

// Delete GoDoc
// @Summary      Delete contact message
// @Description  Delete a contact message by ID
// @Tags         admin contact
// @Security     BearerAuth
// @Produce      json
// @Param        id path string true "Message ID"
// @Success      200 {object} domain.SuccessResponse
// @Failure      400 {object} domain.ErrorResponse
// @Failure      500 {object} domain.ErrorResponse
// @Router       /api/admin/contacts/{id} [delete]
func (ctrl *ContactMessageController) Delete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, domain.ErrorResponse{
			Message: "Invalid message ID format",
			Error: &domain.ErrorDetails{
				Code:    "BAD_REQUEST",
				Details: err.Error(),
			},
		})
		return
	}

	if err := ctrl.usecase.DeleteMessage(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, domain.ErrorResponse{
			Message: "Failed to delete message",
			Error: &domain.ErrorDetails{
				Code:    "INTERNAL_SERVER_ERROR",
				Details: err.Error(),
			},
		})
		return
	}

	c.JSON(http.StatusOK, domain.SuccessResponse{
		Success: true,
		Message: "Message deleted successfully",
	})
}
