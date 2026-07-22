
import AboutHero from "../Componet/AboutHero";
import AboutCont from "../Componet/AboutCont";
import { Link } from "react-router-dom";
import SEO from "../Componet/SEO";

export default function About() {
 

  return (
    <div className="bg-theme min-h-screen">
 <SEO 
        title="About Us"
        description="Learn about Tibeb Consultancy - our mission, vision, and team of expert consultants in Ethiopia."
        keywords="about, mission, vision, consultants, Ethiopia"
        url="https://www.tibeb.com/about"
      />
<AboutHero/>
<AboutCont/>

    </div>
  );
}
