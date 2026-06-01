import './Hero.css'

function Hero() {
  return (
        <div className="hero">
            <div className="hero-content">
                <div className="hero-badge">
                    <text>Celebrating Nigerian Excellence</text>
                </div>
                <h2>Naija Celebrates</h2>
                <p>One Nation. One Voice. One Celebration</p>
                <span>Showcase your talent, vote for the best, and celebrate Nigerian culture on Africa's biggest digital platform.</span>
            </div>
            <div className="hero-btns">
                <button>Upload Talent</button>
                <button>Vote Now</button>
                <button>Join Quiz</button>
            </div>
        </div>
  )
}

export default Hero
