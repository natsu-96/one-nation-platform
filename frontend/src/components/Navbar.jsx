import './Navbar.css'
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <>
        <div className="navbar">
            <div className="nav">
                <div className="logo-section">
                    <div className="logo">Nigeria Celebrates</div>
                </div>
                <div className="nav-links">
                    <Link to="/talent"><li><a>Talent Zone</a></li></Link>
                    <Link to="/voting"><li><a>Vote</a></li></Link>
                    <Link to="/quiz"><li><a>Quiz</a></li></Link>
                    <Link to="/signin"><li><button>Sign In</button></li></Link>
                </div>
            </div>
        </div>
    </>
  )
}

export default Navbar
