import './Champs.css'
import { useState } from "react";
import girl from "../assets/girl.webp";
import icon from "../assets/icon.webp";

const champsData = [
  { name: "Kim", rank: 1, votes: 12440, prize: "1 Million Naira!", image: girl },
  { name: "Tunde", rank: 2, votes: 9870, prize: "500K Naira!", image: icon },
  { name: "Ada", rank: 3, votes: 7210, prize: "250K Naira!", image: girl },
];

function Champs() {
  const [current, setCurrent] = useState(0);
  const champ = champsData[current];

  return (
    <div className="champs-section">
      <h2 className="champs-title">Naija Champs</h2>
      <p className="champs-subtitle">
        Join our weekly live quiz sessions and test your knowledge about
        Nigerian history, culture, sports, and achievements.
      </p>

      <div className="champ-card">
        <div className="champ-card-image">
          <div className="rank-vote-badge">
            <div className="badge-section">
              <span className="badge-label">RANK</span>
              <span className="badge-value">#{champ.rank}</span>
            </div>
            <div className="badge-divider" />
            <div className="badge-section">
              <span className="badge-label">VOTES</span>
              <span className="badge-value">{champ.votes.toLocaleString()}</span>
            </div>
          </div>
          <img src={champ.image} alt={champ.name} />
        </div>
        <div className="champ-card-name">{champ.name}</div>
      </div>

      <div className="champ-prize">
        <span className="prize-label">Prize Won:</span>
        <span className="prize-value">{champ.prize}</span>
      </div>

      {/* Dot navigation */}
      <div className="champ-dots">
        {champsData.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === current ? "dot-active" : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`View champion ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Champs;