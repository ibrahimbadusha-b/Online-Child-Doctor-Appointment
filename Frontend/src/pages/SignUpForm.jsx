import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../config/firebase-config";
import { doc, setDoc } from "firebase/firestore";
import "./SignUpForm.css";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(userCredential.user, {
        displayName: formData.fullName,
      });

      // Save user details in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        createdAt: new Date(),
      });

      navigate("/signin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4" style={{ maxWidth: "420px", width: "100%" }}>
        <h3 className="text-center mb-3 fw-bold text-dark">Create Account</h3>
        <p className="text-center text-muted mb-4">Join and book your child’s appointment easily</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              id="fullName"
              type="text"
              className="form-control"
              placeholder="Enter your full name"
              required
              onChange={handleChange}
            />
          </div>

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

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="Enter password"
              required
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className="form-control"
              placeholder="Confirm password"
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
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </div>

          <p className=" mb-0">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-danger fw-semibold text-decoration-none">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
