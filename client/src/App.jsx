import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pags/Home'
import About from './Pags/About'
import Services from './Pags/Service'
import Team from './Pags/team'
import Portfolio from './Pags/Portfolio'
import Testimonials from './Pags/Testimonials'
import Contact from './Pags/Contact'
import Login from './Pags/Admin/Login'
import Dashboard from './Pags/Admin/Dashboard'
import ManageTeam from './Pags/Admin/ManageTeam'
import ManagePortfolio from './Pags/Admin/ManagePortfolio'
import ManageTestimonials from './Pags/Admin/ManageTestimonials'
import Messages from './Pags/Admin/Messages'
import ProtectedRoute from './Componet/ProtactedRout'
import { AuthProvider } from './Context/AuthContext'
import Navbar from './Componet/Navbar'
import AdminLayout from './Layout/AdminLayout'
import Profile from './Pags/Admin/Profile'
import ChangePassword from './Pags/Admin/ChangePassword'
import Settings from './Pags/Admin/Settings'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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

          {/* Admin Login - No Navbar */}
          <Route path="/admin" element={<Login />} />

          {/* Protected Admin Routes with AdminLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/team" element={<ManageTeam />} />
              <Route path="/admin/portfolio" element={<ManagePortfolio />} />
              <Route path="/admin/testimonials" element={<ManageTestimonials />} />
              <Route path="/admin/messages" element={<Messages />} />
              <Route path="/admin/profile" element={<Profile />} />
<Route path="/admin/profile/change-password" element={<ChangePassword />} />
<Route path="/admin/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App