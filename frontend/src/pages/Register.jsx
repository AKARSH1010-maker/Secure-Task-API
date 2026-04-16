import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await API.post("/auth/register", formData);
      setMessage(res.data.message || "Registered successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>

      <form style={styles.card} onSubmit={handleSubmit}>
        <div style={styles.topSection}>
          <div style={styles.badge}>Secure Task API</div>
          <h2 style={styles.heading}>Create Account</h2>
          <p style={styles.subtext}>
            Register to start managing your tasks with a clean and secure dashboard.
          </p>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) => (e.target.style.transform = "translateY(-2px)")}
          onMouseOut={(e) => (e.target.style.transform = "translateY(0)")}
        >
          Register
        </button>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <p style={styles.footerText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
    background:
      "linear-gradient(135deg, #0f172a 0%, #111827 45%, #1e293b 100%)"
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at top left, rgba(34,197,94,0.18), transparent 25%), radial-gradient(circle at bottom right, rgba(59,130,246,0.12), transparent 30%)",
    pointerEvents: "none"
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    padding: "32px",
    borderRadius: "24px",
    background: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    position: "relative",
    zIndex: 1
  },
  topSection: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "6px"
  },
  badge: {
    alignSelf: "flex-start",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    background: "rgba(34,197,94,0.16)",
    color: "#86efac",
    border: "1px solid rgba(34,197,94,0.25)"
  },
  heading: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "700",
    color: "#f8fafc"
  },
  subtext: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: "14px",
    lineHeight: "1.6"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#e2e8f0"
  },
  input: {
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#f8fafc",
    fontSize: "15px",
    outline: "none"
  },
  button: {
    padding: "14px",
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 12px 24px rgba(34,197,94,0.22)"
  },
  success: {
    margin: 0,
    padding: "10px",
    borderRadius: "10px",
    background: "rgba(34,197,94,0.12)",
    color: "#86efac",
    border: "1px solid rgba(34,197,94,0.2)"
  },
  error: {
    margin: 0,
    padding: "10px",
    borderRadius: "10px",
    background: "rgba(239,68,68,0.12)",
    color: "#fca5a5",
    border: "1px solid rgba(239,68,68,0.2)"
  },
  footerText: {
    textAlign: "center",
    color: "#cbd5e1",
    fontSize: "14px"
  },
  link: {
    color: "#4ade80",
    fontWeight: "600",
    textDecoration: "none"
  }
};

export default Register;