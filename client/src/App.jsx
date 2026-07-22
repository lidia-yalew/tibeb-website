import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react' // ← ADD THIS
import { AuthProvider } from './Context/AuthContext'
import Navbar from './Componet/Navbar'
import AdminLayout from './Layout/AdminLayout'
import ProtectedRoute from './Componet/ProtactedRout'
import Login from './Pags/Admin/Login'
import ForgotPassword from "./Pags/Admin/ForgotPassword";
import ResetPassword from "./Pags/Admin/ResetPassword";

// ✅ ADD LAZY LOADING FOR ALL PAGES
const Home = lazy(() => import('./Pags/Home'))
const About = lazy(() => import('./Pags/About'))
const Services = lazy(() => import('./Pags/Service'))
const Team = lazy(() => import('./Pags/team'))
const Portfolio = lazy(() => import('./Pags/Portfolio'))
const Testimonials = lazy(() => import('./Pags/Testimonials'))
const Contact = lazy(() => import('./Pags/Contact'))

const Dashboard = lazy(() => import('./Pags/Admin/Dashboard'))
const ManageTeam = lazy(() => import('./Pags/Admin/ManageTeam'))
const ManagePortfolio = lazy(() => import('./Pags/Admin/ManagePortfolio'))
const ManageTestimonials = lazy(() => import('./Pags/Admin/ManageTestimonials'))
const Messages = lazy(() => import('./Pags/Admin/Messages'))
const Profile = lazy(() => import('./Pags/Admin/Profile'))
const Settings = lazy(() => import('./Pags/Admin/Settings'))
const AddAdmin = lazy(() => import('./Pags/Admin/AddAdmin'))

import ReactGA from 'react-ga4';

ReactGA.initialize('G-XXXXXXXXXX');

// Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="mt-4 text-theme-light">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes with Navbar */}
            <Route element={<Navbar />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/team" element={<Team />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            <Route path="/admin" element={<Login />} />
            <Route path="/admin/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin/reset-password" element={<ResetPassword />} />

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/team" element={<ManageTeam />} />
                <Route path="/admin/portfolio" element={<ManagePortfolio />} />
                <Route path="/admin/testimonials" element={<ManageTestimonials />} />
                <Route path="/admin/messages" element={<Messages />} />
                <Route path="/admin/profile" element={<Profile />} />
                <Route path="/admin/AddAdmin" element={<AddAdmin />} />
                <Route path="/admin/settings" element={<Settings />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App