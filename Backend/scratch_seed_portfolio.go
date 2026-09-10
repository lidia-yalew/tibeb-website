package main

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"tamcon-backend/domain"
)

func main() {
	dbURL := "postgresql://postgres:lidiadatabase@localhost:5432/tibeb_db?sslmode=disable"
	db, err := gorm.Open(postgres.Open(dbURL), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	projects := []domain.PortfolioProject{
		{
			Title:       "Project Design & Proposal Development Training",
			Client:      "Center for Advancement of Rights and Democracy (CARD)",
			Description: "Designed and delivered training programs on project design, proposal development, resource mobilization, and project implementation in Addis Ababa, Adama, and Dire Dawa.",
			Category:    "Capacity Development and Training",
		},
		{
			Title:       "Data Analytics & Enterprise Architecture Training",
			Client:      "Diverse Tech Solution PLC",
			Description: "Designed and executed premium capacity-building programs for data analytics and large scale data processing, enterprise architecture, and targeted sectors & strategic ecosystem placement with tailored training models and toolkits.",
			Date:        "December 2025",
			Category:    "Capacity Development and Training",
		},
		{
			Title:       "Data Visualization & Business Performance Assessment",
			Client:      "Panacea Business and Engineering PLC",
			Description: "Delivered Data visualization, business performance assessment, trend analysis, and reporting project.",
			Category:    "Data Analysis and Digital Transformation",
		},
		{
			Title:       "National Technology Market Assessment & Business Survey",
			Client:      "Diverse Tech Solution PLC",
			Description: "Conducted national technology market assessment & business survey project.",
			Category:    "Data Analysis and Digital Transformation",
		},
		{
			Title:       "Market Assessment and Marketing Strategies Research",
			Client:      "Oda Addi Trade PLC",
			Description: "Conducted market assessment and marketing strategies research on the diverse laboratory sectors of the country trends.",
			Date:        "February 2025",
			Category:    "Data Analysis and Digital Transformation",
		},
		{
			Title:       "Human Resource Recruitment and Placement",
			Client:      "Tena Adam Gardens PLC",
			Description: "Successfully recruited, trained, and deployed contract staff, providing end to end workforce solutions, including recruitment, screening, orientation, and deployment support.",
			Date:        "December 2026",
			Category:    "Human Resource Management",
		},
		{
			Title:       "Terminal Evaluation of the SRA4C Project",
			Client:      "Ethiopian Evangelical Church MekaneYesus Development and Social Services Commission (EECMY-DASSC)",
			Description: "Successfully conducted the terminal evaluation of the Strengthening the Resilience and Adaptive Capacity of Communities to Climate Change (SRA4C) Project, producing evidence-based recommendations for future programming.",
			Category:    "Monitoring, Evaluation and Research",
		},
		{
			Title:       "Institutional Development and Systems Strengthening",
			Client:      "Nexsuses Trading and Consultancy Service",
			Description: "Developed and delivered organizational manuals including Organizational Bylaws, Human Resource Manual, Financial Administration Manual, and Training Administration Manual.",
			Date:        "May 2024",
			Category:    "Institutional Development",
		},
		{
			Title:       "Organizational Model Diagnosis & Technology Integration Strategy",
			Client:      "DESHET Education and Training Service S.C.",
			Description: "Delivered organizational development work on organizational model diagnosis & change management strategy, and technology integration strategy development.",
			Date:        "September 2025",
			Category:    "Business Development and Strategy",
		},
		{
			Title:       "Education and Digital Transformation",
			Client:      "Mahibere Kidusan Hawassa Center (MKHC)",
			Description: "Recognized for contributions in educational systems building, ICT and digitalization, capacity building, and Leap Learning Applications (LLA).",
			Date:        "2025",
			Category:    "Education and Digital Transformation",
		},
		{
			Title:       "19th Biennial Conference Support",
			Client:      "International Biometrics Society (IBS) Ethiopian Region",
			Description: "Outstanding support to the 19th Biennial Conference held in Addis Ababa.",
			Date:        "September 2025",
			Category:    "Event Management",
		},
		{
			Title:       "Professional Training Services",
			Client:      "AfrInnovation Engineering and Business Solution PLC",
			Description: "Delivered specialized training programs on multitasking and productivity management, data and networking, and strategic planning.",
			Date:        "April 2024",
			Category:    "Professional Training Services",
		},
		{
			Title:       "Professional Training Services",
			Client:      "Ethiolab Equipment Supply PLC",
			Description: "Provides training on project design and implementation, partnership and stakeholders’ management.",
			Category:    "Professional Training Services",
		},
		{
			Title:       "Trading Project",
			Client:      "GATEM Trading PLC",
			Description: "Implemented projects and training.",
			Date:        "November 2026",
			Category:    "General",
		},
	}

	for _, p := range projects {
		if err := db.Create(&p).Error; err != nil {
			log.Printf("Failed to insert %s: %v", p.Title, err)
		} else {
			log.Printf("Successfully inserted %s", p.Title)
		}
	}
}
