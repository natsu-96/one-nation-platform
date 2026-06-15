// 



import React, { useState, useRef } from "react";
import { MoreVertical, X, UploadCloud, FileVideo, FileImage } from "lucide-react";
import SuccessModal from "./SuccessModal"; 
import "./UploadTalentDrawer.css";

function UploadTalentDrawer({ onBackToDashboard }) {
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [category, setCategory] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    const fileInputRef = useRef(null);

    // 🌟 FIXED: Maps frontend keys cleanly to match FastAPI's target strict Categories enums
    const getBackendCategoryName = (frontendName) => {
    const mapping = {
        "Music": "Music / Songs",
        "Football": "Football Freestyle",
        "Comedy": "Comedy Skits",
        "Artwork": "Artwork (Handmade Only)",
        "Fashion": "Fashion Showcase",
        "Film": "My Nigeria Story (Short Film)",
        "Photo": "Photography",
        "Logo": "Logo Design"
    };
    
    // Return the matched backend string, or fall back to the raw name if not found
    return mapping[frontendName] || frontendName;
};
    // --- Drag and Drop Logic ---
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleShareAction = () => {
        if (selectedFile) {
            navigator.clipboard.writeText(selectedFile.name);
            alert(`File reference copied: ${selectedFile.name}`);
        } else {
            navigator.clipboard.writeText("https://naijacone.com/talent");
            alert("Share link copied to clipboard!");
        }
    };

    // --- Form Submission Pipeline ---
    const handlePublishSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage("");

        const token = localStorage.getItem("token");
        if (!token) {
            setErrorMessage("You must be logged in to upload content.");
            setIsSubmitting(false);
            return;
        }

        if (summary.trim().length < 10) {
            setErrorMessage("Brief Summary must be at least 10 characters long.");
            setIsSubmitting(false);
            return;
        }

        if (!selectedFile) {
            setErrorMessage("Please drag or select an actual file to upload.");
            setIsSubmitting(false);
            return;
        }

        try {
            const formData = new FormData();
            
            // Apply the fixed category string transformation
            formData.append("category", getBackendCategoryName(category));
            formData.append("title", title.trim());
            formData.append("description", summary.trim());
            formData.append("materials_used", "None");
            formData.append("file", selectedFile);

            const response = await fetch("http://127.0.0.1:8000/api/v1/talent/uploads", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData, // Browser automatically configures multipart form hashes here
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const detailMessage = errorData.detail 
                    ? (typeof errorData.detail === 'object' ? JSON.stringify(errorData.detail) : errorData.detail)
                    : `Upload failed with status code: ${response.status}`;
                    
                throw new Error(detailMessage);
            }

            // Clean layout forms on success validation
            setTitle("");
            setSummary("");
            setCategory("");
            setSelectedFile(null);
            setIsSuccessOpen(true);

        } catch (err) {
            console.error("Submission failed:", err);
            setErrorMessage(err.message || "An error occurred while routing data profiles.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="upload-talent-container-view">
                <div className="upload-drawer-header">
                    <button 
                        type="submit" 
                        form="talentForm" 
                        className="publish-submit-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Publishing..." : "Publish"}
                    </button>
                    <div className="right-header-utility-group">
                        <button type="button" className="header-icon-btn"><MoreVertical size={20} /></button>
                        <button type="button" className="header-icon-btn" onClick={onBackToDashboard}><X size={20} /></button>
                    </div>
                </div>

                <form id="talentForm" className="upload-drawer-scrollable-form" onSubmit={handlePublishSubmit}>
                    <div className="upload-intro-headings">
                        <h3>Talent Upload</h3>
                        <p>
                            Select your focus category, provide a summary (min. 10 chars), and upload your entry file.
                        </p>
                    </div>

                    {errorMessage && (
                        <div className="error-message-banner" style={{ color: "red", margin: "10px 0", padding: "10px", backgroundColor: "#ffebee", borderRadius: "4px" }}>
                            {errorMessage}
                        </div>
                    )}

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
                        <span className="input-hint-subtext">Describe your talent (Minimum 10 characters)</span>
                        <input 
                            type="text"
                            placeholder="Talent summary (min. 10 chars)..."
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-input-stack">
                        <label className="input-field-title-label">Category</label>
                        <span className="input-hint-subtext">Select your target leaderboard field</span>
                        <div className="select-dropdown-wrapper">
                            <select 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                <option value="" disabled hidden>Select...</option>
                                <option value="Music">Music / Songs</option>
                                <option value="Football">Football Freestyle</option>
                                <option value="Comedy">Comedy Skits</option>
                                <option value="Artwork">Artwork (Handmade Only)</option>
                                <option value="Fashion">Fashion Showcase</option>
                                <option value="Film">Short Film</option>
                                <option value="Photo">Photography</option>
                                <option value="Logo">Logo Design</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-input-stack">
                        <label className="input-field-title-label">Upload Submission Media</label>
                        <span className="input-hint-subtext">Drag or click to choose your submission file</span>
                        
                        <input 
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                            accept="video/*,audio/*,image/*"
                        />

                        <div 
                            className={`file-dropzone-container ${isDragging ? "dragging-active" : ""} ${selectedFile ? "has-file" : ""}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current.click()}
                            style={{ cursor: "pointer", border: "2px dashed #ccc", padding: "2px", textAlign: "center" }}
                        >
                            {!selectedFile ? (
                                <div className="dropzone-empty-state">
                                    <UploadCloud size={44} className="dropzone-cloud-icon" />
                                    <p className="dropzone-main-text"><span>Click to upload</span> or drag and drop</p>
                                    <p className="dropzone-sub-text">Videos, Images or Tracks up to 50MB</p>
                                </div>
                            ) : (
                                <div className="dropzone-file-state">
                                    {selectedFile.type && selectedFile.type.startsWith("video/") ? (
                                        <FileVideo size={40} className="file-type-icon" />
                                    ) : (
                                        <FileImage size={40} className="file-type-icon" />
                                    )}
                                    <div className="file-details-meta">
                                        <p className="file-name-text">{selectedFile.name}</p>
                                        <p className="file-size-text">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    </div>
                                    <button 
                                        type="button" 
                                        className="remove-file-badge"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedFile(null);
                                        }}
                                    >
                                        Change
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>

            <SuccessModal 
                isOpen={isSuccessOpen}
                onClose={() => {
                    setIsSuccessOpen(false);
                    onBackToDashboard(); 
                }}
                onViewTalent={() => console.log("Focus changed to details panel...")}
                onShare={handleShareAction}
            />
        </>
    );
}

export default UploadTalentDrawer;