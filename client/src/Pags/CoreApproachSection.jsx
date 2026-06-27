import { useRef, useEffect, useState } from "react";
import logo from "../assets/Img/logo.png"

const approach = [
  { num: "01", title: "Client-Centric Solutions", desc: "We listen intently to understand your unique challenges and objectives, developing customized strategies that align perfectly with your vision." },
  { num: "02", title: "Evidence-Based & Data-Driven", desc: "Our recommendations are grounded in robust research, current data, and proven methodologies, ensuring practical and effective outcomes." },
  { num: "03", title: "Capacity Building Focus", desc: "Training is at the heart of what we do. We design and deliver impactful programs that empower your teams with the skills, knowledge, and confidence." },
  { num: "04", title: "Holistic Perspective", desc: "Recognizing the interconnectedness of health, education, and agriculture, we adopt a comprehensive approach that considers cross-sectoral synergies." },
  { num: "05", title: "Sustainable Impact", desc: "We are committed to fostering solutions that are not only effective in the short term but also self-sustaining, leaving a lasting legacy of positive change." },
  { num: "06", title: "Co-Creation over Imposition", desc: "We work alongside client teams to co-author workflows, standard operating procedures, and curriculums for natural internal integration." },
];

const ORBIT_R   = 210;   // px from center to card center
const DURATION  = 30;    // seconds per full revolution
const CARD_W    = 130;
const CARD_H    = 50;    // collapsed height estimate (used for offset)

/* alternating accent colors */
const accent = (i) => (i % 2 === 0 ? "#1A237E" : "#C9A84C");
const iconBg  = (i) => (i % 2 === 0 ? "rgba(26,35,126,0.09)" : "rgba(201,168,76,0.11)");

export default function CoreApproachSection() {
  /* track which arm is hovered */
  const [hoveredIdx, setHoveredIdx] = useState(null);

  /* We drive animation via a requestAnimationFrame loop so each card
     remembers its live angle when paused, and resumes from there —
     eliminating the "jump back" bug that CSS-only counter-rotation causes. */
  const anglesRef  = useRef(approaches.map((_, i) => (i / approaches.length) * 360));
  const pausedRef  = useRef(Array(approaches.length).fill(false));
  const rafRef     = useRef(null);
  const lastRef    = useRef(null);
  const armRefs    = useRef([]);
  const innerRefs  = useRef([]);

  useEffect(() => {
    const DEG_PER_MS = 360 / (DURATION * 1000);

    function applyTransforms() {
      anglesRef.current.forEach((deg, i) => {
        const arm   = armRefs.current[i];
        const inner = innerRefs.current[i];
        if (!arm || !inner) return;
        const rad = (deg * Math.PI) / 180;
        const x   = ORBIT_R * Math.cos(rad);
        const y   = ORBIT_R * Math.sin(rad);
        arm.style.transform   = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        inner.style.transform = `rotate(${-deg}deg)`;
      });
    }

    function tick(ts) {
      if (lastRef.current == null) lastRef.current = ts;
      const dt = ts - lastRef.current;
      lastRef.current = ts;

      anglesRef.current = anglesRef.current.map((deg, i) =>
        pausedRef.current[i] ? deg : (deg + DEG_PER_MS * dt) % 360
      );
      applyTransforms();
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  /* sync pause state into the ref the RAF loop reads */
  useEffect(() => {
    pausedRef.current = approaches.map((_, i) => i === hoveredIdx);
  }, [hoveredIdx]);

  return (
    <section style={styles.section}>
      {/* blobs */}
      <div style={{ ...styles.blob, top: 0, right: 0, background: "rgba(201,168,76,0.06)" }} />
      <div style={{ ...styles.blob, bottom: 0, left: 0, background: "rgba(26,35,126,0.05)" }} />

      <div style={styles.inner}>
        {/* heading */}
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <h2 style={styles.heading}>
            Our Core <span style={{ color: "#C9A84C" }}>Approach</span>
          </h2>
          <p style={styles.sub}>WISDOM IN ACTION</p>
        </div>

        {/* ── ORBIT STAGE ── */}
        <div style={styles.stage}>
          {/* dashed ring */}
          <div style={styles.ring} />

          {/* center hub */}
          <div style={styles.hub}>
            <div style={styles.hubCircle}>
               <img src={logo} alt="Tibeb" style={{ width: "70%", height: "70%", objectFit: "contain" }} />
            </div>
            <p style={styles.hubLabel}>Tibeb Consulting</p>
          </div>

          {/* orbiting cards */}
          {approaches.map((a, i) => {
            const col = accent(i);
            const bg  = iconBg(i);
            const isH = hoveredIdx === i;
            return (
              <div
                key={i}
                ref={el => (armRefs.current[i] = el)}
                style={styles.arm}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div ref={el => (innerRefs.current[i] = el)} style={styles.armInner}>
                  <div
                    style={{
                      ...styles.card,
                      borderColor: isH ? col : "rgba(26,35,126,0.1)",
                      boxShadow: isH ? `0 8px 28px rgba(26,35,126,0.18)` : "none",
                      transform: isH ? "scale(1.06)" : "scale(1)",
                    }}
                  >
                    {/* glow overlay */}
                    <div style={{
                      ...styles.cardGlow,
                      background: `radial-gradient(circle, ${col}10, transparent 70%)`,
                      opacity: isH ? 1 : 0,
                    }} />

                    <div style={{ ...styles.cardDot, background: col, opacity: isH ? 1 : 0.3 }} />
                    <div style={{ ...styles.cardNum, color: col, opacity: isH ? 0.2 : 0.08 }}>{a.num}</div>

                    <div style={{ ...styles.cardIcon, background: bg,
                      transform: isH ? "scale(1.15) rotate(6deg)" : "scale(1)" }}>
                      {a.icon}
                    </div>

                    <h3 style={{ ...styles.cardTitle, color: col }}>{a.title}</h3>

                    {/* description — slides in on hover */}
                    <div style={{
                      ...styles.cardDesc,
                      maxHeight: isH ? 80 : 0,
                      opacity: isH ? 1 : 0,
                      marginTop: isH ? 6 : 0,
                    }}>
                      {a.desc}
                    </div>

                    {/* dot indicators */}
                    <div style={styles.dots}>
                      {[1, 0.4, 0.2].map((op, d) => (
                        <span key={d} style={{
                          ...styles.dot,
                          background: col,
                          width: isH ? 14 : 3,
                          opacity: op,
                          transitionDelay: `${d * 60}ms`,
                        }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* hint */}
        <div style={styles.hint}>
          <span style={styles.hintLine} />
          <span>🖱 Hover any card to pause & reveal</span>
          <span style={styles.hintLine} />
        </div>
      </div>

      {/* Mobile grid */}
      <div style={styles.mobileGrid}>
        {approaches.map((a, i) => {
          const col = accent(i);
          return (
            <div key={i} style={{ ...styles.mobileCard, borderColor: "rgba(26,35,126,0.1)" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = col}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(26,35,126,0.1)"}
            >
              <div style={{ ...styles.cardNum, color: col, fontSize: 28 }}>{a.num}</div>
              <div style={{ ...styles.cardIcon, background: iconBg(i), fontSize: 22, width: 44, height: 44, margin: "8px 0" }}>{a.icon}</div>
              <h3 style={{ ...styles.cardTitle, color: col, fontSize: 12, textAlign: "left" }}>{a.title}</h3>
              <p style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.5, margin: 0 }}>{a.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── styles ── */
const styles = {
  section: {
    padding: "80px 24px",
    background: "#f0f2f8",
    position: "relative",
    overflow: "hidden",
  },
  blob: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: "50%",
    filter: "blur(80px)",
    pointerEvents: "none",
  },
  inner: {
    maxWidth: 600,
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  heading: {
    fontSize: 32,
    fontWeight: 800,
    color: "#1A237E",
    margin: 0,
    letterSpacing: -0.5,
  },
  sub: {
    fontSize: 11,
    letterSpacing: 2,
    color: "#8891b0",
    margin: "4px 0 0",
  },

  /* orbit */
  stage: {
    position: "relative",
    width: 520,
    height: 520,
    margin: "0 auto",
  },
  ring: {
    position: "absolute",
    top: "50%", left: "50%",
    width: ORBIT_R * 2,
    height: ORBIT_R * 2,
    transform: "translate(-50%, -50%)",
    borderRadius: "50%",
    border: "1.5px dashed rgba(201,168,76,0.35)",
    pointerEvents: "none",
  },
  hub: {
    position: "absolute",
    top: "50%", left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 20,
    textAlign: "center",
  },
  hubCircle: {
    width: 108, height: 108,
    borderRadius: "50%",
    background: "#fff",
    border: "2.5px solid #C9A84C",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 24px rgba(26,35,126,0.12)",
    margin: "0 auto",
  },
  hubLabel: {
    fontSize: 7,
    letterSpacing: 2,
    color: "#C9A84C",
    fontWeight: 700,
    textTransform: "uppercase",
    margin: "6px 0 0",
  },

  /* card arm */
  arm: {
    position: "absolute",
    top: "50%", left: "50%",
    width: 0, height: 0,
    zIndex: 10,
  },
  armInner: {
    /* rotation set by RAF */
    position: "absolute",
    top: -CARD_H,
    left: -CARD_W / 2,
    transition: "none",
  },
  card: {
    width: CARD_W,
    background: "#fff",
    borderRadius: 16,
    border: "1.5px solid rgba(26,35,126,0.1)",
    padding: "14px 12px 12px",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    transition: "border-color 0.3s, box-shadow 0.3s, transform 0.3s",
  },
  cardGlow: {
    position: "absolute",
    inset: 0,
    borderRadius: 16,
    transition: "opacity 0.4s",
    pointerEvents: "none",
  },
  cardDot: {
    width: 7, height: 7,
    borderRadius: "50%",
    position: "absolute",
    top: 14, left: 12,
    transition: "opacity 0.3s",
  },
  cardNum: {
    fontSize: 22,
    fontWeight: 900,
    lineHeight: 1,
    position: "absolute",
    top: 10, right: 12,
    transition: "opacity 0.3s",
  },
  cardIcon: {
    width: 38, height: 38,
    borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 18,
    margin: "18px auto 8px",
    transition: "transform 0.3s",
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: 700,
    textAlign: "center",
    lineHeight: 1.3,
    letterSpacing: 0.2,
    margin: 0,
  },
  cardDesc: {
    fontSize: 9,
    textAlign: "center",
    color: "#6b7280",
    lineHeight: 1.5,
    overflow: "hidden",
    transition: "max-height 0.45s ease, opacity 0.35s ease 0.1s, margin-top 0.3s",
    margin: 0,
  },
  dots: {
    display: "flex",
    justifyContent: "center",
    gap: 3,
    marginTop: 8,
  },
  dot: {
    height: 3,
    borderRadius: 2,
    transition: "width 0.35s, opacity 0.3s",
  },

  /* hint */
  hint: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontSize: 11,
    color: "#aab0c8",
    marginTop: 12,
  },
  hintLine: {
    display: "inline-block",
    width: 28, height: 1,
    background: "#C9A84C",
    opacity: 0.5,
  },

  /* mobile */
  mobileGrid: {
    display: "none", /* show via media query in your CSS / Tailwind: "lg:hidden grid ..." */
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 12,
    maxWidth: 480,
    margin: "0 auto",
  },
  mobileCard: {
    background: "#fff",
    borderRadius: 16,
    border: "1.5px solid rgba(26,35,126,0.1)",
    padding: 14,
    transition: "border-color 0.3s",
  },
};
