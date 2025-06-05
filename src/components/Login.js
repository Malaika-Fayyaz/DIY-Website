import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      // Store token in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Navigate to dashboard (for now we'll just show an alert)
      alert("Login successful! Welcome to DIY Community!");
      console.log("Login successful:", response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div className="loading-text">
            Signing you in<span className="loading-dots">...</span>
          </div>
        </div>
      )}

      <div className="auth-container">
        <div className={`auth-card ${loading ? "loading-pulse" : ""}`}>
          <div className="auth-header">
            <div className="diy-icon">🔨</div>
            <h1 className="auth-title">Welcome Back!</h1>
            <p className="auth-subtitle">
              Sign in to your DIY Community account
            </p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            <button type="submit" disabled={loading} className="auth-button">
              {loading ? (
                <>
                  <span className="loading"></span>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="auth-link">
            Don't have an account? <Link to="/register">Create one here</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
