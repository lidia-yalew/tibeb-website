import React from 'react'
import img2 from "../assets/Img/about.png"

function AboutHero() {
  return (
    <div>     {/* ── HERO ── */}
    <section className="relative w-full overflow-hidden flex items-center md:min-h-screen mt-[72px] md:mt-0">
     <img src={img2} className="w-full h-auto md:h-full md:absolute md:inset-0 md:object-cover md:object-center" />
    </section></div>
  )
}

export default AboutHero