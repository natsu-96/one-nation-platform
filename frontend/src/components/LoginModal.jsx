import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5"; 
import { FcGoogle } from "react-icons/fc";
import login from "../assets/login.webp";
import "./LoginModal.css";

function LoginModal({ isOpen, onClose, onSwitchToSignup }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [keepSignedIn, setKeepSignedIn] = useState(false);
    
    // 🌟 FIXED: Declared the missing orchestration states required by your handler
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    if (!isOpen) return null;

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(""); 
        setIsLoading(true);   

        try {
            // 🌟 1. Ship a form-encoded payload straight to your live FastAPI OAuth2 login endpoint
            const response = await fetch("http://localhost:8000/api/v1/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    username: email, // FastAPI OAuth2PasswordRequestForm expects username string field
                    password: password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Authentication validation failed.");
            }

            // 🌟 2. Extract authentic bearer token parameters returning from your Python server
            const realToken = data.access_token || data.token;
            
            if (!realToken) {
                throw new Error("Login passed, but no access token was found in the payload response.");
            }

            // 🎯 USER INFO EXTRACTION (Blending your fallback helpers with real backend strings)
            const fallbackUsername = email.split("@")[0];
            const serverUsername = data.username || data.user?.username || fallbackUsername;
            const serverRole = data.role || data.user?.role || "user"; // Defaults to user role safety boundaries
            const generatedAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(serverUsername)}`;

            // 🌟 3. Persist authentic credentials safely inside browser storage layout arrays
            localStorage.setItem("token", realToken);
            localStorage.setItem("userRole", serverRole); // Crucial for your Admin Dashboard drawer access!
            localStorage.setItem("userEmail", email);
            localStorage.setItem("username", serverUsername);
            localStorage.setItem("userAvatar", data.avatar_url || generatedAvatar);

            // 🌟 4. Close form drawers and update dynamic parent context layout paths smoothly
            onClose();
            window.location.reload(); // Re-runs layout tree hooks to instantly register your session profile

        } catch (err) {
            console.error("Authentication catch block triggered:", err.message);
            setErrorMessage(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <div className="modal-logo-placeholder">
                    <img src={login} alt="" />
                </div>
                <h3 className="modal-title">Log in</h3>

                {/* 🌟 VISUAL ADDITION: Renders the backend error description cleanly inside the card layout if it exists */}
                {errorMessage && (
                    <div className="auth-error-banner" style={{ color: "#d32f2f", backgroundColor: "#ffebee", padding: "10px", borderRadius: "4px", marginBottom: "15px", fontSize: "14px", textAlign: "center" }}>
                        {errorMessage}
                    </div>
                )}

                <form className="modal-form" onSubmit={handleLoginSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="hello@123d.one (or admin@nigeriacelebrates.ng)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
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
                                disabled={isLoading}
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
                                disabled={isLoading}
                            />
                            <span className="checkbox-label">Keep me signed in</span>
                        </label>
                        <a href="#forgot" className="forgot-password-link">Forgot password?</a>
                    </div>

                    {/* 🌟 UX IMPROVEMENT: Disables button and changes text state dynamically during active requests */}
                    <button type="submit" className="primary-signin-btn" disabled={isLoading}>
                        <span className="btn-icon">➔</span> {isLoading ? "Verifying..." : "Sign In"}
                    </button>

                    <div className="divider">or</div>

                    <button
                        type="button"
                        className="google-signin-btn"
                        onClick={() => console.log("Google Login Triggered")}
                        disabled={isLoading}
                    >
                        <FcGoogle size={20} /> Sign in with Google
                    </button>

                    <div className="sign-link">
                        <span>
                            Don't have an account? {" "}
                            <span
                                style={{ cursor: "pointer", color: "#0C641B", textDecoration: "underline" }}
                                onClick={!isLoading ? onSwitchToSignup : null}
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