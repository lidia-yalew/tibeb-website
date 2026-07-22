# 🌟 Tibeb Website

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-06B6D4?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com)

> **A modern, responsive React website for professional service providers with a full-featured admin dashboard.**

---

## 📖 Table of Contents
- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Integration](#api-integration)
- [Google Analytics Setup](#google-analytics-setup)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 📝 About

**Tibeb** is a professional services website built with React. It showcases services, team members, portfolio projects, and client testimonials. The platform includes a secure admin dashboard for managing all content dynamically.

The name **"Tibeb"** (ትብብ) represents excellence and craftsmanship in the Ethiopian context, reflecting the quality of services provided.

### Key Capabilities
- **Public Website**: 7+ pages with responsive design
- **Admin Dashboard**: Full CRUD operations for testimonials, team, and portfolio
- **Client Engagement**: Public testimonial submissions with admin approval workflow
- **Analytics Ready**: Google Analytics 4 integration for tracking user engagement

---

## ✨ Features

### Public Pages
- ✅ **Home** - Hero section, services overview, stats, and featured content
- ✅ **About** - Company story, mission, and vision
- ✅ **Services** - Detailed service offerings with descriptions
- ✅ **Team** - Professional team member profiles with roles
- ✅ **Portfolio** - Project showcase with filtering
- ✅ **Testimonials** - Client feedback with submission form (pending approval)
- ✅ **Contact** - Contact form with message storage

### Admin Dashboard
- ✅ **Secure Authentication** - JWT-based login system
- ✅ **Testimonials Management** - Publish, unpublish, or delete client submissions
- ✅ **Team Management** - Add, edit, and remove team members
- ✅ **Portfolio Management** - Add, edit, and remove portfolio items
- ✅ **Messages Inbox** - View and manage contact form submissions
- ✅ **Profile Management** - Update admin profile and credentials
- ✅ **Settings** - Configure website settings

### Technical Features
- ✅ **Responsive Design** - Optimized for desktop, tablet, and mobile
- ✅ **Dark/Light Theme** - System preference-based theming (if implemented)
- ✅ **Lazy Loading** - Optimized page loading performance
- ✅ **Google Analytics 4** - Page views and event tracking
- ✅ **Protected Routes** - Admin-only access control
- ✅ **Environment Variables** - Secure configuration management

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI framework |
| React Router DOM | 6.x | Routing and navigation |
| Tailwind CSS | 3.3.0 | Styling and design |
| Axios | 1.4.0 | HTTP client for API calls |
| react-ga4 | 2.x | Google Analytics 4 integration |

### Backend (External)
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18.x | Runtime environment |
| Express | 4.x | API framework |
| PostgreSQL | 14.x | Database |
| JWT | 8.x | Authentication |

---

## 📁 Project Structure
tibeb-website/
├── public/
│ ├── favicon.ico
│ ├── index.html
│ ├── manifest.json
│ └── robots.txt
│
├── src/
│ ├── Components/
│ │ ├── Navbar.jsx
│ │ ├── Footer.jsx
│ │ ├── ProtectedRoute.jsx
│ │ └── ... (reusable components)
│ │
│ ├── Pages/
│ │ ├── Home.jsx
│ │ ├── About.jsx
│ │ ├── Services.jsx
│ │ ├── Team.jsx
│ │ ├── Portfolio.jsx
│ │ ├── Testimonials.jsx
│ │ ├── Contact.jsx
│ │ │
│ │ └── Admin/
│ │ ├── Login.jsx
│ │ ├── Dashboard.jsx
│ │ ├── ManageTestimonials.jsx
│ │ ├── ManageTeam.jsx
│ │ ├── ManagePortfolio.jsx
│ │ ├── Messages.jsx
│ │ ├── Profile.jsx
│ │ ├── Settings.jsx
│ │ └── AddAdmin.jsx
│ │
│ ├── Context/
│ │ └── AuthContext.jsx
│ │
│ ├── Layout/
│ │ └── AdminLayout.jsx
│ │
│ ├── Assets/
│ │ └── Img/
│ │ ├── hero-bg.jpg
│ │ ├── test.png
│ │ └── ... (other images)
│ │
│ ├── App.jsx
│ ├── index.js
│ └── index.css
│
├── .env
├── .gitignore
├── package.json
├── README.md
├── tailwind.config.js
└── vercel.json (optional)