import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Auth({ setIsAuthenticated }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

    try {
      const payload = isLogin
        ? { email, password }
        : { name, email, password };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        payload
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        setIsAuthenticated(true);
        navigate("/generate");
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.particles}></div>

      <div
        style={{
          ...styles.card,
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(40px)",
        }}
      >
        <h2 style={styles.title}>
          {isLogin ? "Welcome Back" : "Join Ali's AI"}
        </h2>

        <p style={styles.subtitle}>
          {isLogin
            ? "Sign in to access your AI workspace."
            : "Create your account and start generating images."}
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ali Khan"
                required
                style={styles.input}
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength="6"
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading
              ? "Processing..."
              : isLogin
              ? "✨ Sign In"
              : "🚀 Sign Up"}
          </button>
        </form>

        <p style={styles.toggleText}>
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <span
            style={styles.toggleLink}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up" : "Log in"}
          </span>
        </p>
      </div>
    </div>
  );
}

/* ================== STYLES ================== */

const styles = {
  wrapper: {
    height: "100vh",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    padding: "2rem",
    background:
      "radial-gradient(circle at 20% 20%, #1e293b, #0f172a 40%, #020617 100%)",
    fontFamily: "Inter, sans-serif",
    color: "#fff",
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

  card: {
    width: "100%",
    maxWidth: "430px",
    padding: "3rem 2.5rem",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
    transition: "all 0.8s ease",
    zIndex: 2,
  },

  title: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "0.5rem",
  },

  subtitle: {
    fontSize: "0.95rem",
    color: "#cbd5e1",
    marginBottom: "2rem",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.3rem",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },

  label: {
    fontSize: "0.85rem",
    marginBottom: "0.4rem",
    color: "#cbd5e1",
  },

  input: {
    padding: "0.9rem 1rem",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    outline: "none",
  },

  button: {
    padding: "1rem",
    borderRadius: "14px",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
    background: "linear-gradient(90deg,#6366f1,#ec4899)",
    color: "#fff",
    marginTop: "0.5rem",
    boxShadow: "0 10px 30px rgba(139,92,246,0.4)",
    transition: "0.3s",
  },

  toggleText: {
    marginTop: "1.5rem",
    fontSize: "0.9rem",
    color: "#cbd5e1",
    textAlign: "center",
  },

  toggleLink: {
    color: "#ec4899",
    cursor: "pointer",
    fontWeight: "600",
  },

  error: {
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.4)",
    padding: "0.8rem",
    borderRadius: "10px",
    fontSize: "0.85rem",
    marginBottom: "1rem",
    color: "#f87171",
  },
};

export default Auth;
