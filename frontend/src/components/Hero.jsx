import './Hero.css'
import { Link } from "react-router-dom";

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
                <button> <Link to="/upload">Upload Talent</Link></button>
                <button> <Link to="/vote">Vote Now</Link></button>
                <button> <Link to="/quiz">Join Quiz</Link></button>
            </div>
        </div>
  )
}

export default Hero
