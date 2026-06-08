import React from 'react';
import { FaXTwitter, FaTiktok, FaInstagram } from 'react-icons/fa6'
import rectangle from "../assets/rectangle.png";
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
    <div className="sidebar">
      <aside className="sidebar-top">
        {/* 1. Header Tag */}
        <div className="live-badge-container">
          <h2 className="section-title">Top This Week</h2>
          <span className="live-badge">● Live Leaderboard</span>
        </div>

        {/* 2. Top Five Section */}
        <section className="leaderboard-section">
          <div className="leaderboard-list">
            {topFive.map((player, index) => {
              const displayName = player.creator?.name || "Anon Artist";
              const creatorAvatar = player.creator?.avatar
              return (
              <div key={player.id || index} className="leaderboard-row">
                <span className="rank-number">{index + 1}</span>
                <div className="avatar-wrapper">
                    <img src={creatorAvatar} alt={displayName} className="avatar-image" />
                </div>
                <span className="player-name">{displayName}</span>
                <span className="player-votes">{player.votes.toLocaleString()} votes</span>
              </div>
            )})}
          </div>
          </section>
        </aside>

        {/* 3. Stats Grid Section */}
        <section className="stats-section">
          <div className="stats-title"><h2>Voting This Week</h2></div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-box">
                <img src={rectangle} alt="Votes Icon" className="stat-icon" />
              </div>
              <div className="stat-info">
                <span className="stat-value">{formatStatNumber(totalVotes)}</span>
                <span className="stat-label">TOTAL VOTES</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-box">
                <img src={rectangle} alt="Votes Icon" className="stat-icon" />
              </div>
              <div className="stat-info">
                <span className="stat-value">{totalEntries}</span>
                <span className="stat-label">ENTRIES</span>
              </div>  
            </div>
            <div className="stat-card">
              <div className="stat-box">
                <img src={rectangle} alt="Votes Icon" className="stat-icon" />
              </div>
              <div className="stat-info">
                <span className="stat-value highlight-gold">{votingEndsString}</span>
                <span className="stat-label">VOTING ENDS</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-box">
                <img src={rectangle} alt="Votes Icon" className="stat-icon" />
              </div>
              <div className="stat-info">
                <span className="stat-value">{categoriesCount}</span>
                <span className="stat-label">CATEGORIES</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Share Box Section */}
        <section className="share-box">
          <h3 className="share-title">Share & Invite Friends</h3>
          <div className="share-buttons">
            <button className="share-btn"><FaTiktok /></button>
            <button className="share-btn"><FaInstagram /></button>
            <button className="share-btn"><FaXTwitter /></button>
          </div>
        </section>
    </div>
  );
}

export default Leaderboard;