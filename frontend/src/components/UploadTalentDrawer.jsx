// import React, { useState } from "react";
// import { MoreVertical, X } from "lucide-react";
// import SuccessModal from "./SuccessModal"; // Import the newly added modal
// import "./UploadTalentDrawer.css";

// function UploadTalentDrawer({ onBackToDashboard }) {
//     const [title, setTitle] = useState("");
//     const [summary, setSummary] = useState("");
//     const [category, setCategory] = useState("");
//     const [contentLink, setContentLink] = useState("");
    
//     // Modal visual toggle state
//     const [isSuccessOpen, setIsSuccessOpen] = useState(false);

//     const handlePublishSubmit = (e) => {
//         e.preventDefault();
//         console.log("Publishing entry content:", { title, summary, category, contentLink });
        
//         // 🌟 Trigger the success confirmation modal popup instantly
//         setIsSuccessOpen(true);
//     };

//     const handleShareAction = () => {
//         navigator.clipboard.writeText(contentLink || "https://naijacone.com/talent");
//         alert("Share link copied to clipboard!");
//     };

//     return (
//         <>
//             <div className="upload-talent-container-view">
//                 {/* Top Bar Action Header Controls */}
//                 <div className="upload-drawer-header">
//                     {/* HTML form attribute connects this button to the form id below */}
//                     <button type="submit" form="talentForm" className="publish-submit-btn">
//                         Publish
//                     </button>
//                     <div className="right-header-utility-group">
//                         <button type="button" className="header-icon-btn"><MoreVertical size={20} /></button>
//                         <button type="button" className="header-icon-btn" onClick={onBackToDashboard}><X size={20} /></button>
//                     </div>
//                 </div>

//                 {/* Scrollable Body Content Sheet Form */}
//                 <form id="talentForm" className="upload-drawer-scrollable-form" onSubmit={handlePublishSubmit}>
//                     <div className="upload-intro-headings">
//                         <h3>Talent Upload</h3>
//                         <p>
//                             A short, evocative title works best, your summary should clearly capture 
//                             the “big idea” of your talent and what makes it special. Avoid jargon. Use 
//                             simple language. Add the category to enhance visibility.
//                         </p>
//                     </div>

//                     <div className="form-input-stack">
//                         <label className="input-field-title-label">Title</label>
//                         <span className="input-hint-subtext">Keep it short and avoid special characters</span>
//                         <input 
//                             type="text"
//                             placeholder="Talent title..."
//                             value={title}
//                             onChange={(e) => setTitle(e.target.value)}
//                             required
//                         />
//                     </div>

//                     <div className="form-input-stack">
//                         <label className="input-field-title-label">Brief Summary</label>
//                         <span className="input-hint-subtext">Keep it short and avoid special characters</span>
//                         <input 
//                             type="text"
//                             placeholder="Talent summary..."
//                             value={summary}
//                             onChange={(e) => setSummary(e.target.value)}
//                             required
//                         />
//                     </div>

//                     <div className="form-input-stack">
//                         <label className="input-field-title-label">Catagory</label>
//                         <span className="input-hint-subtext">Select the category of your talent</span>
//                         <div className="select-dropdown-wrapper">
//                             <select 
//                                 value={category} 
//                                 onChange={(e) => setCategory(e.target.value)}
//                                 required
//                             >
//                                 <option value="" disabled hidden>Select...</option>
//                                 <option value="Music">Music</option>
//                                 <option value="Artwork">Artwork</option>
//                                 <option value="Comedy">Comedy</option>
//                                 <option value="Football">Football</option>
//                             </select>
//                         </div>
//                     </div>

//                     <div className="form-input-stack">
//                         <label className="input-field-title-label">Content</label>
//                         <span className="input-hint-subtext">Add the link to your video or image of your talent</span>
//                         <input 
//                             type="url"
//                             placeholder="Video or image link"
//                             value={contentLink}
//                             onChange={(e) => setContentLink(e.target.value)}
//                             required
//                         />
//                     </div>
//                 </form>
//             </div>

//             {/* Global Context Success Banner Portal mount point */}
//             <SuccessModal 
//                 isOpen={isSuccessOpen}
//                 onClose={() => {
//                     setIsSuccessOpen(false);
//                     onBackToDashboard(); // Return back to core metrics timeline drawer after closing down
//                 }}
//                 onViewTalent={() => console.log("Rerouting execution focus to the new item view panel...")}
//                 onShare={handleShareAction}
//             />
//         </>
//     );
// }

// export default UploadTalentDrawer;

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

    // 🎯 CATEGORY MAPPER: Forces the UI short names to match FastAPI's strict Enums
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

    // --- Share Utility Function Fix ---
    const handleShareAction = () => {
        if (selectedFile) {
            navigator.clipboard.writeText(selectedFile.name);
            alert(`File reference copied: ${selectedFile.name}`);
        } else {
            navigator.clipboard.writeText("https://naijacone.com/talent");
            alert("Share link copied to clipboard!");
        }
    };

    // --- Form Submission Submission Pipeline ---
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

        // 🎯 VALIDATION 1: Enforce minimum summary length to satisfy backend constraint
        if (summary.trim().length < 10) {
            setErrorMessage("Brief Summary must be at least 10 characters long.");
            setIsSubmitting(false);
            return;
        }

        // 🎯 VALIDATION 2: Ensure an actual file has been chosen
        if (!selectedFile) {
            setErrorMessage("Please drag or select an actual file to upload.");
            setIsSubmitting(false);
            return;
        }

        try {
            const formData = new FormData();
            
            // Apply category transform wrapper mapping
            formData.append("category", getBackendCategoryName(category));
            formData.append("title", title.trim());
            formData.append("description", summary.trim());
            formData.append("materials_used", "None");
            
            // 🎯 FIXED: Appends the actual binary object rather than a URL string link
            formData.append("file", selectedFile);

            const response = await fetch("http://127.0.0.1:8000/api/v1/talent/uploads", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                const detailMessage = typeof errorData.detail === 'object' 
                    ? JSON.stringify(errorData.detail) 
                    : errorData.detail;
                    
                throw new Error(detailMessage || `Server responded with status: ${response.status}`);
            }

            // Clean form state variables on success validation
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
                        <div className="error-message-banner">
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
                            required
                        />

                        <div 
                            className={`file-dropzone-container ${isDragging ? "dragging-active" : ""} ${selectedFile ? "has-file" : ""}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current.click()}
                        >
                            {!selectedFile ? (
                                <div className="dropzone-empty-state">
                                    <UploadCloud size={44} className="dropzone-cloud-icon" />
                                    <p className="dropzone-main-text"><span>Click to upload</span> or drag and drop</p>
                                    <p className="dropzone-sub-text">Videos, Images or Tracks up to 50MB</p>
                                </div>
                            ) : (
                                <div className="dropzone-file-state">
                                    {selectedFile.type.startsWith("video/") ? (
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