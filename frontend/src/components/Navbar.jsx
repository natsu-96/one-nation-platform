import './Navbar.css'
import LoginModal from './LoginModal';
import DashboardDrawer from './DashboardDrawer';
import { useState, useEffect } from 'react';
import avatar from '../assets/avatar.webp'
import { Link } from "react-router-dom";

function Navbar() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // New state for mobile menu

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [loginOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsDashboardOpen(false);
  }

  // Close mobile menu when a link is clicked
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
        <div className="navbar">
            <div className="nav">
                <div className="logo-section">
                    <div className="logo"><Link to="/">NC</Link></div>
                </div>
                
                {/* Added 'active' class condition for mobile toggling */}
                <div className={isMobileMenuOpen ? "nav-links active" : "nav-links"}>
                    <Link to="/voting" onClick={closeMobileMenu}><li>Vote</li></Link>
                    <Link to="/quiz" onClick={closeMobileMenu}><li>Quiz</li></Link>
                    <Link to="/icons" onClick={closeMobileMenu}><li>Icons</li></Link>
                    <Link to="/champions" onClick={closeMobileMenu}><li>Champions</li></Link>
                </div>
                
                <div className="nav-right">
                    <div className="signin-btn">
                        {isLoggedIn ? (
                            <div className="nav-avatar-wrapper" onClick={() => setIsDashboardOpen(true)}>
                                <img src={avatar} alt="Avatar" className="nav-avatar-icon" />
                            </div>
                        ) : (
                            <button onClick={() => setLoginOpen(true)}>Sign In</button>
                        )}
                    </div>

                    {/* Hamburger Icon */}
                    <div className="hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
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

export default Navbar;