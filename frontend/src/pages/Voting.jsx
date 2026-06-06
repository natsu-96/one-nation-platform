import Navbar from "../components/Navbar"
import "./Voting.css"

function Voting() {
    return (
        <>
        <Navbar />
        <div className="voting">
            <div className="container">
                <div className="voting-top">
                    <div className="voting-header-text">
                        <h2>NAIJA <span>TALENT ZONE</span></h2>
                        <p>Showcase your talent, vote for the best, and celebrate Nigerian culture on Africa's biggest digital platform.</p>
                        <div className="voting-categories">
                            <li>ALL ENTRIES</li>
                            <li>MUSIC</li>
                            <li>ARTWORK</li>
                            <li>COMEDY</li>
                            <li>FOOTBALL</li>
                            <li>FASHION</li>
                            <li>LOGO</li>
                            <li>PHOTO</li>
                            <li>FILM</li>
                            <li>SPORTS</li>
                        </div>
                    </div>
                </div>
                <div className="voting-body">
                    <div className="voting-left">
                        <div className="voting-filter">
                            <div className="filter-left">
                                <button>Trending</button>
                                <button>Newest</button>
                                <button>Most Voted</button>
                            </div>
                            <div className="filter-right">
                                <button>This Week</button>
                            </div>
                        </div>
                        <div className="voting-grid">
                            <span>fro</span>
                        </div>
                    </div>
                    <div className="voting-right">
                        <div className="voting-leaderboard">
                            LIVE LEADERBOARD
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Voting