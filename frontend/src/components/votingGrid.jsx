import React, { useState } from 'react';
import VoteCard from './voteCard';
import './votingGrid.css';

const INITIAL_CANDIDATES = [
  { id: 1, name: "Anwar", category: "Music", votes: 14450, hasVoted: false },
  { id: 2, name: "Anwar", category: "Music", votes: 14450, hasVoted: false },
  { id: 3, name: "Anwar", category: "Music", votes: 14450, hasVoted: false },
  { id: 4, name: "Anwar", category: "Music", votes: 14450, hasVoted: false, isMostVoted: true },
  { id: 5, name: "Anwar", category: "Music", votes: 14450, hasVoted: false },
  { id: 6, name: "Anwar", category: "Music", votes: 14450, hasVoted: false },
];

function VotingGrid() {
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);

  const handleVote = (id) => {
    setCandidates(prevCandidates => 
      prevCandidates.map(candidate => {
        if (candidate.id === id) {
          return { 
            ...candidate, 
            votes: candidate.votes + 1, 
            hasVoted: true 
          };
        }
        return candidate;
      })
    );
  };

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
            onVote={() => handleVote(candidate.id)} 
          />
        ))}
      </div>
    </div>
  );
}

export default VotingGrid;