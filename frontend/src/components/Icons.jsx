import { Link } from "react-router-dom"
import './Icons.css'
import iconImg from '../assets/icons.webp'

const iconsData = [
    {
        rank: "1",
        votes: "100",
        image: iconImg,
        name: "Janelle Adegoke",
        impact: "Music Icon"
    },
    {
        rank: "2",
        votes: "10500",
        image: iconImg,
        name: "Tunde Jeffery",
        impact: "Artist"
    },
    {
        rank: "3",
        votes: "8351",
        image: iconImg,
        name: "Moses Simon",
        impact: "Footballer"
    },
    {
        rank: "4",
        votes: "6890",
        image: iconImg,
        name: "Nans Bello",
        impact: "Product Designer"
    },
    {
        rank: "5",
        votes: "5340",
        image: iconImg,
        name: "Bola Adewale",
        impact: "Comedian"
    },
    {
        rank: "6",
        votes: "4100",
        image: iconImg,
        name: "Esther Ochogila",
        impact: "Hand Crafter"
    }
]

function Icons() {
  return (
    <div className="icons-section">
        <div className="icons-content">
            <div className="icons-header">
            <h1>Nigerian Global Icons</h1>
            <p>Celebrate Nigerians who have made significant global impact across music, sports, technology, business, and more.</p>
        </div>
        <div className="iconz-grid">
            {iconsData.map((iconz, index) => (
                <div className="icon-card">
                    <div className="icon-card-up">
                        <div className="rank-vote-badge">
                            <div className="badge-section">
                                <span className="badge-label">RANK</span>
                                <span className="badge-value">#{iconz.rank}</span>
                            </div>
                            <div className="badge-divider"></div>
                            <div className="badge-section">
                                <span className="badge-label">VOTES</span>
                                <span className="badge-value">{iconz.votes.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="icon-images">
                            <img src={iconz.image} alt="icon image" />
                        </div>
                    </div>
                    <div className="icon-card-down">
                        <div className="icon-content">
                            <h3>{iconz.name}</h3>
                            <p>{iconz.impact}</p>
                            <button>Nominate</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <div className="icons-btn">
            <Link to="/icons"><button>View Icons</button></Link>
        </div>
      </div>
    </div>
  )
}

export default Icons
