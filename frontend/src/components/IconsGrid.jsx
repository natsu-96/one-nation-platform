import React from 'react';
import { useNavigate } from 'react-router-dom'; // 🚀 Import useNavigate
import IconsCard from './IconsCard';
import './IconsGrid.css';

function IconsGrid({ icons = [], onVote }) {
  const navigate = useNavigate(); // Initialize routing engine

  const handleCardClick = (icons) => {
    // Navigate dynamically to the details route, shipping the specific object state along
    navigate(`/details/${icons.id}`, { state: { card: icons } });
  };

  return (
    <div className="icons-container">
      <div className="icons-grid">
        {icons.map((icon) => (
          <IconsCard 
            key={icon.id}
            name={icon.name} 
            niche={icon.niche} 
            bio={icon.bio}
            votes={icon.votes}
            image={icon.img}
            position={icon.position}
            votersCount={icon.votersCountString}
            // 🎯 Pass a click function down that knows who this candidate is
            onClick={() => handleCardClick(icon)}
          />
        ))}
      </div>
    </div>
  );
}

export default IconsGrid;