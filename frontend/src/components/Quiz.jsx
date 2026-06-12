import './Quiz.css'
import quizImg from "../assets/quizImg.webp"

function Quiz() {
  return (
    <>
      <div className="quiz">
        <div className="quiz-header">
            <h1>How Well Do You Know Nigeria?</h1>
            <span className="quiz-desc">Join our weekly live quiz sessions and test your knowledge about Nigerian history, culture, sports, and achievements.</span>
        </div>
        <div className="quiz-content">
            <div className="quiz-content-info">
                <p className="quiz-content-text">Test your knowledge about Nigerian history, geography, music, sports, and more. Compete with thousands of players in real-time.</p>
                <button className="quiz-content-btn">Join Quiz</button>
            </div>
            <div className="quiz-card-2">
                <img src={quizImg}/>
            </div>
        </div>
      </div>
    </>
  )
}

export default Quiz
