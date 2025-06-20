import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();

  const savedEmail = localStorage.getItem("savedEmail") || "";
  const savedPassword = localStorage.getItem("savedPassword") || "";

  const [formData, setFormData] = useState({
    email: savedEmail,
    password: savedPassword,
  });

  const [rememberMe, setRememberMe] = useState(savedEmail !== "");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (message) {
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (lockoutTime > 0) {
      const interval = setInterval(() => {
        setLockoutTime((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutTime]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:3001/login");
      if (!response.ok) throw new Error("Failed to fetch user data");

      const users = await response.json();

      const user = users.find(
        (user) =>
          user.email === formData.email && user.password === formData.password
      );

      if (user) {
        if (rememberMe) {
          localStorage.setItem("savedEmail", formData.email);
          localStorage.setItem("savedPassword", formData.password);
        } else {
          localStorage.removeItem("savedEmail");
          localStorage.removeItem("savedPassword");
        }

        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          })
        );

        setMessage("Login successful");
        setMessageType("success");
        setAttempts(0);

        setTimeout(() => {
          setLoading(false);
          switch (user.role.toLowerCase()) {
            case "physio":
              navigate("/profile");
              break;
            case "dietitian":
              navigate("/diet/diet_profile");
              break;
            case "doctor":
              navigate("/doctor/doctor_profile");
              break;
            case "masteradmin":
              navigate("/masteradmin");
              break;
            case "counselor":
              navigate("/counselor");
              break;
            default:
              navigate("/unauthorized");
              break;
          }
        }, 1500);
      } else {
        setAttempts((prev) => prev + 1);
        setLoading(false);
        if (attempts + 1 >= 3) {
          setLockoutTime(30);
          setMessage(
            "Too many failed attempts. Please try again in 30 seconds."
          );
        } else {
          setMessage("Invalid credentials. Please try again.");
        }
        setMessageType("error");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      setMessage("Error connecting to server. Please try again later.");
      setMessageType("error");
    }
  };

  return (
    <div className="login-container">
      {showMessage && (
        <div className={`toast-message ${messageType}`}>
          <i
            className={`fa ${
              messageType === "error" ? "fa-times-circle" : "fa-check-circle"
            }`}
            style={{ marginRight: "8px" }}
          ></i>
          {message}
        </div>
      )}

      <div className="login-card">
        <h2 className="login-title">Login</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group floating-label-content">
            <input
              type="email"
              id="email"
              className="form-control floating-input"
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="email" className="floating-label">
              Email
            </label>
          </div>

          <div className="form-group floating-label-content">
            <input
              type="password"
              id="password"
              className="form-control floating-input"
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="password" className="floating-label">
              Password
            </label>
          </div>

          <div className="form-group d-flex justify-content-between align-items-center">
            <Link to="/forgotpassword">Forgot password?</Link>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading || lockoutTime > 0}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Signing in...
              </>
            ) : lockoutTime > 0 ? (
              `Try again in ${lockoutTime}s`
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
