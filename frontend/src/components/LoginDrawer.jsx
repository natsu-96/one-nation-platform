import React, { useState } from "react";
import "./LoginDrawer.css";

function LoginDrawer({ isOpen, onClose }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        console.log("Mock login submitted:", { email, password });
        // You can save a fake token here later to test your state changes!
        localStorage.setItem("token", "mock-session-token-xyz");
        onClose(); // Close drawer on success
    };

    return (
        <>
            {/* Dark blur backdrop overlay behind the drawer */}
            <div 
                className={`drawer-backdrop ${isOpen ? "backdrop-visible" : ""}`} 
                onClick={onClose}
            />

            {/* The Actual Slide-out Panel container */}
            <div className={`login-side-drawer ${isOpen ? "drawer-open" : ""}`}>
                <div className="drawer-header">
                    <h3>Sign In</h3>
                    <button className="close-drawer-btn" onClick={onClose}>&times;</button>
                </div>

                <form className="drawer-login-form" onSubmit={handleLoginSubmit}>
                    <p className="drawer-welcome-text">
                        Welcome back to the arena. Sign in to track your scores on the live leaderboard.
                    </p>

                    <div className="form-group-field">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group-field">
                        <label>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="drawer-form-actions">
                        <button type="submit" className="drawer-submit-btn">Sign In</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default LoginDrawer;