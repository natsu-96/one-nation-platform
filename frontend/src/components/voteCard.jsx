import React from 'react';
import './voteCard.css';
import girl from "../assets/girl.webp"
import avatar from "../assets/avatar.webp"

function VoteCard({ 
  title, 
  description, 
  votes, 
  rank, 
  image, 
  creator = { name: "Creator", avatar: avatar },
  votersCount = "1K",
  onClick // 📥 Receive the click handler prop from VotingGrid
}) {

  const displayImage = image || girl;
  
  return (
    /* 🎯 Attach the click handler here and give it a pointer style */
    <div className="vote-card" onClick={onClick} style={{ cursor: "pointer" }}>
      {/* Top Media Section */}
      <div className="card-top">
        <div className="rank-vote-badge">
          <div className="badge-section">
            <span className="badge-label">RANK</span>
            <span className="badge-value">#{rank}</span>
          </div>
          <div className="badge-divider"></div>
          <div className="badge-section">
            <span className="badge-label">VOTES</span>
            <span className="badge-value">{votes.toLocaleString()}</span>
          </div>
        </div>
        <div className="vote-card-img">
          <img src={displayImage} alt={title || "Submission" } />
        </div>
      </div>

      {/* Bottom Content Section */}
      <div className="card-bottom">
        <div className="card-info">
          <h3 className="candidate-name">{title}</h3>
          <p className="candidate-description">{description}</p>
        </div>

        {/* Creator and Social Proof Row */}
        <div className="creator-row">
          <div className="creator-profile">
            <img src={creator.avatar} alt={creator.name} className="creator-avatar" />
            <span className="creator-name">{creator.name}</span>
          </div>
          
          <div className="voters-stack-wrapper">
            <div className="voters-avatars">
              <div className="avatar-stack-item color-1"></div>
              <div className="avatar-stack-item color-2"></div>
              <div className="avatar-stack-count">+{votersCount}</div>
            </div>
            <span className="voters-label">Voters</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoteCard;