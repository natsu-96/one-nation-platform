import React from "react";
import girl from '../assets/girl.webp'
import "./QuizGrid.css";

function QuizGrid({ items, onPlay }) {
    return (
        <div className="quiz-cards-wrapper">
            <div className="quiz-cards-grid">
                {items.map((quiz) => (
                    <div key={quiz.id} className="quiz-card">
                        {/* Upper Card Preview Canvas (Preserving Blank Frame Area) */}
                        <div className="quiz-card-banner">
                            <img src={girl}/>
                        </div>
                        
                        {/* Card Metadata Meta Bottom Bar Info */}
                        <div className="quiz-card-details">
                            <div className="quiz-card-info-left">
                                <h3 className="quiz-card-title">{quiz.title}</h3>
                                <p className="quiz-card-description">
                                    {quiz.category === "GEOGRAPHY" 
                                        ? "Can you guess the state just by its official slogan?" 
                                        : quiz.description || "Test your knowledge in this real-time community arena challenge."}
                                </p>
                                <span className="quiz-card-plays">{quiz.plays || "14,450 plays"}</span>
                            </div>
                            
                            <div className="quiz-card-info-right">
                                <button 
                                    className="quiz-play-btn" 
                                    onClick={() => onPlay(quiz.id)}
                                >
                                    Play
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Row matching footer controls in design screenshot */}
            <div className="quiz-pagination-container">
                <button className="pagination-arrow prev-btn">&larr; Previous</button>
                <div className="pagination-numbers">
                    <span className="page-num active-page">1</span>
                    <span className="page-num">2</span>
                    <span className="page-num">3</span>
                    <span className="page-dots">...</span>
                    <span className="page-num">7</span>
                    <span className="page-num">8</span>
                </div>
                <button className="pagination-arrow next-btn">Next &rarr;</button>
            </div>
        </div>
    );
}

export default QuizGrid;