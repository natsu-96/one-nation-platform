import './Icons.css'
import iconImg from '../assets/icons.jpg'

const iconsData = [
    {
        image: iconImg,
        name: "Icon 1",
        impact: "Global Impact",
        votes: "100"
    },
    {
        image: iconImg,
        name: "Icon 2",
        impact: "Global Impact",
        votes: "200"
    },
    {
        image: iconImg,
        name: "Icon 3",
        impact: "Global Impact",
        votes: "300"
    },
    {
        image: iconImg,
        name: "Icon 4",
        impact: "Global Impact",
        votes: "400"
    }
]

function Icons() {
  return (
    <div className="icons">
        <div className="icons-content">
            <div className="icons-header">
            <h1>Nigerian Global Icons</h1>
            <p>Celebrate Nigerians who have made significant global impact across music, sports, technology, business, and more.</p>
        </div>
        <div className="icons-grid">
            {iconsData.map((icon, index) => (
                <div className="icon-card">
                    <img src={icon.image} alt="icon image" />
                    <div className="icon-content">
                        <h3>{icon.name}</h3>
                        <p>{icon.impact}</p>
                        <span>{icon.votes} votes</span>
                        <button>Vote</button>
                    </div>
                </div>
            ))}
        </div>
        <div className="icons-btn">
            <button>View All Icons</button>
        </div>
      </div>
    </div>
  )
}

export default Icons
