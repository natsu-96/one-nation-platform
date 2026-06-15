import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5"; 
import { FcGoogle } from "react-icons/fc";
import signup from "../assets/signup.webp"
import "./LoginModal.css"; 

function SignupModal({ isOpen, onClose, onSwitchToLogin }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSignupSubmit = (e) => {
    e.preventDefault();
    
    // Ensure passwords match before submitting
    if (password !== confirmPassword) {
        setError("Passwords do not match. Please try again.");
        return;
    }
    
    setError(""); // Clear any previous errors
    console.log("Mock signup submitted:", { name, email, password });
    
    // Create a fallback avatar URL using Dicebear since we're mocking it here
    const generatedAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || "default")}`;

    // Mock account creation flow
    localStorage.setItem("token", "mock-session-token-xyz");
    localStorage.setItem("userRole", "user");
    localStorage.setItem("userEmail", email);
    
    // 🎯 FIX: Explicitly pass the local state variables and generated avatar 
    // instead of referencing an undefined 'data' object
    localStorage.setItem("userAvatar", generatedAvatar);
    localStorage.setItem("username", name || "Kim");

    onClose();
    window.location.reload(); 
};

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <div className="modal-logo-placeholder">
                    <img src={signup} alt="" />
                </div>
                <h3 className="modal-title">Create an account</h3>

                <form className="modal-form" onSubmit={handleSignupSubmit}>
                    {/* Display validation errors if passwords don't match */}
                    {error && <div className="error-message" style={{ color: "red", fontSize: "14px", marginBottom: "15px", textAlign: "center" }}>{error}</div>}

                    <div className="input-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="hello@123d.one"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle-icon"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
                            </button>
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="password-input-wrapper">
                            <input
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            {/* The toggle button affects both password fields simultaneously for better UX */}
                        </div>
                    </div>

                    <button type="submit" className="primary-signin-btn">
                        <span className="btn-icon">➔</span> Sign Up
                    </button>

                    <div className="divider">or</div>

                    <button
                        type="button"
                        className="google-signin-btn"
                        onClick={() => console.log("Google Signup Triggered")}
                    >
                        <FcGoogle size={20} /> Sign up with Google
                    </button>

                    <div className="sign-link">
                        <span>
                            Already have an account? {" "}
                            <span
                                style={{ cursor: "pointer", color: "#0C641B", textDecoration: "underline" }}
                                onClick={onSwitchToLogin}
                            >
                                Log in
                            </span>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignupModal;