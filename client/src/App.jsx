import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pags/Home'
import About from './Pags/About'
import Services from './Pags/Service'
import Team from './Pags/team'
import Portfolio from './Pags/Portfolio'
import Testimonials from './Pags/Testimonials'
import Contact from './Pags/Contact'
import Login from './Pags/admin/Login'
import Dashboard from './Pags/admin/Dashibord'
import ManageTeam from './Pags/admin/ManageTeam'
import ManagePortfolio from './Pags/admin/ManagePortfolio'
import ManageTestimonials from './Pags/admin/ManageTestimonials'
import Messages from './Pags/admin/Messages'
import ProtectedRoute from './Componet/ProtactedRout'
import { AuthProvider } from './Context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/team" element={<Team />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Login />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/team" element={<ProtectedRoute><ManageTeam /></ProtectedRoute>} />
          <Route path="/admin/portfolio" element={<ProtectedRoute><ManagePortfolio /></ProtectedRoute>} />
          <Route path="/admin/testimonials" element={<ProtectedRoute><ManageTestimonials /></ProtectedRoute>} />
          <Route path="/admin/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App