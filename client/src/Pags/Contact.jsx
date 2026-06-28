import { useEffect, useRef, useState } from "react";
import Navbar from "../Componet/Navbar";
import axios from "axios";

const clientTypes = [
  {
    id: "client",
    icon: "🏢",
    label: "Client / NGO / Government",
    color: "var(--color-primary)",
    placeholder: "Tell us about your organization and what service you need...",
    subjectOptions: [
      "Consultancy Services",
      "Research & Evaluation",
      "Capacity Building & Training",
      "Data Analytics & Visualization",
      "Health Sector Services",
      "Education Sector Services",
      "Agriculture Sector Services",
      "Other",
    ],
    badge: "Most Common",
    desc: "Looking to hire Tibeb for consultancy, training, research or data work",
  },
  {
    id: "partner",
    icon: "🤝",
    label: "Partner / Donor / Development Agency",
    color: "var(--color-secondary)",
    placeholder: "Describe the collaboration or partnership opportunity you have in mind...",
    subjectOptions: [
      "Project Collaboration",
      "Co-Implementation Proposal",
      "Funding / Grant Partnership",
      "Joint Research Initiative",
      "Knowledge Sharing",
      "Other",
    ],
    badge: "Partnership",
    desc: "Interested in collaborating, co-implementing a project, or funding our work",
  },
  {
    id: "jobseeker",
    icon: "👤",
    label: "Job Seeker / Consultant Applicant",
    color: "var(--color-primary)",
    placeholder: "Tell us about your background, expertise, and what role you are interested in...",
    subjectOptions: [
      "Associate Consultant Position",
      "Project Manager Role",
      "Research Specialist",
      "Training & Capacity Building",
      "Data Science & Analytics",
      "General Inquiry / CV Submission",
    ],
    badge: "Join Us",
    desc: "Want to join Tibeb as a consultant, associate, or staff member",
  },
];

const contactInfo = [
  {
    icon: "📍",
    label: "Address",
    value: "Arada Sub City, Addis Ababa, Ethiopia",
  },
  {
    icon: "📞",
    label: "Phone",
    value: "+251 XXX XXX XXX",
  },
  {
    icon: "✉️",
    label: "Email",
    value: "info@tibebconsulting.com",
  },
  {
    icon: "💼",
    label: "LinkedIn",
    value: "Tibeb Consultancy & Training PLC",
  },
];

export default function Contact() {
  const [selectedType, setSelectedType] = useState("client");
  const [form, setForm] = useState({ name: "", organization: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null);
  const sectionRefs = useRef([]);

  const activeType = clientTypes.find((t) => t.id === selectedType);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("animate-in")),
      { threshold: 0.1 }
    );
    sectionRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  const addRef = (el) => {
    if (el && !sectionRefs.current.includes(el)) sectionRefs.current.push(el);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await axios.post("http://localhost:5000/api/contact", {
        name: form.name,
        email: form.email,
        message: `[${activeType.label}] | Org: ${form.organization} | Subject: ${form.subject}\n\n${form.message}`,
      });
      setStatus("success");
      setForm({ name: "", organization: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="bg-theme min-h-screen">
      {/* ── HERO ── */}
      <section className="pt-[72px] relative overflow-hidden">
        <div className="relative py-24 px-6">
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20 animate-pulse"
              style={{ background: "radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)" }} />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)" }} />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-text mb-4 leading-tight">
              Let's <span className="text-secondary">Work Together</span>
            </h1>
            <p className="text-primary  text-lg max-w-2xl mx-auto leading-relaxed">
              Whether you're a client, partner, or looking to join our team —
              we'd love to hear from you.
            </p>

            {/* Client type pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {clientTypes.map((t) => (
                <div key={t.id} className="flex items-center gap-2 bg-card backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5">
                  <span>{t.icon}</span>
                  <span className="text-theme-light text-xs font-medium">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="relative -mt-1">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full h-[40px]" preserveAspectRatio="none">
            <path d="M0 30 C360 60 720 0 1080 30 C1260 45 1380 35 1440 30 L1440 60 L0 60Z" fill="var(--color-bg)" />
            <path d="M0 30 C360 60 720 0 1080 30 C1260 45 1380 35 1440 30" stroke="var(--color-secondary)" strokeWidth="2" fill="none" opacity="0.6" />
          </svg>
        </div>
      </section>

    {/* ── CLIENT TYPE SELECTOR ── */}
<section className="py-12 px-4 md:px-6">
  <div className="max-w-6xl mx-auto">
    <div ref={addRef} className="fade-up text-center mb-8 md:mb-10">
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="h-0.5 w-8 bg-secondary rounded" />
        <span className="text-xs font-bold text-secondary tracking-[2px]">WHO ARE YOU?</span>
        <div className="h-0.5 w-8 bg-secondary rounded" />
      </div>
      <h2 className="text-2xl md:text-3xl font-extrabold text-primary">Select Your Profile</h2>
      <p className="text-theme-light text-sm mt-2 max-w-md mx-auto">
        Tell us who you are so we can tailor the form to your needs
      </p>
    </div>

    {/* Profile Cards - Responsive grid */}
    <div ref={addRef} className="fade-up grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-10 md:mb-12">
      {clientTypes.map((t) => {
        const isActive = selectedType === t.id;
        const color = t.color;
        return (
          <button
            key={t.id}
            onClick={() => { setSelectedType(t.id); setForm({ ...form, subject: "" }); }}
            className={`relative text-left rounded-2xl p-4 md:p-6 border-2 transition-all duration-300 group hover:-translate-y-1 ${
              isActive ? 'shadow-card' : ''
            }`}
            style={{
              borderColor: isActive ? color : 'var(--color-border)',
              background: isActive ? 'var(--color-card)' : 'var(--color-card)',
              boxShadow: isActive ? `0 8px 30px ${color}20` : 'none',
            }}
          >
            {/* Selected indicator */}
            {isActive && (
              <div className="absolute top-3 left-3 w-2 h-2 rounded-full animate-pulse" style={{ background: color }} />
            )}

            <div className="text-3xl mb-2 md:mb-3">{t.icon}</div>
            <h3 className="font-bold text-sm mb-1 leading-snug text-secondary" >{t.label}</h3>
            <p className="text-theme-light text-xs leading-relaxed">{t.desc}</p>

            {/* Bottom accent */}
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300 ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`} style={{ background: color }} />
          </button>
        );
      })}
    </div>

    {/* ── FORM + INFO ── */}
    <div ref={addRef} className="fade-up grid lg:grid-cols-5 gap-6 md:gap-8">
      {/* FORM - 3 cols */}
      <div className="lg:col-span-3">
        <div className="bg-card border border-theme rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-card">
          {/* Form header */}
          <div className="flex items-center gap-3 mb-5 md:mb-6 pb-4 md:pb-6 border-b border-theme">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-xl md:text-2xl bg-secondary/10">
              {activeType.icon}
            </div>
            <div>
              <div className="text-[10px] md:text-xs font-bold tracking-[2px] text-secondary">
                {activeType.badge.toUpperCase()}
              </div>
              <div className="font-bold text-primary text-xs md:text-sm">{activeType.label}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            {/* Name + Organization */}
            <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="text-[10px] md:text-xs font-semibold text-theme-light mb-1 md:mb-1.5 block">Full Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-theme bg-theme text-theme text-xs md:text-sm outline-none transition-all duration-200 hover:border-secondary focus:border-secondary"
                />
              </div>
              <div>
                <label className="text-[10px] md:text-xs font-semibold text-theme-light mb-1 md:mb-1.5 block">
                  {selectedType === "jobseeker" ? "Current Organization" : "Organization / Institution"} *
                </label>
                <input
                  name="organization"
                  value={form.organization}
                  onChange={handleChange}
                  required
                  placeholder={selectedType === "jobseeker" ? "Your current employer" : "Your organization name"}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-theme bg-theme text-theme text-xs md:text-sm outline-none transition-all duration-200 hover:border-secondary focus:border-secondary"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-[10px] md:text-xs font-semibold text-theme-light mb-1 md:mb-1.5 block">Email Address *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-theme bg-theme text-theme text-xs md:text-sm outline-none transition-all duration-200 hover:border-secondary focus:border-secondary"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="text-[10px] md:text-xs font-semibold text-theme-light mb-1 md:mb-1.5 block">
                {selectedType === "jobseeker" ? "Position of Interest *" : "Subject / Service *"}
              </label>
              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-theme bg-theme text-theme text-xs md:text-sm outline-none transition-all duration-200 hover:border-secondary focus:border-secondary appearance-none"
                style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                }}
              >
                <option value="">Select an option...</option>
                {activeType.subjectOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="text-[10px] md:text-xs font-semibold text-theme-light mb-1 md:mb-1.5 block">Message *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={4}
                placeholder={activeType.placeholder}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-theme bg-theme text-theme text-xs md:text-sm outline-none transition-all duration-200 hover:border-secondary focus:border-secondary resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 md:py-3.5 rounded-xl font-bold text-white text-xs md:text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:opacity-90 hover:-translate-y-1 disabled:opacity-60 shadow-glow"
              style={{ background: 'var(--color-primary)' }}
            >
              {status === "loading" ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>

            {/* Status */}
            {status === "success" && (
              <div className="flex items-center gap-2 p-3 md:p-4 rounded-xl text-xs md:text-sm font-medium bg-primary/10 text-primary">
                ✅ Your message was sent successfully! We will get back to you soon.
              </div>
            )}
            {status === "error" && (
              <div className="flex items-center gap-2 p-3 md:p-4 rounded-xl text-xs md:text-sm font-medium bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                ❌ Something went wrong. Please try again or email us directly.
              </div>
            )}
          </form>
        </div>
      </div>

      {/* INFO - 2 cols */}
      <div className="lg:col-span-2 space-y-4">
        {/* Contact details */}
        <div className="bg-card border border-theme rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-card">
          <div className="text-xs font-bold tracking-[2px] text-secondary mb-4">CONTACT DETAILS</div>
          <div className="space-y-3 md:space-y-4">
            {contactInfo.map((c, i) => (
              <div key={i} className="flex items-start gap-3 group hover:-translate-x-1 transition-all duration-300">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-base md:text-xl flex-shrink-0 bg-secondary/10">
                  {c.icon}
                </div>
                <div>
                  <div className="text-[10px] md:text-xs font-semibold text-theme-light">{c.label}</div>
                  <div className="text-xs md:text-sm font-medium text-primary mt-0.5">{c.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What to expect */}
        <div className="bg-card border border-theme rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-card">
          <div className="text-xs font-bold tracking-[2px] text-secondary mb-4">WHAT TO EXPECT</div>
          <div className="space-y-2 md:space-y-3">
            {[
              { step: "01", text: "We review your message within 24 hours" },
              { step: "02", text: "Our team will contact you by email or phone" },
              { step: "03", text: "We schedule a discovery call or meeting" },
              { step: "04", text: "We propose a tailored solution for your needs" },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3 group hover:translate-x-1 transition-all duration-300">
                <div className="text-[10px] md:text-xs font-black mt-0.5 flex-shrink-0 text-primary/30">{s.step}</div>
                <p className="text-xs md:text-sm text-theme-light leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Note based on client type */}
        <div className="rounded-2xl p-4 md:p-5 border bg-secondary/5 border-secondary/20">
          <div className="text-[10px] md:text-xs font-bold tracking-[2px] mb-2 text-secondary">
            {activeType.icon} NOTE FOR YOU
          </div>
          <p className="text-xs md:text-sm text-theme-light leading-relaxed">
            {selectedType === "client" && "We serve government institutions, NGOs, development partners, and private sector organizations. Our team will review your inquiry and propose the right service package."}
            {selectedType === "partner" && "We are always open to meaningful partnerships that advance sustainable development in Ethiopia. Tell us your vision and we will explore how we can co-create together."}
            {selectedType === "jobseeker" && "Tibeb brings together 15+ founding members and 37+ senior associate consultants. If you have expertise in health, education, agriculture, or data science, we'd love to hear from you."}
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* ── MAP ── */}
      <section className="py-6 px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <div ref={addRef} className="fade-up rounded-3xl overflow-hidden border border-theme shadow-card h-[280px] bg-theme-light">
            <iframe
              title="Tibeb Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.4!2d38.7469!3d9.0249!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sArada%20Sub%20City%2C%20Addis%20Ababa!5e0!3m2!1sen!2set!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(20%)" }}
              allowFullScreen
              loading="lazy"
            />
          </div>
          <p className="text-center text-xs text-theme-light mt-3">
            📍 Arada Sub City, Addis Ababa, Ethiopia
          </p>
        </div>
      </section>

      <style>{`
        .fade-up { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .fade-up.animate-in { opacity: 1; transform: translateY(0); }
        input::placeholder, textarea::placeholder { opacity: 0.6; }
        select option { background: var(--color-card); color: var(--color-text); }
      `}</style>
    </div>
  );
}