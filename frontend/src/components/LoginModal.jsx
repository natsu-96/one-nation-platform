import React, { useState } from "react";
import { Link } from 'react-router-dom'
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5"; 
import { FcGoogle } from "react-icons/fc";
import login from "../assets/login.webp"
import "./LoginModal.css";

function LoginModal({ isOpen, onClose, onSwitchToSignup }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [keepSignedIn, setKeepSignedIn] = useState(false);

    if (!isOpen) return null;

    const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Mock login submitted:", { email, password, keepSignedIn });
    
    // Checks if input email explicitly uses the admin domain or prefix from mock-ups
    const isUserAdmin = email.toLowerCase().includes("admin");
    
    // 🎯 FIX: Extract a usable username out of the email string (e.g., "john" from "john@email.com")
    const fallbackUsername = email.split("@")[0];
    const generatedAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fallbackUsername)}`;
    
    localStorage.setItem("token", "mock-session-token-xyz");
    localStorage.setItem("userRole", isUserAdmin ? "admin" : "user");
    localStorage.setItem("userEmail", email);
    
    // 🎯 FIX: Remove the undefined 'data' references and use our local fallback variables
    localStorage.setItem("userAvatar", generatedAvatar);
    localStorage.setItem("username", fallbackUsername || "Kim");

    onClose();
    window.location.reload(); // Quick state refresh to push token updates through layout trees
};

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <div className="modal-logo-placeholder">
                    <img src={login} alt="" />
                </div>
                <h3 className="modal-title">Log in</h3>

                <form className="modal-form" onSubmit={handleLoginSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="hello@123d.one (or admin@nigeriacelebrates.ng)"
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

                    <div className="form-options-row">
                        <label className="checkbox-container">
                            <input
                                type="checkbox"
                                checked={keepSignedIn}
                                onChange={(e) => setKeepSignedIn(e.target.checked)}
                            />
                            <span className="checkbox-label">Keep me signed in</span>
                        </label>
                        <a href="#forgot" className="forgot-password-link">Forgot password?</a>
                    </div>

                    <button type="submit" className="primary-signin-btn">
                        <span className="btn-icon">➔</span> Sign In
                    </button>

                    <div className="divider">or</div>

                    <button
                        type="button"
                        className="google-signin-btn"
                        onClick={() => console.log("Google Login Triggered")}
                    >
                        <FcGoogle size={20} /> Sign in with Google
                    </button>

                    <div className="sign-link">
                        <span>
                            Don't have an account? {" "}
                            <span
                                style={{ cursor: "pointer", color: "#0C641B", textDecoration: "underline" }}
                                onClick={onSwitchToSignup}
                            >
                                Sign up
                            </span>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginModal;