import React from "react";
import { createPortal } from "react-dom";
import "./SuccessModal.css";

function SuccessModal({ isOpen, onClose, onViewTalent, onShare }) {
  if (!isOpen) return null;

  const modalContent = (
    <div className="success-modal-overlay" onClick={onClose}>
      <div className="success-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Top Close Button */}
        <button className="success-close-btn" onClick={onClose}>
          &times;
        </button>

        {/* Top Media Placeholder Block */}
        <div className="success-media-placeholder"></div>

        {/* Heading Details */}
        <h3 className="success-title">Talent published successfully</h3>
        <p className="success-description">
          Your talent is out there shown to everyone to vote for you, share with your friends and fight for number 1!
        </p>

        {/* Action Controls */}
        <div className="success-actions-stack">
          <button 
            type="button" 
            className="success-primary-btn" 
            onClick={() => {
              if (onViewTalent) onViewTalent();
              onClose();
            }}
          >
            View New Talent
          </button>
          
          <button 
            type="button" 
            className="success-secondary-btn" 
            onClick={onShare}
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );

  // Render the modal directly into the HTML body so it handles screen center perfectly
  return createPortal(modalContent, document.body);
}

export default SuccessModal;