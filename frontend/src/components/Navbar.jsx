import './Navbar.css'
import LoginDrawer from './LoginDrawer';
import { useState } from 'react';
import { Link } from "react-router-dom";

function Navbar() {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
        <div className="navbar">
            <div className="nav">
                <div className="logo-section">
                    <div className="logo"><Link to="/">NC</Link></div>
                </div>
                <div className="nav-links">
                    <Link to="/talent"><li>Talent Zone</li></Link>
                    <Link to="/voting"><li>Vote</li></Link>
                    <Link to="/quiz"><li>Quiz</li></Link>
                </div>
                <div className="signin-btn">
                    <Link><button onClick={() => setLoginOpen(true)}>Sign In</button></Link>
                </div>
            </div>
        </div>
        <LoginDrawer 
                isOpen={loginOpen} 
                onClose={() => setLoginOpen(false)} 
        />
    </>
  )
}

export default Navbar
