import './Hero.css'
import { Link } from "react-router-dom";
import goodjob from '../assets/goodjob.png'


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
                <Link to="/upload"><button> Upload Talent</button></Link>
                <Link to="/voting"><button>Vote Now</button></Link>
                <Link to="/quiz"><button>Join Quiz</button></Link>
            </div>
        </div>
  )
}

export default Hero
