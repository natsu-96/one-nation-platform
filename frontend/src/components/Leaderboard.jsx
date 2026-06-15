// import React from 'react';
// import { FaXTwitter, FaTiktok, FaInstagram } from 'react-icons/fa6'
// import { ChartBarStacked, Timer, BetweenHorizontalStart, Vote } from 'lucide-react';
// import rectangle from "../assets/rectangle.webp";
// import './Leaderboard.css';

// function Leaderboard({ 
//   candidates = [], 
//   totalEntries = 48, 
//   categoriesCount = 11,
//   votingEndsString = "03d 04h"
// }) {
  
//   const topFive = [...candidates]
//     .sort((a, b) => b.votes - a.votes)
//     .slice(0, 5);

//   const totalVotes = candidates.reduce((sum, item) => sum + item.votes, 0);


//   const formatStatNumber = (num) => {
//     if (num >= 1000) {
//       return (num / 1000).toFixed(0) + 'K';
//     }
//     return num;
//   };

//   return (
//     <div className="sidebar">
//       <aside className="sidebar-top">
//         {/* 1. Header Tag */}
//         <div className="live-badge-container">
//           <h2 className="section-title">Top This Week</h2>
//           <span className="live-badge">● Live Leaderboard</span>
//         </div>

//         {/* 2. Top Five Section */}
//         <section className="leaderboard-section">
//           <div className="leaderboard-list">
//             {topFive.map((player, index) => {
//               const displayName = player.creator?.name || "Anon Artist";
//               const creatorAvatar = player.creator?.avatar
//               return (
//               <div key={player.id || index} className="leaderboard-row">
//                 <span className="rank-number">{index + 1}</span>
//                 <div className="avatar-wrapper">
//                     <img src={creatorAvatar} alt={displayName} className="avatar-image" />
//                 </div>
//                 <span className="player-name">{displayName}</span>
//                 <span className="player-votes">{player.votes.toLocaleString()} votes</span>
//               </div>
//             )})}
//           </div>
//           </section>
//         </aside>

//         {/* 3. Stats Grid Section */}
//         <section className="stats-section">
//           <div className="stats-title"><h2>Voting This Week</h2></div>
//           <div className="stats-grid">
//             <div className="stat-card">
//               <div className="stat-box">
//                 <Vote size={40}/>
//               </div>
//               <div className="stat-info">
//                 <span className="stat-value">{formatStatNumber(totalVotes)}</span>
//                 <span className="stat-label">TOTAL VOTES</span>
//               </div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-box">
//                 <BetweenHorizontalStart size={40}/>
//               </div>
//               <div className="stat-info">
//                 <span className="stat-value">{totalEntries}</span>
//                 <span className="stat-label">ENTRIES</span>
//               </div>  
//             </div>
//             <div className="stat-card">
//               <div className="stat-box">
//                 <Timer size={40}/>
//               </div>
//               <div className="stat-info">
//                 <span className="stat-value highlight-gold">{votingEndsString}</span>
//                 <span className="stat-label">VOTING ENDS</span>
//               </div>
//             </div>
//             <div className="stat-card">
//               <div className="stat-box">
//                 <ChartBarStacked size={40}/>
//               </div>
//               <div className="stat-info">
//                 <span className="stat-value">{categoriesCount}</span>
//                 <span className="stat-label">CATEGORIES</span>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* 4. Share Box Section */}
//         <section className="share-box">
//           <h3 className="share-title">Share & Invite Friends</h3>
//           <div className="share-buttons">
//             <button className="share-btn"><FaTiktok /></button>
//             <button className="share-btn"><FaInstagram /></button>
//             <button className="share-btn"><FaXTwitter /></button>
//           </div>
//         </section>
//     </div>
//   );
// }

// export default Leaderboard;

import React, { useState, useEffect } from 'react';
import { FaXTwitter, FaTiktok, FaInstagram } from 'react-icons/fa6';
import { ChartBarStacked, Timer, BetweenHorizontalStart, Vote } from 'lucide-react';
import avatar from "../assets/avatar.webp"; 
import './Leaderboard.css';

function Leaderboard({ 
  totalEntries = 48, 
  categoriesCount = 11
}) {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState("00d 00h 00m 00s");

  // Helper function to build fallbacks if avatar string is empty or missing
  const getAvatarUrl = (userAvatar, username) => {
    if (userAvatar && userAvatar.trim() !== "") return userAvatar;
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username || "default")}`;
  };

  // 1. Live Database Fetch Effect
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        // Inside Leaderboard.jsx - Update your fetch URL line:
const encodedCategory = encodeURIComponent("Music / Songs");
const response = await fetch(`http://127.0.0.1:8000/api/v1/leaderboard/talent/${encodedCategory}?limit=20`);
        if (!response.ok) throw new Error(`Server status error: ${response.status}`);

        const data = await response.json();
        let rawList = Array.isArray(data) ? data : (data?.talents || data?.items || data?.results || []);

        const formattedData = rawList.map((item) => {
          const itemId = item.id || item.upload_id || "550e8400-e29b-41d4-a716-446655440000";
          const locallySavedVotes = localStorage.getItem(`vote_count_${itemId}`);
          const currentUsername = item.user?.username || item.username || "Kim";

          return {
            id: itemId, 
            votes: locallySavedVotes ? parseInt(locallySavedVotes, 10) : (item.vote_count || item.votes || 0),
            creator: {
              name: currentUsername,
              // 🎯 FIX 1: Clean up empty strings or nulls from the database payload
              avatar: getAvatarUrl(item.user?.avatar, currentUsername)
            }
          };
        });

        setCandidates(formattedData);
      } catch (err) {
        console.error("Leaderboard fallback activated:", err);
        const fallbackVote1 = localStorage.getItem("vote_count_550e8400-e29b-41d4-a716-446655440000");
        const fallbackVote2 = localStorage.getItem("vote_count_mock-candidate-2");
        const fallbackVote3 = localStorage.getItem("vote_count_mock-candidate-3");

        // 🎯 FIX 2: Generate unique avatars for your mock fallback users instead of setting them to null
        setCandidates([
          { id: "550e8400-e29b-41d4-a716-446655440000", votes: fallbackVote1 ? parseInt(fallbackVote1, 10) : 12440, creator: { name: "Kim", avatar: getAvatarUrl(null, "Kim") } },
          { id: "mock-candidate-2", votes: fallbackVote2 ? parseInt(fallbackVote2, 10) : 8920, creator: { name: "Daniel", avatar: getAvatarUrl(null, "Daniel") } },
          { id: "mock-candidate-3", votes: fallbackVote3 ? parseInt(fallbackVote3, 10) : 4110, creator: { name: "Fisayo", avatar: getAvatarUrl(null, "Fisayo") } }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  // 2. REAL-TIME WEEKLY COUNTDOWN EFFECT
  useEffect(() => {
    const getNextMondayTarget = () => {
      const now = new Date();
      const target = new Date();
      const currentDay = now.getDay();
      const daysToNextMonday = (1 + 7 - currentDay) % 7 || 7;
      
      target.setDate(now.getDate() + daysToNextMonday);
      target.setHours(0, 0, 0, 0);
      return target;
    };

    const targetDate = getNextMondayTarget();

    const updateTimer = () => {
      const now = new Date();
      const timeDifference = targetDate - now;

      if (timeDifference <= 0) {
        setCountdown("00d 00h 00m 00s");
        return;
      }

      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
      const seconds = Math.floor((timeDifference / 1000) % 60);

      const dStr = String(days).padStart(2, '0');
      const hStr = String(hours).padStart(2, '0');
      const mStr = String(minutes).padStart(2, '0');
      const sStr = String(seconds).padStart(2, '0');

      setCountdown(`${dStr}d ${hStr}h ${mStr}m ${sStr}s`);
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // 3. Derived Data Formats
  const topFive = [...candidates].sort((a, b) => b.votes - a.votes).slice(0, 5);
  const totalVotes = candidates.reduce((sum, item) => sum + item.votes, 0);
  const activeEntriesCount = candidates.length > 0 ? candidates.length : totalEntries;

  const formatStatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num;
  };

  if (isLoading) return <div className="sidebar"><p style={{ padding: "20px", color: "#fff" }}>Syncing rankings...</p></div>;

  return (
    <div className="sidebar">
      <aside className="sidebar-top">
        <div className="live-badge-container">
          <h2 className="section-title">Top This Week</h2>
          <span className="live-badge">● Live Leaderboard</span>
        </div>

        <section className="leaderboard-section">
          <div className="leaderboard-list">
            {topFive.map((player, index) => {
              const displayName = player.creator?.name || "Anon Artist";
              // 🎯 FIX 3: Fallback only if both data types somehow fail validation completely
              const creatorAvatar = player.creator?.avatar || avatar;
              
              return (
                <div key={player.id || index} className="leaderboard-row">
                  <span className="rank-number">{index + 1}</span>
                  <div className="avatar-wrapper">
                    <img src={creatorAvatar} alt={displayName} className="avatar-image" />
                  </div>
                  <span className="player-name">{displayName}</span>
                  <span className="player-votes">{player.votes.toLocaleString()} votes</span>
                </div>
              );
            })}
          </div>
        </section>
      </aside>

      <section className="stats-section">
        <div className="stats-title"><h2>Voting This Week</h2></div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-box"><Vote size={40}/></div>
            <div className="stat-info">
              <span className="stat-value">{formatStatNumber(totalVotes)}</span>
              <span className="stat-label">TOTAL VOTES</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-box"><BetweenHorizontalStart size={40}/></div>
            <div className="stat-info">
              <span className="stat-value">{activeEntriesCount}</span>
              <span className="stat-label">ENTRIES</span>
            </div>  
          </div>
          
          <div className="stat-card">
            <div className="stat-box"><Timer size={40}/></div>
            <div className="stat-info">
              <span className="stat-value highlight-gold">{countdown}</span>
              <span className="stat-label">VOTING ENDS</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-box"><ChartBarStacked size={40}/></div>
            <div className="stat-info">
              <span className="stat-value">{categoriesCount}</span>
              <span className="stat-label">CATEGORIES</span>
            </div>
          </div>
        </div>
      </section>

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