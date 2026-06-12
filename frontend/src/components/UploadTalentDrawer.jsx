import React, { useState } from "react";
import { MoreVertical, X } from "lucide-react";
import SuccessModal from "./SuccessModal"; // Import the newly added modal
import "./UploadTalentDrawer.css";

function UploadTalentDrawer({ onBackToDashboard }) {
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [category, setCategory] = useState("");
    const [contentLink, setContentLink] = useState("");
    
    // Modal visual toggle state
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    const handlePublishSubmit = (e) => {
        e.preventDefault();
        console.log("Publishing entry content:", { title, summary, category, contentLink });
        
        // 🌟 Trigger the success confirmation modal popup instantly
        setIsSuccessOpen(true);
    };

    const handleShareAction = () => {
        navigator.clipboard.writeText(contentLink || "https://naijacone.com/talent");
        alert("Share link copied to clipboard!");
    };

    return (
        <>
            <div className="upload-talent-container-view">
                {/* Top Bar Action Header Controls */}
                <div className="upload-drawer-header">
                    {/* HTML form attribute connects this button to the form id below */}
                    <button type="submit" form="talentForm" className="publish-submit-btn">
                        Publish
                    </button>
                    <div className="right-header-utility-group">
                        <button type="button" className="header-icon-btn"><MoreVertical size={20} /></button>
                        <button type="button" className="header-icon-btn" onClick={onBackToDashboard}><X size={20} /></button>
                    </div>
                </div>

                {/* Scrollable Body Content Sheet Form */}
                <form id="talentForm" className="upload-drawer-scrollable-form" onSubmit={handlePublishSubmit}>
                    <div className="upload-intro-headings">
                        <h3>Talent Upload</h3>
                        <p>
                            A short, evocative title works best, your summary should clearly capture 
                            the “big idea” of your talent and what makes it special. Avoid jargon. Use 
                            simple language. Add the category to enhance visibility.
                        </p>
                    </div>

                    <div className="form-input-stack">
                        <label className="input-field-title-label">Title</label>
                        <span className="input-hint-subtext">Keep it short and avoid special characters</span>
                        <input 
                            type="text"
                            placeholder="Talent title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-input-stack">
                        <label className="input-field-title-label">Brief Summary</label>
                        <span className="input-hint-subtext">Keep it short and avoid special characters</span>
                        <input 
                            type="text"
                            placeholder="Talent summary..."
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-input-stack">
                        <label className="input-field-title-label">Catagory</label>
                        <span className="input-hint-subtext">Select the category of your talent</span>
                        <div className="select-dropdown-wrapper">
                            <select 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                <option value="" disabled hidden>Select...</option>
                                <option value="Music">Music</option>
                                <option value="Artwork">Artwork</option>
                                <option value="Comedy">Comedy</option>
                                <option value="Football">Football</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-input-stack">
                        <label className="input-field-title-label">Content</label>
                        <span className="input-hint-subtext">Add the link to your video or image of your talent</span>
                        <input 
                            type="url"
                            placeholder="Video or image link"
                            value={contentLink}
                            onChange={(e) => setContentLink(e.target.value)}
                            required
                        />
                    </div>
                </form>
            </div>

            {/* Global Context Success Banner Portal mount point */}
            <SuccessModal 
                isOpen={isSuccessOpen}
                onClose={() => {
                    setIsSuccessOpen(false);
                    onBackToDashboard(); // Return back to core metrics timeline drawer after closing down
                }}
                onViewTalent={() => console.log("Rerouting execution focus to the new item view panel...")}
                onShare={handleShareAction}
            />
        </>
    );
}

export default UploadTalentDrawer;