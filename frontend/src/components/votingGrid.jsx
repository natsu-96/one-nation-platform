import React from 'react';
import VoteCard from './voteCard';
import './votingGrid.css';

// 1. Accept candidates and onVote directly as props from the parent (Voting.jsx)
function VotingGrid({ candidates = [], onVote }) {
  return (
    <div className="voting-container">
      <div className="vote-grid">
        {candidates.map((candidate) => (
          <VoteCard 
            key={candidate.id}
            name={candidate.name}
            category={candidate.category}
            votes={candidate.votes}
            hasVoted={candidate.hasVoted}
            isMostVoted={candidate.isMostVoted}
            // 2. Use the onVote function passed down from the parent
            onVote={() => onVote(candidate.id)} 
          />
        ))}
      </div>
    </div>
  );
}

export default VotingGrid;