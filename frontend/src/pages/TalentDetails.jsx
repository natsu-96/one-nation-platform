import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";
import defaultAvatar from "../assets/avatar.png"; 
import "./TalentDetails.css";

function TalentDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState("");
  const [activeTab, setActiveTab] = useState("Recent");

  const candidateData = location.state?.card;

  const title = candidateData?.title || "Naija Soul – Original Afrobeat";
  const description = candidateData?.description || "Music should be listened to and shared for everyone to enjoy";
  const rank = candidateData?.rank || "1";
  const votes = candidateData?.votes || 12440;
  const imageSource = candidateData?.image || defaultAvatar;
  const creatorName = candidateData?.creator?.name || "Kim";
  const creatorAvatar = candidateData?.creator?.avatar || defaultAvatar;

  const mockSupporters = [
    { id: 1, name: "Daniel", votes: "6,743 Votes", avatar: defaultAvatar },
    { id: 2, name: "Fisayo", votes: "2,743 Votes", avatar: defaultAvatar },
    { id: 3, name: "Tunde Art", votes: "2,204 Votes", avatar: defaultAvatar },
    { id: 4, name: "Ahmed", votes: "1,743 Votes", avatar: defaultAvatar },
    { id: 5, name: "Anjola", votes: "482 Votes", avatar: defaultAvatar }
  ];

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting comment:", commentText);
    setCommentText("");
  };

  return (
    <div className="talent-details-page-wrapper">
      <button className="back-navigation-anchor" onClick={() => navigate(-1)}>
        <ChevronLeft size={20} />
        <span>Back to Zone</span>
      </button>

      <div className="talent-details-container">
        
        <div className="details-left-column">
          <div className="media-preview-viewport">
            <img src={imageSource} alt={title} className="main-showcase-img" />
            
            <div className="media-slider-pagination">
              <span className="dot active"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>

            <div className="media-slider-controls">
              <button type="button" className="slider-arrow-btn"><ArrowLeft size={16} /></button>
              <button type="button" className="slider-arrow-btn"><ArrowRight size={16} /></button>
            </div>
          </div>

          <div className="comments-section-container">
            <h3>Comments</h3>
            <form onSubmit={handleCommentSubmit} className="comment-box-form">
              <textarea
                placeholder="Share your thoughts on this talent"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button 
                type="submit" 
                className="submit-comment-btn" 
                disabled={!commentText.trim()}
              >
                Comment
              </button>
            </form>
          </div>
        </div>

        <div className="details-right-column">
          
          <div className="creator-profile-header">
            <img src={creatorAvatar} alt={creatorName} className="creator-avatar" />
            <span className="creator-name-label">{creatorName}</span>
          </div>
          <div className="talent-title-header-block">
            <h2>{title}</h2>
            <p className="talent-description-text">{description}</p>
          </div>
          <div className="talent-numeric-stats-row">
            <div className="stat-metric-cell">
              <span className="stat-cell-title">RANK</span>
              <span className="stat-cell-value">#{rank}</span>
            </div>
            <div className="stat-metric-cell alignment-right">
              <span className="stat-cell-title">VOTES</span>
              <span className="stat-cell-value">{votes.toLocaleString()}</span>
            </div>
          </div>
          <div className="talent-primary-actions-stack">
            <button type="button" className="details-vote-action-btn">Vote</button>
            <button type="button" className="details-share-action-btn">Share</button>
          </div>
          <div className="supporters-leaderboard-card">
            <div className="leaderboard-header-row">
              <h3>Supporters</h3>
              <div className="tab-pill-toggle-group">
                <button 
                  type="button" 
                  className={`tab-toggle-btn ${activeTab === "Recent" ? "active" : ""}`} 
                  onClick={() => setActiveTab("Recent")}
                >
                  Recent
                </button>
                <button 
                  type="button" 
                  className={`tab-toggle-btn ${activeTab === "Top Voters" ? "active" : ""}`} 
                  onClick={() => setActiveTab("Top Voters")}
                >
                  Top Voters
                </button>
              </div>
            </div>
            <div className="leaderboard-rows-scrollstack">
              {mockSupporters.map((voter) => (
                <div key={voter.id} className="leaderboard-item-row">
                  <div className="voter-identity-box">
                    <img src={voter.avatar} alt={voter.name} className="voter-row-avatar" />
                    <span className="voter-row-name">{voter.name}</span>
                  </div>
                  <span className="voter-row-votes-badge">{voter.votes}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default TalentDetails;