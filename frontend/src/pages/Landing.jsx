import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Landing() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div style={styles.wrapper}>
      
      {/* Floating Particles */}
      <div style={styles.particles}></div>

      {/* Glass Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>Ali's AI</div>
        <div style={styles.navLinks}>
          <span style={styles.link}>Home</span>
          <span style={styles.link}>Gallery</span>
          <span style={styles.link}>Pricing</span>
          <button
            style={styles.navButton}
            onClick={() => navigate("/auth")}
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          ...styles.hero,
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0px)" : "translateY(40px)",
        }}
      >
        <h1 style={styles.title}>
          Create <span style={styles.gradientText}>Stunning AI Art</span>  
          <br /> From Simple Words
        </h1>

        <p style={styles.subtitle}>
          Experience next-generation AI creativity. Generate cinematic,
          hyper-realistic visuals in seconds — powered by imagination.
        </p>

        <div style={styles.ctaContainer}>
          <button
            style={styles.primaryBtn}
            onClick={() => navigate("/auth")}
          >
            ✨ Start Creating
          </button>

          <button style={styles.secondaryBtn}>
            Explore Showcase
          </button>
        </div>
      </section>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "relative",
    minHeight: "100vh",
    overflow: "hidden",
    fontFamily: "Inter, sans-serif",
    background:
      "radial-gradient(circle at 20% 20%, #1e293b, #0f172a 40%, #020617 100%)",
    color: "#fff",
  },

  /* ================= NAVBAR ================= */
  navbar: {
    position: "fixed",
    top: 0,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 6%",
    backdropFilter: "blur(20px)",
    background: "rgba(255,255,255,0.05)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    zIndex: 10,
  },

  logo: {
    fontSize: "1.4rem",
    fontWeight: "700",
    letterSpacing: "1px",
  },

  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
  },

  link: {
    cursor: "pointer",
    fontSize: "0.95rem",
    color: "#cbd5e1",
    transition: "0.3s",
  },

  navButton: {
    padding: "0.6rem 1.5rem",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
    color: "#fff",
  },

  /* ================= HERO ================= */
  hero: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "0 2rem",
    transition: "all 1s ease",
  },

  title: {
    fontSize: "clamp(2.2rem, 5vw, 4.5rem)",
    fontWeight: "800",
    lineHeight: "1.2",
    marginBottom: "1.5rem",
  },

  gradientText: {
    background: "linear-gradient(90deg,#6366f1,#ec4899,#8b5cf6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    fontSize: "clamp(1rem, 2vw, 1.3rem)",
    maxWidth: "700px",
    color: "#cbd5e1",
    lineHeight: "1.7",
    marginBottom: "2.5rem",
  },

  ctaContainer: {
    display: "flex",
    gap: "1.2rem",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  primaryBtn: {
    padding: "1rem 2.5rem",
    borderRadius: "14px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1rem",
    background: "linear-gradient(90deg,#6366f1,#ec4899)",
    boxShadow: "0 10px 30px rgba(139,92,246,0.4)",
    color: "#fff",
    transition: "0.3s",
  },

  secondaryBtn: {
    padding: "1rem 2.5rem",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
  },

  /* ================= PARTICLES ================= */
 particles: {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  pointerEvents: "none",
  backgroundImage:
    "radial-gradient(2px 2px at 20% 30%, white, transparent)," +
    "radial-gradient(2px 2px at 70% 60%, white, transparent)," +
    "radial-gradient(1.5px 1.5px at 40% 80%, white, transparent)",
  backgroundRepeat: "repeat",
  backgroundSize: "600px 600px",
  animation: "moveParticles 80s linear infinite",
  opacity: 0.12,
  zIndex: 0,
},
};

export default Landing;
