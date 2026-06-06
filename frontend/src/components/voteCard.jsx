import React from 'react';
import './voteCard.css';

function VoteCard({ name, category, votes, isMostVoted, hasVoted, onVote }) {
  return (
    <div className="vote-card">
      {/* Top section: Placeholder for image/banner */}
      <div className="card-top">
        {isMostVoted && <span className="badge">Most Voted</span>}
      </div>

      {/* Bottom section: Information & Action Area */}
      <div className="card-bottom">
        <div className="card-info">
          <h3 className="candidate-name">{name}</h3>
          <p className="candidate-category">{category}</p>
          {/* .toLocaleString() formats the number with commas (e.g., 14,450) */}
          <p className="vote-count">{votes.toLocaleString()} votes</p>
        </div>

        {/* Dynamic Button based on voting state */}
        <button 
          className={`vote-btn ${hasVoted ? 'voted' : ''}`} 
          onClick={onVote}
          disabled={hasVoted}
        >
          {hasVoted ? 'Voted!' : 'Vote!'}
        </button>
      </div>
    </div>
  );
}

export default VoteCard;