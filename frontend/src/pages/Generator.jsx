import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Generator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [viewImage, setViewImage] = useState(null);

  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

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
        if (err.response?.status === 401) handleLogout();
      }
    };

    fetchHistory();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
         `${import.meta.env.VITE_API_URL}/api/generate-image`,
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

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/images/${id}`,
        getAuthHeaders()
      );
      setHistory(history.filter((img) => img._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  const downloadImage = (imageUrl, promptText) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    const cleanName = promptText
      .replace(/[^a-zA-Z0-9]/g, "_")
      .toLowerCase()
      .slice(0, 20);
    link.download = `alis_ai_${cleanName}.jpg`;
    link.click();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.particles}></div>

      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>Ali's AI</div>

        <div style={styles.navRight}>
          <div style={styles.userBadge}>
            👤 {user ? user.name : "Artist"}
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <div style={styles.container}>
        <h1 style={styles.title}>AI Workspace</h1>

        {/* PROMPT BOX */}
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

        {/* GALLERY */}
        {history.length === 0 ? (
          <p style={styles.emptyText}>
            No images yet. Start creating something amazing.
          </p>
        ) : (
          <div style={styles.grid}>
            {history.map((item) => (
              <div
                key={item._id}
                style={styles.card}
                onClick={() => setViewImage(item)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.prompt}
                  style={styles.image}
                />

                <div style={styles.overlay}>
                  <p style={styles.promptText}>{item.prompt}</p>

                  <div style={styles.actions}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadImage(item.imageUrl, item.prompt);
                      }}
                      style={styles.iconBtn}
                    >
                      ⬇
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item._id);
                      }}
                      style={styles.iconBtn}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {viewImage && (
        <div
          style={styles.modalBackdrop}
          onClick={() => setViewImage(null)}
        >
          <div
            style={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={viewImage.imageUrl}
              alt={viewImage.prompt}
              style={{ width: "100%", borderRadius: "12px" }}
            />
            <p style={{ marginTop: "1rem", color: "#cbd5e1" }}>
              {viewImage.prompt}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  wrapper: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 20% 20%, #1e293b, #0f172a 40%, #020617 100%)",
    color: "#fff",
    fontFamily: "Inter, sans-serif",
    position: "relative",
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

  logo: { fontWeight: "700", fontSize: "1.2rem" },

  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },

  userBadge: {
    padding: "0.5rem 1rem",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.08)",
    fontSize: "0.9rem",
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
    paddingTop: "110px",
    paddingLeft: "6%",
    paddingRight: "6%",
    paddingBottom: "60px",
  },

  title: {
    fontSize: "clamp(2rem,4vw,3rem)",
    marginBottom: "1.5rem",
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
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
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

  error: { color: "#f87171", marginBottom: "1rem" },

  emptyText: {
    textAlign: "center",
    marginTop: "3rem",
    color: "#94a3b8",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
    gap: "1.5rem",
  },

  card: {
    position: "relative",
    borderRadius: "16px",
    overflow: "hidden",
    cursor: "pointer",
  },

  image: {
    width: "100%",
    height: "300px",
    objectFit: "cover",
    transition: "transform 0.4s ease",
  },

  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: "1rem",
    background:
      "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
  },

  promptText: {
    fontSize: "0.85rem",
    marginBottom: "0.5rem",
  },

  actions: {
    display: "flex",
    gap: "0.5rem",
  },

  iconBtn: {
    padding: "0.4rem 0.6rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },

  modalBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    zIndex: 20,
  },

  modalContent: {
    maxWidth: "900px",
    width: "100%",
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
      "radial-gradient(2px 2px at 70% 60%, white, transparent)",
    backgroundRepeat: "repeat",
    backgroundSize: "600px 600px",
    animation: "moveParticles 80s linear infinite",
    opacity: 0.1,
  },
};

export default Generator;
