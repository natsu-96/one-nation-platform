import './Navbar.css'
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <>
        <div className="navbar">
            <div className="nav">
                <div className="logo-section">
                    <div className="logo">NC</div>
                </div>
                <div className="nav-links">
                    <Link to="/talent"><li>Talent Zone</li></Link>
                    <Link to="/voting"><li>Vote</li></Link>
                    <Link to="/quiz"><li>Quiz</li></Link>
                    <Link to="/signin"><li><button>Sign In</button></li></Link>
                </div>
            </div>
        </div>
    </>
  )
}

export default Navbar
