import React, { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5"; // Run: npm install react-icons
import { FcGoogle } from "react-icons/fc";
import "./LoginModal.css";

function LoginModal({ isOpen, onClose }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [keepSignedIn, setKeepSignedIn] = useState(false);

    if (!isOpen) return null;

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        console.log("Mock login submitted:", { email, password, keepSignedIn });
        localStorage.setItem("token", "mock-session-token-xyz");
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                {/* Close Button Button */}
                <button className="modal-close-btn" onClick={onClose}>
                    &times;
                </button>

                {/* Top Gray Placeholder Logo Image */}
                <div className="modal-logo-placeholder"></div>

                <h3 className="modal-title">Log in or sign up</h3>

                <form className="modal-form" onSubmit={handleLoginSubmit}>
                    {/* Email Input */}
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

                    {/* Password Input with Visibility Switch */}
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

                    {/* Form Metadata Controls row */}
                    <div className="form-options-row">
                        <label className="checkbox-container">
                            <input
                                type="checkbox"
                                checked={keepSignedIn}
                                onChange={(e) => setKeepSignedIn(e.target.checked)}
                            />
                            <span className="checkbox-label">Keep me signed in</span>
                        </label>
                        <a href="#forgot" className="forgot-password-link">
                            Forgot password?
                        </a>
                    </div>

                    {/* Primary Sign In Button */}
                    <button type="submit" className="primary-signin-btn">
                        <span className="btn-icon">➔</span> Sign In
                    </button>

                    {/* OAuth Divider */}
                    <div className="divider">or</div>

                    {/* Google Alternative Button */}
                    <button
                        type="button"
                        className="google-signin-btn"
                        onClick={() => console.log("Google Login Triggered")}
                    >
                        <FcGoogle size={20} /> Sign in with Google
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginModal;