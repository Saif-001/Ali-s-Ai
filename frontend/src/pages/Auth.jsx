import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Auth({ setIsAuthenticated }) {
  const [isLogin, setIsLogin] = useState(true);
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
      const response = await axios.post(
        `http://localhost:5000${endpoint}`,
        { email, password }
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
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
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <p style={styles.subtitle}>
          {isLogin
            ? "Sign in to continue creating AI visuals."
            : "Join Ali's AI and start generating for free."}
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
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

/* ================= STYLES ================= */

const styles = {
  wrapper: {
    minHeight: "100vh",
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

  card: {
    width: "100%",
    maxWidth: "420px",
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
    transition: "0.3s",
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

  particles: {
    position: "absolute",
    width: "200%",
    // height: "200%",
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

export default Auth;
