import './Hero.css'
import { Link } from "react-router-dom";
import goodjob from '../assets/goodjob.png'


function Hero() {
  return (
        <div className="hero">
            <div className="hero-content">
                <h2>Naija Celebrates</h2>
                <p>One Nation. One Voice. One Celebration</p>
                <span>Showcase your talent, vote for the best, and celebrate Nigerian culture on Africa's biggest digital platform.</span>
                <div className="hero-btns">
                    <Link to="/upload"><button> Upload Talent</button></Link>
                    <Link to="/voting"><button>Vote Now</button></Link>
                    <Link to="/quiz"><button>Join Quiz</button></Link>
                </div>
            </div>
            <div className="hero-video-frame">
                <iframe 
                    className="hero-video-player"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1" 
                    title="Live Quiz Presenter Feed"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                ></iframe>
            <div className="hero-btns">
                <Link to="/upload"><button> Upload Talent</button></Link>
                <Link to="/voting"><button>Vote Now</button></Link>
                <Link to="/quiz"><button>Join Quiz</button></Link>
            </div>
        </div>
  )
}

export default Hero
