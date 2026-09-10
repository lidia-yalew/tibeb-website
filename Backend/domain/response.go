package domain

type ErrorDetails struct {
	Code    string `json:"code"`
	Details string `json:"details"`
}

type SuccessResponse struct {
	Success bool        `json:"success" default:"true"`
	Message string      `json:"message,omitempty" default:"Success"`
	Data    interface{} `json:"data,omitempty"`
}

type ErrorResponse struct {
	Success bool          `json:"success" default:"false"`
	Message string        `json:"message" default:"Error"`
	Error   *ErrorDetails `json:"error,omitempty"`
}
