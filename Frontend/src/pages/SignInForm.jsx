import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase-config";
import "./SignInForm.css";

const SignInForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4" style={{ maxWidth: "420px", width: "100%" }}>
        <h3 className="text-center mb-3 fw-bold text-dark">Welcome Back</h3>
        <p className="text-center text-muted mb-4">Sign in to continue</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="Enter your email"
              required
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="Enter your password"
              required
              onChange={handleChange}
            />
          </div>

          {error && <p className="text-danger small text-center mb-2">{error}</p>}

          <div className="d-grid mb-3">
            <button
              type="submit"
              className="btn text-white fw-semibold"
              disabled={loading}
              style={{ background: "linear-gradient(135deg, #ee0d0d, #b60505)" }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </div>

          <p className="text-center mb-0">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-danger fw-semibold text-decoration-none">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
