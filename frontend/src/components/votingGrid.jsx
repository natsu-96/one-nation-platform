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
            title={candidate.title} // e.g., "Naija Soul - Original Afrobeats"
            description={candidate.description} 
            votes={candidate.votes}
            rank={candidate.rank}
            image={candidate.image}
            creator={candidate.creator} // object: { name, avatar }
            votersCount={candidate.votersCountString} // e.g., "1K" or "921"
          />
        ))}
      </div>
    </div>
  );
}

export default VotingGrid;