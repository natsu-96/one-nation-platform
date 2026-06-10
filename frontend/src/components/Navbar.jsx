import './Navbar.css'
import LoginModal from './LoginModal';
import DashboardDrawer from './DashboardDrawer';
import { useState, useEffect } from 'react';
import avatar from '../assets/avatar.png'
import { Link } from "react-router-dom";

function Navbar() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [loginOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsDashboardOpen(false);
  }

  return (
    <>
        <div className="navbar">
            <div className="nav">
                <div className="logo-section">
                    <div className="logo"><Link to="/">NC</Link></div>
                </div>
                <div className="nav-links">
                    <Link to="/voting"><li>Vote</li></Link>
                    <Link to="/quiz"><li>Quiz</li></Link>
                    <Link to="/icons"><li>Icons</li></Link>
                    <Link to="/champions"><li>Champions</li></Link>
                </div>
                <div className="signin-btn">
                    {isLoggedIn ? (
                        <div className="nav-avatar-wrapper" onClick={() => setIsDashboardOpen(true)}>
                            <img src={avatar} alt="Avatar" />
                        </div>
                    ) : (
                        <Link><button onClick={() => setLoginOpen(true)}>Sign In</button></Link>
                    )}
                </div>
            </div>
        </div>
        <LoginModal 
                isOpen={loginOpen} 
                onClose={() => setLoginOpen(false)} 
        />
        <DashboardDrawer 
            isOpen={isDashboardOpen} 
            onClose={() => setIsDashboardOpen(false)} 
            onLogout={handleLogout}
        />
    </>
  )
}

export default Navbar
