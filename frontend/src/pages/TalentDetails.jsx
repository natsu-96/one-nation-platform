
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";
import defaultAvatar from "../assets/avatar.webp"; 
import "./TalentDetails.css";

function TalentDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState("");
  const [activeTab, setActiveTab] = useState("Recent");
  
  const [isVoting, setIsVoting] = useState(false);
  const [voteMessage, setVoteMessage] = useState("");

  const candidateData = location.state?.card;

  const uploadId = candidateData?.id; 
  const title = candidateData?.title || "Naija Soul – Original Afrobeat";
  const description = candidateData?.description || "Music should be listened to and shared for everyone to enjoy";
  const rank = candidateData?.rank || "1";
  
  // 1. FIXED: Converted static votes into a reactive State hook
  const [voteCount, setVoteCount] = useState(candidateData?.votes || 12440);
  
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

  const handleVote = async () => {
    setIsVoting(true); 
    setVoteMessage("");

    try {
      const formData = new FormData();
      formData.append("upload_id", "550e8400-e29b-41d4-a716-446655440000");

      const response = await fetch("http://127.0.0.1:8000/api/v1/votes/cast", {
        method: "POST",
        body: formData, 
      });

      const data = await response.json();

      if (response.ok) {
        setVoteMessage(data.message || "Your vote has been cast!");
        
        // 1. Calculate the exact next number cleanly upfront
        const nextVoteCount = voteCount + 1;
        
        // 2. Save that exact target number to browser memory
        const storageKey = `vote_count_${uploadId || "550e8400-e29b-41d4-a716-446655440000"}`;
        localStorage.setItem(storageKey, nextVoteCount);
        
        // 3. Update the UI state exactly once
        setVoteCount(nextVoteCount);
      } else {
        console.error("Backend Error Details:", data);
        setVoteMessage("The server rejected the vote.");
      }

    } catch (error) {
      console.error("Network Error Details:", error);
      setVoteMessage("Network error. Make sure the backend is running.");
    } finally {
      setIsVoting(false);
    }
  };

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
              {/* 3. FIXED: Pointed UI here to render the stateful count variable */}
              <span className="stat-cell-value">{voteCount.toLocaleString()}</span>
            </div>
          </div>
          <div className="talent-primary-actions-stack">
            <button 
              type="button" 
              className="details-vote-action-btn"
              onClick={handleVote}
              disabled={isVoting}
              style={{ opacity: isVoting ? 0.7 : 1 }}
            >
              {isVoting ? "Voting..." : "Vote"}
            </button>
            <button type="button" className="details-share-action-btn">Share</button>
          </div>

          {voteMessage && (
            <p style={{ color: voteMessage.includes("Error") || voteMessage.includes("rejected") || voteMessage.includes("Network") ? "red" : "green", marginTop: "10px", fontSize: "14px", fontWeight: "bold" }}>
              {voteMessage}
            </p>
          )}

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