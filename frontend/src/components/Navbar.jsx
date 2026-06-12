import './Navbar.css'
import LoginModal from './LoginModal';
import DashboardDrawer from './DashboardDrawer';
import { useState, useEffect } from 'react';
import avatar from '../assets/avatar.webp'
import { Link } from "react-router-dom";
import SignupModal from './SignupModal';

function Navbar() {
  const [activeModal, setActiveModal] = useState(null);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [activeModal]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsDashboardOpen(false);
  }

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const closeModals = () => setActiveModal(null);

  return (
    <>
        <div className="navbar">
            <div className="nav">
                <div className="logo-section">
                    <div className="logo"><Link to="/">NC</Link></div>
                </div>
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
                            <button onClick={() => setActiveModal('login')}>Sign In</button>
                        )}
                    </div>
                    <div className="hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                </div>
            </div>
        </div>
        <LoginModal 
                isOpen={activeModal === 'login'} 
                onClose={closeModals}
                onSwitchToSignup={() => setActiveModal('signup')} 
        />
        <SignupModal 
            isOpen={activeModal === 'signup'}
            onClose={closeModals}
            onSwitchToLogin={() => setActiveModal('login')}
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