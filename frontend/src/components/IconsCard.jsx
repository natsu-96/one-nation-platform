import React from 'react';
import './IconsCard.css';
import iconPic from "../assets/icon.webp"

function IconsCard({ 
  name, 
  niche, 
  bio, 
  votes, 
  img,
  position, 
  votersCount = "1K",
  onClick
}) {

  const iconImage = img || iconPic;

  return (
    <>
        <div className="icon-card" onClick={onClick} style={{ cursor: "pointer" }}>
              {/* Top Media Section */}
              <div className="icon-top">
                <div className="position-vote-badge">
                  <div className="badge-section">
                    <span className="badge-label">RANK</span>
                    <span className="badge-value">#{position}</span>
                  </div>
                  <div className="badge-divider"></div>
                  <div className="badge-section">
                    <span className="badge-label">VOTES</span>
                    <span className="badge-value">{votes.toLocaleString()}</span>
                  </div>
                </div>
                <div className="icon-card-img">
                  <img src={iconPic} alt={name || "Submission" } />
                </div>
              </div>
        
              {/* Bottom Content Section */}
              <div className="card-bottom">
                <div className="card-info">
                  <h3 className="icon-name">{name}</h3>
                  <p className="icon-bio">{bio}</p>
                </div>
        
                {/* Creator and Social Proof Row */}
                <div className="nominate-icon">
                    <button>Nominate</button>
                </div>
              </div>
            </div>
    </>
  )
}

export default IconsCard