import React, { useState, useEffect } from "react";
import { 
    MoreVertical, X, Link2, Plus, LogOut, ArrowLeft,
    Users, Clock, Trophy, BarChart3, Vote, Upload,
    Video, ShieldCheck, Award, Check, ChevronRight, Music, Palette, Monitor
} from "lucide-react"; 
import UploadTalentDrawer from "./UploadTalentDrawer"; 
import defaultAvatar from "../assets/avatar.webp";
import "./DashboardDrawer.css";

function DashboardDrawer({ isOpen, onClose, onLogout }) {
    const [activeView, setActiveView] = useState("DASHBOARD");
    
    const userRole = localStorage.getItem("userRole") || "user";
    const currentEmail = localStorage.getItem("userEmail") || "kimdawap@gmail.com";

    // Reset view state back to root dashboard when drawer panel closes down completely
    useEffect(() => {
        if (!isOpen) {
            setActiveView("DASHBOARD");
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
        };
    }, [isOpen]);

    const handleCopyLink = () => {
        const link = userRole === "admin" ? "https://naijacone.com/admin/portal" : "https://naijacone.com/profile/kim";
        navigator.clipboard.writeText(link);
        alert("Link copied to clipboard!");
    };

    const handleLogoutWrapper = () => {
        localStorage.removeItem("userRole");
        localStorage.removeItem("userEmail");
        onLogout();
    };

    const SubViewHeader = ({ title }) => (
        <div className="subview-header-ribbon">
            <button className="subview-back-btn" onClick={() => setActiveView("DASHBOARD")}>
                <ArrowLeft size={18} />
                <span>Back</span>
            </button>
            <h4>{title}</h4>
        </div>
    );

    return (
        <>
            <div 
                className={`dashboard-backdrop ${isOpen ? "visible" : ""}`} 
                onClick={onClose}
            />

            <div className={`dashboard-side-drawer ${isOpen ? "open" : ""}`}>
                
                {/* 1. UPLOAD SUB-VIEW */}
                {activeView === "UPLOAD" && (
                    <UploadTalentDrawer onBackToDashboard={() => setActiveView("DASHBOARD")} />
                )}

                {/* 2. INLINE VIEW: REVIEW UPLOADS */}
                {activeView === "REVIEW" && (
                    <div className="subview-layout-wrapper">
                        <SubViewHeader title="Review Submissions" />
                        <div className="subview-scrollable-body">
                            <p className="subview-instruction-text">Review pending files and audio clips against safety and guidelines.</p>
                            <div className="inline-mock-empty-state">
                                <Video size={32} className="dim-icon" />
                                <p>Select an asset queue below to begin moderation passes.</p>
                                <button className="mini-action-outlined-btn" onClick={() => alert("Loading content stream...")}>Launch Player</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. INLINE VIEW: MANAGE QUIZ */}
                {activeView === "MANAGE_QUIZ" && (
                    <div className="subview-layout-wrapper">
                        <SubViewHeader title="Quiz Controller" />
                        <div className="subview-scrollable-body">
                            <div className="quick-form-group">
                                <label>Active Arena Session Title</label>
                                <input type="text" placeholder="e.g., Friday Night Afrobeat Showdown" className="inline-styled-input" />
                            </div>
                            <div className="quick-form-group">
                                <label>Countdown Clock (Seconds)</label>
                                <input type="number" defaultValue={15} className="inline-styled-input" />
                            </div>
                            <button className="inline-primary-action-submit-btn" onClick={() => { alert("Live Quiz Configuration Saved!"); setActiveView("DASHBOARD"); }}>
                                Deploy Quiz Arena Live
                            </button>
                        </div>
                    </div>
                )}

                {/* 4. INLINE VIEW: ALL PENDING APPROVALS */}
                {activeView === "PENDING_LIST" && (
                    <div className="subview-layout-wrapper">
                        <SubViewHeader title="All 14 Pending Uploads" />
                        <div className="subview-scrollable-body matches-pending-padding">
                            {/* Render an expanded checklist version right inside the drawer */}
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div className="approval-queue-row-card" key={item}>
                                    <div className="card-left-payload">
                                        <div className="item-type-avatar-thumb light-orange-bg"><Music size={16} /></div>
                                        <div className="item-meta-description">
                                            <h6>Talent Entry #{item}04</h6>
                                            <p>Audio Track • 2m 05s</p>
                                        </div>
                                    </div>
                                    <div className="card-right-action-triggers">
                                        <button className="circle-action-btn accept-trigger" onClick={() => alert(`Approved entry #${item}04`)}><Check size={16} /></button>
                                        <button className="circle-action-btn reject-trigger" onClick={() => alert(`Rejected entry #${item}04`)}><X size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 5. ROOT VIEW STATE (MAIN USER OR ADMIN PANELS) */}
                {activeView === "DASHBOARD" && (
                    <>
                        <div className="drawer-top-actions">
                            <button className="icon-action-btn"><MoreVertical size={20} /></button>
                            <button className="icon-action-btn close-btn" onClick={onClose}><X size={20} /></button>
                        </div>

                        <div className="dashboard-scrollable-content">
                            <div className="profile-identity-section">
                                <div className="avatar-shield-wrapper">
                                    <img 
                                        src={userRole === "admin" ? "https://img.icons8.com/color/96/shield.png" : defaultAvatar} 
                                        alt="Avatar Icon" 
                                        className="dashboard-avatar" 
                                    />
                                </div>
                                <div className="identity-details">
                                    <h3 className="profile-display-name">
                                        {userRole === "admin" ? "Admin" : "Kim"}
                                    </h3>
                                    <p className="profile-handle-email">{currentEmail}</p>
                                    {userRole === "admin" && <span className="super-admin-badge">⚡ Super Admin</span>}
                                    <button className="copy-link-btn" onClick={handleCopyLink}>
                                        <Link2 size={16} />
                                        <span>{userRole === "admin" ? "Copy admin link" : "Copy Profile Link"}</span>
                                    </button>
                                </div>
                            </div>

                            {userRole !== "admin" && (
                                <p className="profile-bio-tagline">Your friendly neighbourhood musician</p>
                            )}

                            {userRole === "admin" ? (
                                <>
                                    {/* Grid Analytics Dashboard Modules */}
                                    <div className="admin-metrics-grid">
                                        <div className="metric-box-card">
                                            <div className="metric-icon-round pink-bg"><Users size={18} /></div>
                                            <div className="metric-data-labels">
                                                <span className="admin-metric-value">4,821</span>
                                                <span className="admin-metric-tag">Total users</span>
                                            </div>
                                        </div>
                                        <div className="metric-box-card" style={{cursor: "pointer"}} onClick={() => setActiveView("PENDING_LIST")}>
                                            <div className="metric-icon-round orange-bg"><Clock size={18} /></div>
                                            <div className="metric-data-labels">
                                                <span className="admin-metric-value">14</span>
                                                <span className="admin-metric-tag">Pending uploads</span>
                                            </div>
                                        </div>
                                        <div className="metric-box-card" style={{cursor: "pointer"}} onClick={() => setActiveView("MANAGE_QUIZ")}>
                                            <div className="metric-icon-round green-bg"><Trophy size={18} /></div>
                                            <div className="metric-data-labels">
                                                <span className="admin-metric-value">3</span>
                                                <span className="admin-metric-tag">Active quizzes</span>
                                            </div>
                                        </div>
                                        <div className="metric-box-card">
                                            <div className="metric-icon-round blue-bg"><BarChart3 size={18} /></div>
                                            <div className="metric-data-labels">
                                                <span className="admin-metric-value">128K</span>
                                                <span className="admin-metric-tag">Total votes</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Management Action Buttons Group Layout */}
                                    <div className="admin-management-menu-wrapper">
                                        <span className="section-group-microheader">MANAGE</span>
                                        
                                        {/* 🌟 Hooked click handler to step into REVIEW inline card screen */}
                                        <button className="management-row-navigation-btn" onClick={() => setActiveView("REVIEW")}>
                                            <div className="row-btn-left-content">
                                                <Video size={18} className="menu-icon-gray" />
                                                <div className="text-stack-block">
                                                    <h5>Review uploads</h5>
                                                    <p>Approve or reject talent submissions</p>
                                                </div>
                                            </div>
                                            <ChevronRight size={16} />
                                        </button>

                                        {/* 🌟 Hooked click handler to step into MANAGE_QUIZ inline form screen */}
                                        <button className="management-row-navigation-btn" onClick={() => setActiveView("MANAGE_QUIZ")}>
                                            <div className="row-btn-left-content">
                                                <ShieldCheck size={18} className="menu-icon-gray" />
                                                <div className="text-stack-block">
                                                    <h5>Manage quiz</h5>
                                                    <p>Set up sessions & digital contestants</p>
                                                </div>
                                            </div>
                                            <ChevronRight size={16} />
                                        </button>

                                        <button className="management-row-navigation-btn" onClick={() => alert("Feature coming soon!")}>
                                            <div className="row-btn-left-content">
                                                <Award size={18} className="menu-icon-gray" />
                                                <div className="text-stack-block">
                                                    <h5>Manage nominees</h5>
                                                    <p>Review & feature Global Icons nominees</p>
                                                </div>
                                            </div>
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>

                                    {/* Quick Preview Stack List Track layout */}
                                    <div className="pending-approvals-section">
                                        <span className="section-group-microheader">PENDING APPROVALS</span>
                                        
                                        <div className="approval-queue-row-card">
                                            <div className="card-left-payload">
                                                <div className="item-type-avatar-thumb light-orange-bg"><Music size={16} /></div>
                                                <div className="item-meta-description">
                                                    <h6>Afro Fusion Mix – Tun...</h6>
                                                    <p>Music • 1m 22s • 2 hrs ago</p>
                                                </div>
                                            </div>
                                            <div className="card-right-action-triggers">
                                                <button className="circle-action-btn accept-trigger" onClick={() => alert("Item Approved")}><Check size={16} /></button>
                                                <button className="circle-action-btn reject-trigger" onClick={() => alert("Item Rejected")}><X size={16} /></button>
                                            </div>
                                        </div>

                                        {/* 🌟 Hooked click handler to expand into PENDING_LIST view layout wrapper */}
                                        <button className="view-all-pending-btn-trigger" onClick={() => setActiveView("PENDING_LIST")}>
                                            <span>View all 14 pending</span>
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                /* ORIGINAL STANDARD USER DASHBOARD PANELS */
                                <>
                                    <div className="metrics-stack-group">
                                        <div className="metric-card-block">
                                            <div className="metric-icon-square"><Vote size={38}/></div>
                                            <div className="metric-info">
                                                <span className="metric-value-text">820</span>
                                                <span className="metric-label-text">Voting power</span>
                                            </div>
                                        </div>
                                        <div className="metric-card-block">
                                            <div className="metric-icon-square"><Upload size={38}/></div>
                                            <div className="metric-info">
                                                <span className="metric-value-text">1</span>
                                                <span className="metric-label-text">Uploads</span>
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="section-divider-line" />
                                    <div className="upload-stack">
                                        <button className="dashed-upload-talent-btn" onClick={() => setActiveView("UPLOAD")}>
                                            <div className="plus-icon-box"><Plus size={20} /></div>
                                            <span className="upload-btn-label">Upload talent</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="drawer-footer-anchor">
                            <button className="bottom-logout-trigger-btn" onClick={handleLogoutWrapper}>
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default DashboardDrawer;