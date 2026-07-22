import React from 'react'
import img2 from "../assets/Img/about.png"

function AboutHero() {
  return (
    <div>     {/* ── HERO ── */}
    <section className="relative min-h-screen overflow-hidden flex items-center pt-[78px] md:pt-[45px]">
     <img src={img2} className="w-full h-[580px] object-cover" />
    </section></div>
  )
}

export default AboutHero