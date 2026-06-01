import './Navbar.css'

function Navbar() {
  return (
    <>
        <div className="navbar">
            <div className="nav">
                <div className="logo-section">
                    <div className="logo">Nigeria Celebrates</div>
                </div>
                <div className="nav-links">
                    <li><a>Talent Zone</a></li>
                    <li><a>Vote</a></li>
                    <li><a>Quiz</a></li>
                    <li><button>Sign In</button></li>
                </div>
            </div>
        </div>
    </>
  )
}

export default Navbar
