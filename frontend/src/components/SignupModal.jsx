import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5"; 
import { FcGoogle } from "react-icons/fc";
import signup from "../assets/signup.webp";
import "./LoginModal.css"; 

function SignupModal({ isOpen, onClose, onSwitchToLogin }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
    // 🌟 FIXED: Added missing orchestration states to track live network flights
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setError(""); 

        // 🎯 VALIDATION 1: Client-side password alignment check
        if (password !== confirmPassword) {
            setError("Passwords do not match. Please try again.");
            return;
        }

        setIsLoading(true);

        try {
            // 🌟 1. Fire JSON payload straight to your FastAPI registration endpoint
            const response = await fetch("https://one-nation-platform.onrender.com/api/v1/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: name.trim(),  // Maps 'name' to the UserCreate schema's 'username' field
                    email: email.trim().toLowerCase(),
                    password: password,
                    referred_by: null       // Explicit fallback for optional referral codes
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // If backend throws a 400 (e.g. Email already exists), catch the message detail cleanly
                throw new Error(data.detail || "Account creation failed validation.");
            }

            // 🌟 2. Registration is successful! 
            // Instead of leaving the user in limbo, automatically route them to the login drawer layout view
            console.log("🎉 User account created cleanly in Supabase:", data);
            alert("Registration successful! Please log in with your credentials.");
            
            // Close signup context states and slide open the matching login viewport panel
            onClose();
            if (typeof onSwitchToLogin === "function") {
                onSwitchToLogin();
            }

        } catch (err) {
            console.error("Registration dispatch failure:", err.message);
            setError(err.message || "An unexpected network disruption occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose} disabled={isLoading}>&times;</button>
                <div className="modal-logo-placeholder">
                    <img src={signup} alt="" />
                </div>
                <h3 className="modal-title">Create an account</h3>

                <form className="modal-form" onSubmit={handleSignupSubmit}>
                    {/* Render visual validation errors directly within the modal frame */}
                    {error && (
                        <div className="error-message" style={{ color: "#d32f2f", backgroundColor: "#ffebee", padding: "10px", borderRadius: "4px", fontSize: "14px", marginBottom: "15px", textAlign: "center" }}>
                            {error}
                        </div>
                    )}

                    <div className="input-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isLoading}
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
                                disabled={isLoading}
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
                                disabled={isLoading}
                                required
                            />
                        </div>
                    </div>

                    {/* Disable submission buttons to prevent accidental duplicate row creation */}
                    <button type="submit" className="primary-signin-btn" disabled={isLoading}>
                        <span className="btn-icon">➔</span> {isLoading ? "Creating Account..." : "Sign Up"}
                    </button>

                    <div className="divider">or</div>

                    <button
                        type="button"
                        className="google-signin-btn"
                        onClick={() => console.log("Google Signup Triggered")}
                        disabled={isLoading}
                    >
                        <FcGoogle size={20} /> Sign up with Google
                    </button>

                    <div className="sign-link">
                        <span>
                            Already have an account? {" "}
                            <span
                                style={{ cursor: "pointer", color: "#0C641B", textDecoration: "underline" }}
                                onClick={!isLoading ? onSwitchToLogin : null}
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