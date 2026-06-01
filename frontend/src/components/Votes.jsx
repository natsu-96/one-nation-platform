import { title } from 'framer-motion/client'
import './Votes.css'


const votesCardData = [
    {
        title: "1",
        category: "Category 1",
        count: "1.2K",
        tag: "votes"
    },
    {
        title: "2",
        category: "Category 2",
        count: "1.2K",
        tag: "votes"
    },
    {
        title: "3",
        category: "Category 3",
        count: "1.2K",
        tag: "votes"
    },
    {
        title: "4",
        category: "Category 4",
        count: "1.2K",
        tag: "votes"
    }
]

function Votes() {
  return (
    <div className='votes-section'>
      <div className="votes">
        <div className="votes-left">
            <h1>Naija Votes</h1>
            <p>Your vote matters! Support your favorite talents and watch live vote counts update in real-time. Vote once per category per year and help crown the champions.</p>
            <div className="votes-points">
                <li>Live leaderboard updates</li>
                <li>Vote as guest or registered user</li>
                <li>Real-time vote counting</li>
            </div>
            <button>Start Voting</button>
        </div>
        <div className="votes-right">
            <div className="votes-grid">
                {votesCardData.map((vdata, index) => (
                    <div key={index} className="votes-card">
                        <h1>{vdata.title}</h1>
                        <p>{vdata.category}</p>
                        <span className="votes-count">{vdata.count}</span>
                        <span className="votes-tag">{vdata.tag}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  )
}

export default Votes
