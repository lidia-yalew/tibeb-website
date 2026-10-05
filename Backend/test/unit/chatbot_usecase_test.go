package unit

import (
	"context"
	"os"
	"strings"

	"tamcon-backend/usecase"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

var _ = Describe("Chatbot Usecase", func() {
	var (
		ctx    context.Context
		apiKey string
	)

	BeforeEach(func() {
		ctx = context.Background()
		apiKey = os.Getenv("GEMINI_API_KEY")
	})

	Describe("NewChatbotUsecase", func() {
		It("should successfully load the knowledge base file and initialize", func() {
			cbUsecase, err := usecase.NewChatbotUsecase("dummy-key", nil)
			Expect(err).NotTo(HaveOccurred())
			Expect(cbUsecase).NotTo(BeNil())
		})
	})

	Describe("GenerateResponse", func() {
		Context("with active API key (Live Test)", func() {
			It("should query Gemini and respect company facts", func() {
				// Only run if the key is a real Google API key (starts with "AIzaSy")
				if apiKey == "" || strings.Contains(apiKey, "your_actual") || strings.Contains(apiKey, "placeholder") {
					Skip("Skipping live Gemini API test: GEMINI_API_KEY is not set to a valid key")
				}

				cbUsecase, err := usecase.NewChatbotUsecase(apiKey, nil)
				Expect(err).NotTo(HaveOccurred())

				reply, err := cbUsecase.GenerateResponse(ctx, nil, "Who is the CEO of Tamcon?")
				Expect(err).NotTo(HaveOccurred())
				Expect(reply).To(ContainSubstring("Solomon Kebere"))
			})

			It("should politely decline out-of-scope questions", func() {
				// Only run if the key is a real Google API key (starts with "AIzaSy")
				if apiKey == "" || strings.Contains(apiKey, "your_actual") || strings.Contains(apiKey, "placeholder") {
					Skip("Skipping live Gemini API test: GEMINI_API_KEY is not set to a valid key")
				}

				cbUsecase, err := usecase.NewChatbotUsecase(apiKey, nil)
				Expect(err).NotTo(HaveOccurred())

				reply, err := cbUsecase.GenerateResponse(ctx, nil, "Can you tell me how to bake a chocolate cake?")
				Expect(err).NotTo(HaveOccurred())
				
				// Assert that it declined the out-of-scope question politely
				replyLower := strings.ToLower(reply)
				Expect(replyLower).To(SatisfyAny(
					ContainSubstring("decline"),
					ContainSubstring("unable"),
					ContainSubstring("cannot"),
					ContainSubstring("sorry"),
					ContainSubstring("focus"),
					ContainSubstring("software"),
				))
			})
		})
	})

})
