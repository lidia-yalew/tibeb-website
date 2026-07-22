import React from 'react'
import Navbar from '../Componet/Navbar'
import Hero from '../Componet/Hero'
import AboutCont from "../Componet/AboutCont"
import PortfolioPage from "../Pags/Portfolio"
import Footer from '../Componet/Footer'
import SEO from '../Componet/SEO'

function Home() {
  return (
    <div> <SEO 
        title="Home"
        description="Tibeb Consultancy provides expert consulting, training, and project management services in Ethiopia. Transform your organization today."
        keywords="consulting, training, project management, Ethiopia, organizational development"
        url="https://www.tibeb.com"
      /><Hero/><AboutCont/><PortfolioPage/><Footer/></div>
  )
}

export default Home