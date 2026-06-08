import React from "react";
import { Link, MoreVertical, X, Link2, Plus, LogOut } from "lucide-react";
import defaultAvatar from "../assets/avatar.png"; // Your custom memoji/avatar source location
import "./DashboardDrawer.css";

function DashboardDrawer({ isOpen, onClose, onLogout }) {
    const handleCopyLink = () => {
        navigator.clipboard.writeText("https://naijacone.com/profile/kim");
        alert("Profile link copied!");
    };

    return (
        <>
            {/* Clickable dark blur backdrop overlay behind the drawer */}
            <div 
                className={`dashboard-backdrop ${isOpen ? "visible" : ""}`} 
                onClick={onClose}
            />

            {/* The Actual Slide-out Panel container */}
            <div className={`dashboard-side-drawer ${isOpen ? "open" : ""}`}>
                
                {/* 1. Top Window Actions Header Control Panel Row */}
                <div className="drawer-top-actions">
                    <button className="icon-action-btn"><MoreVertical size={20} /></button>
                    <button className="icon-action-btn close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <div className="dashboard-scrollable-content">
                    {/* 2. User Identity Layout Block */}
                    <div className="profile-identity-section">
                        <img src={defaultAvatar} alt="Kim Avatar" className="dashboard-avatar" />
                        <div className="identity-details">
                            <h3 className="profile-display-name">Kim</h3>
                            <p className="profile-handle-email">kimdawap@gmail.com</p>
                            
                            <button className="copy-link-btn" onClick={handleCopyLink}>
                                <Link2 size={16} />
                                <span>Copy Profile Link</span>
                            </button>
                        </div>
                    </div>

                    {/* 3. User Custom Tagline */}
                    <p className="profile-bio-tagline">Your friendly neighbourhood musician</p>

                    {/* 4. Numerical Metrics Layout Cards Panels */}
                    <div className="metrics-stack-group">
                        <div className="metric-card-block">
                            <div className="metric-icon-square"></div>
                            <div className="metric-info">
                                <span className="metric-value-text">820</span>
                                <span className="metric-label-text">Voting power</span>
                            </div>
                        </div>

                        <div className="metric-card-block">
                            <div className="metric-icon-square"></div>
                            <div className="metric-info">
                                <span className="metric-value-text">1</span>
                                <span className="metric-label-text">Uploads</span>
                            </div>
                        </div>
                    </div>

                    <hr className="section-divider-line" />

                    {/* 5. Custom Upload Action Button Link Selector Container */}
                    <button className="dashed-upload-talent-btn" onClick={() => console.log("Upload route triggered")}>
                        <div className="plus-icon-box">
                            <Plus size={20} />
                        </div>
                        <span className="upload-btn-label">Upload talent</span>
                    </button>

                    {/* 6. Active Dynamic Upload Submissions Track Cards Stack Component */}
                    <div className="user-talent-uploads-list">
                        <div className="uploaded-talent-card">
                            <div className="talent-thumbnail-placeholder"></div>
                            <div className="talent-card-details">
                                <h4 className="talent-title-text">Naija Soul – Orginal Afrobeat</h4>
                                <span className="talent-votes-count-badge">6,743 Votes</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 7. Bottom Footnote Panel Navigation Logout Handle Trigger */}
                <div className="drawer-footer-anchor">
                    <button className="bottom-logout-trigger-btn" onClick={onLogout}>
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
}

export default DashboardDrawer;