// import React from 'react';
// import { useNavigate } from 'react-router-dom'; // 🚀 Import useNavigate
// import VoteCard from './voteCard';
// import './votingGrid.css';

// function VotingGrid({ candidates = [], onVote }) {
//   const navigate = useNavigate(); // Initialize routing engine

//   const handleCardClick = (candidate) => {
//     // Navigate dynamically to the details route, shipping the specific object state along
//     navigate(`/details/${candidate.id}`, { state: { card: candidate } });
//   };

//   return (
//     <div className="voting-container">
//       <div className="vote-grid">
//         {candidates.map((candidate) => (
//           <VoteCard 
//             key={candidate.id}
//             title={candidate.title} 
//             description={candidate.description} 
//             votes={candidate.votes}
//             rank={candidate.rank}
//             image={candidate.image}
//             creator={candidate.creator} 
//             votersCount={candidate.votersCountString}
//             // 🎯 Pass a click function down that knows who this candidate is
//             onClick={() => handleCardClick(candidate)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default VotingGrid;

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import VoteCard from './voteCard';
import './votingGrid.css';

// 🎯 Accept category as a prop so it dynamically switches data pools
function VotingGrid({ category = "Music / Songs", refreshTrigger }) {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Wrapped in useCallback to prevent unnecessary re-renders
  const fetchCandidates = useCallback(async () => {
    setIsLoading(true);
    try {
      // 🎯 FIX: URL encode the category name to preserve spaces and slashes securely
      const encodedCategory = encodeURIComponent(category);
      const response = await fetch(`http://127.0.0.1:8000/api/v1/leaderboard/talent/${encodedCategory}?limit=20`);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      let rawList = [];
      if (Array.isArray(data)) {
        rawList = data;
      } else if (data && Array.isArray(data.talents)) {
        rawList = data.talents;
      } else if (data && Array.isArray(data.items)) {
        rawList = data.items;
      } else if (data && Array.isArray(data.results)) {
        rawList = data.results;
      } else {
        throw new Error("Backend response structure did not contain a valid array.");
      }

      const formattedData = rawList.map((item) => {
        const itemId = item.id || item.upload_id || "fallback-id";
        const locallySavedVotes = localStorage.getItem(`vote_count_${itemId}`);
        const resolvedName = item.user?.username || item.username || "Anonymous Artist";

        return {
          id: itemId, 
          title: item.title || "Untitled Talent",
          description: item.description || "No description provided.",
          votes: locallySavedVotes ? parseInt(locallySavedVotes, 10) : (item.vote_count || item.votes || 0),
          image: item.file_url || item.image_url || null, 
          creator: {
            name: resolvedName,
            avatar: item.user?.avatar || item.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(resolvedName)}`
          },
          votersCountString: "1K" 
        };
      });

      formattedData.sort((a, b) => b.votes - a.votes);
      formattedData.forEach((item, index) => {
        item.rank = index + 1;
      });

      setCandidates(formattedData);
    } catch (err) {
      console.error("Database fetch failed, activating clean UI fallback:", err);
      
      // Pulling locally saved values for fallback items so clicking "Vote" works here too
      const fallbackVote1 = localStorage.getItem("vote_count_550e8400-e29b-41d4-a716-446655440000");
      const fallbackVote2 = localStorage.getItem("vote_count_mock-candidate-2");
      const fallbackVote3 = localStorage.getItem("vote_count_mock-candidate-3");

      const fallbackData = [
        {
          id: "550e8400-e29b-41d4-a716-446655440000", 
          title: "Naija Soul – Original Afrobeat",
          description: "Music should be listened to and shared for everyone to enjoy",
          votes: fallbackVote1 ? parseInt(fallbackVote1, 10) : 12440,
          image: null,
          creator: { name: "Kim", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Kim" },
          votersCountString: "1.2K"
        },
        {
          id: "mock-candidate-2",
          title: "Afro-Fusion Dance Routine",
          description: "A high-energy performance combining traditional and modern steps.",
          votes: fallbackVote2 ? parseInt(fallbackVote2, 10) : 8920,
          image: null,
          creator: { name: "Daniel", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Daniel" },
          votersCountString: "840"
        },
        {
          id: "mock-candidate-3",
          title: "Digital Art: Neon Lagos",
          description: "A futuristic cyberpunk reimagining of Lagos traffic and lights.",
          votes: fallbackVote3 ? parseInt(fallbackVote3, 10) : 4110,
          image: null,
          creator: { name: "Fisayo", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Fisayo" },
          votersCountString: "310"
        }
      ];

      fallbackData.sort((a, b) => b.votes - a.votes);
      fallbackData.forEach((item, index) => {
        item.rank = index + 1;
      });

      setCandidates(fallbackData);
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  // Trigger loading process when category changes or a fresh upload finishes
  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates, refreshTrigger]);

  const handleCardClick = (candidate) => {
    navigate(`/details/${candidate.id}`, { state: { card: candidate } });
  };

  if (isLoading) return <div className="voting-container"><p>Loading live talents...</p></div>;
  if (error) return <div className="voting-container"><p className="error-text">{error}</p></div>;

  return (
    <div className="voting-container">
      <div className="vote-grid">
        {candidates.length === 0 ? (
          <p>No talents uploaded yet. Be the first!</p>
        ) : (
          candidates.map((candidate) => (
            <VoteCard 
              key={candidate.id}
              title={candidate.title} 
              description={candidate.description} 
              votes={candidate.votes}
              rank={candidate.rank}
              image={candidate.image}
              creator={candidate.creator} 
              votersCount={candidate.votersCountString}
              onClick={() => handleCardClick(candidate)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default VotingGrid;