import React from 'react';
import './Leaderboard.css';

function Leaderboard({ 
  // Accept active data from your parent state or database
  candidates = [], 
  totalEntries = 48, 
  categoriesCount = 11,
  votingEndsString = "03d 04h"
}) {
  
  // Active Data Calculation 1: Sort candidates by highest votes and take top 5
  const topFive = [...candidates]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 5);

  // Active Data Calculation 2: Sum up all votes dynamically
  const totalVotes = candidates.reduce((sum, item) => sum + item.votes, 0);

  // Helper function to format large numbers (e.g., 214500 -> "214.5K" or similar)
  const formatStatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num;
  };

  return (
    <aside className="sidebar-container">
      {/* 1. Header Tag */}
      <div className="live-badge-container">
        <span className="live-badge">LIVE LEADERBOARD</span>
      </div>

      {/* 2. Top Five Section */}
      <section className="leaderboard-section">
        <h2 className="section-title">TOP FIVE THIS WEEK</h2>
        <div className="leaderboard-list">
          {topFive.map((player, index) => (
            <div key={player.id || index} className="leaderboard-row">
              <span className="rank-number">{index + 1}</span>
              <div className="avatar-wrapper">
                {/* Custom circular star icon placeholder matching your UI */}
                <div className="avatar-star">★</div>
              </div>
              <span className="player-name">{player.name}</span>
              <span className="player-votes">{player.votes.toLocaleString()} votes</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Stats Grid Section */}
      <section className="stats-section">
        <h2 className="section-title">VOTING THIS WEEK</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{formatStatNumber(totalVotes)}</span>
            <span className="stat-label">TOTAL VOTES</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{totalEntries}</span>
            <span className="stat-label">ENTRIES</span>
          </div>
          <div className="stat-card">
            <span className="stat-value highlight-gold">{votingEndsString}</span>
            <span className="stat-label">VOTING ENDS</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{categoriesCount}</span>
            <span className="stat-label">CATEGORIES</span>
          </div>
        </div>
      </section>

      {/* 4. Share Box Section */}
      <section className="share-box">
        <h3 className="share-title">Share & Invite Friends</h3>
        <p className="share-subtitle">Share your favourite entry to get them to the top</p>
        <div className="share-buttons">
          <button className="share-btn">WhatsApp</button>
          <button className="share-btn">Instagram</button>
          <button className="share-btn">Twitter</button>
        </div>
      </section>
    </aside>
  );
}

export default Leaderboard;