import React from 'react';
import { FaXTwitter, FaTiktok, FaInstagram } from 'react-icons/fa6'
import { ChartBarStacked, Timer, BetweenHorizontalStart, Vote } from 'lucide-react';
import rectangle from "../assets/rectangle.webp";
import './Leaderboard.css';

function Leaderboard({ 
  candidates = [], 
  totalEntries = 48, 
  categoriesCount = 11,
  votingEndsString = "03d 04h"
}) {
  
  const topFive = [...candidates]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 5);

  const totalVotes = candidates.reduce((sum, item) => sum + item.votes, 0);


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
                <Vote size={40}/>
              </div>
              <div className="stat-info">
                <span className="stat-value">{formatStatNumber(totalVotes)}</span>
                <span className="stat-label">TOTAL VOTES</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-box">
                <BetweenHorizontalStart size={40}/>
              </div>
              <div className="stat-info">
                <span className="stat-value">{totalEntries}</span>
                <span className="stat-label">ENTRIES</span>
              </div>  
            </div>
            <div className="stat-card">
              <div className="stat-box">
                <Timer size={40}/>
              </div>
              <div className="stat-info">
                <span className="stat-value highlight-gold">{votingEndsString}</span>
                <span className="stat-label">VOTING ENDS</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-box">
                <ChartBarStacked size={40}/>
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