import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Generator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/history",
          getAuthHeaders()
        );
        if (response.data.success) {
          setHistory(response.data.images);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/auth");
        }
      }
    };
    fetchHistory();
  }, [navigate]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/generate-image",
        { prompt },
        getAuthHeaders()
      );

      if (response.data.success) {
        setHistory([response.data.image, ...history]);
        setPrompt("");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate image.");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (imageUrl, promptText) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    const cleanName = promptText
      .replace(/[^a-zA-Z0-9]/g, "_")
      .toLowerCase()
      .slice(0, 15);
    link.download = `alis_ai_${cleanName}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.particles}></div>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>Ali's AI</div>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div style={styles.container}>
        <h1 style={styles.title}>AI Workspace</h1>
        <p style={styles.subtitle}>
          Generate cinematic AI visuals from your imagination.
        </p>

        {/* Prompt Box */}
        <form onSubmit={handleGenerate} style={styles.form}>
          <input
            type="text"
            placeholder="Describe the image you want to create..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            style={styles.input}
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            style={styles.generateBtn}
          >
            {loading ? "Generating..." : "✨ Generate"}
          </button>
        </form>

        {error && <div style={styles.error}>{error}</div>}

        {/* Gallery */}
        <h2 style={styles.galleryTitle}>Your Gallery</h2>

        <div style={styles.grid}>
          {history.map((item) => (
            <div key={item._id} style={styles.card}>
              <img
                src={item.imageUrl}
                alt={item.prompt}
                style={styles.image}
              />
              <p style={styles.promptText}>{item.prompt}</p>
              <button
                onClick={() =>
                  downloadImage(item.imageUrl, item.prompt)
                }
                style={styles.downloadBtn}
              >
                ⬇ Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  wrapper: {
    minHeight: "100vh",
    position: "relative",
    background:
      "radial-gradient(circle at 20% 20%, #1e293b, #0f172a 40%, #020617 100%)",
    color: "#fff",
    fontFamily: "Inter, sans-serif",
  },

  navbar: {
    position: "fixed",
    top: 0,
    width: "100%",
    padding: "1rem 6%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backdropFilter: "blur(20px)",
    background: "rgba(255,255,255,0.05)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    zIndex: 10,
  },

  logo: {
    fontWeight: "700",
    fontSize: "1.2rem",
  },

  logoutBtn: {
    padding: "0.6rem 1.4rem",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(90deg,#ef4444,#dc2626)",
    color: "#fff",
    cursor: "pointer",
  },

  container: {
    paddingTop: "120px",
    paddingLeft: "6%",
    paddingRight: "6%",
    paddingBottom: "60px",
  },

  title: {
    fontSize: "clamp(2rem,4vw,3rem)",
    fontWeight: "800",
    marginBottom: "0.5rem",
  },

  subtitle: {
    color: "#cbd5e1",
    marginBottom: "2rem",
  },

  form: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
    marginBottom: "2rem",
  },

  input: {
    flex: 1,
    minWidth: "250px",
    padding: "1rem",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    outline: "none",
  },

  generateBtn: {
    padding: "1rem 2rem",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(90deg,#6366f1,#ec4899)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },

  error: {
    color: "#f87171",
    marginBottom: "1rem",
  },

  galleryTitle: {
    marginTop: "2rem",
    marginBottom: "1rem",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
    gap: "1.5rem",
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(15px)",
    borderRadius: "16px",
    padding: "1rem",
    border: "1px solid rgba(255,255,255,0.08)",
    transition: "0.3s",
  },

  image: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "12px",
    marginBottom: "0.8rem",
  },

  promptText: {
    fontSize: "0.9rem",
    color: "#cbd5e1",
    marginBottom: "0.8rem",
  },

  downloadBtn: {
    width: "100%",
    padding: "0.7rem",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(90deg,#10b981,#059669)",
    color: "#fff",
    cursor: "pointer",
  },

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

export default Generator;
