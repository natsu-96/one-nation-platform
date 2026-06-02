import './Quiz.css'

function Quiz() {
  return (
    <>
      <div className="quiz">
        <div className="quiz-header">
            <h1>How Well Do You Know Nigeria?</h1>
            <span className="quiz-desc">Join our weekly live quiz sessions and test your knowledge about Nigerian history, culture, sports, and achievements.</span>
        </div>
        <div className="quiz-content">
            <div className="quiz-card-1">
                <div className="card1-top">
                    <div className="card1-icon">💡</div>
                    <div className="card1-title">
                        <h3>Live This Week</h3>
                        <p>Saturday 7 PM WAT</p>
                    </div>
                </div>
                <p className="card1-text">Test your knowledge about Nigerian history, geography, music, sports, and more. Compete with thousands of players in real-time.</p>
                <button className="card1-btn">Join Quiz</button>
            </div>
            <div className="quiz-card-2">
                <h1>Quiz Categories</h1>
                <div className="card2-list">
                    <li>Nigerian History & Independence</li>
                    <li>Geography & States</li>
                    <li>Music, Movies & Entertainment</li>
                    <li>Sports & Achievements</li>
                    <li>Science, Tech & Innovation</li>
                    <li>Famous Nigerians & Heroes</li>
                </div>
            </div>
        </div>
      </div>
    </>
  )
}

export default Quiz
