import React from 'react';
import { useNavigate } from 'react-router-dom'; // 🚀 Import useNavigate
import VoteCard from './voteCard';
import './votingGrid.css';

function VotingGrid({ candidates = [], onVote }) {
  const navigate = useNavigate(); // Initialize routing engine

  const handleCardClick = (candidate) => {
    // Navigate dynamically to the details route, shipping the specific object state along
    navigate(`/details/${candidate.id}`, { state: { card: candidate } });
  };

  return (
    <div className="voting-container">
      <div className="vote-grid">
        {candidates.map((candidate) => (
          <VoteCard 
            key={candidate.id}
            title={candidate.title} 
            description={candidate.description} 
            votes={candidate.votes}
            rank={candidate.rank}
            image={candidate.image}
            creator={candidate.creator} 
            votersCount={candidate.votersCountString}
            // 🎯 Pass a click function down that knows who this candidate is
            onClick={() => handleCardClick(candidate)}
          />
        ))}
      </div>
    </div>
  );
}

export default VotingGrid;