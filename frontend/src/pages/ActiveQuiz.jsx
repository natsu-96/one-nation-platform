import React, { useState, useEffect, useRef } from "react";
import "./ActiveQuiz.css";

// Comprehensive robust mock data mapping question sets based on selected category names
const MOCK_QUESTIONS_BANK = {
    GEOGRAPHY: [
        { id: 1, text: "How many states are there in Nigeria?", options: ["36", "30", "35", "32", "39"] },
        { id: 2, text: "Which Nigerian state is officially nicknamed 'The Sunshine State'?", options: ["Ogun State", "Ondo State", "Kano State", "Anambra State", "Cross River"] },
        { id: 3, text: "Where do the River Niger and River Benue meet?", options: ["Lokoja", "Makurdi", "Asaba", "Jebba", "Baro"] },
        { id: 4, text: "Which state is the largest in landmass area within Nigeria?", options: ["Taraba State", "Niger State", "Borno State", "Kaduna State", "Oyo State"] }
    ],
    DEFAULT: [
        { id: 1, text: "Who is the legendary father of Afrobeats music?", options: ["Fela Kuti", "King Sunny Ade", "Oliver De Coque", "Majek Fashek", "Tony Allen"] },
        { id: 2, text: "In what year did Nigeria secure its structural democratic independence?", options: ["1957", "1960", "1963", "1970", "1999"] },
        { id: 3, text: "Which historic modern sports squad earned Olympic Gold at Atlanta '96?", options: ["The Super Falcons", "The Dream Team Football Squad", "D'Tigers Basketball", "Track & Field Relay", "The Green Eagles"] }
    ]
};

function ActiveQuizPlay({ quiz, onExit }) {
    // Determine target category list fallback baseline
    const quizQuestions = MOCK_QUESTIONS_BANK[quiz.category] || MOCK_QUESTIONS_BANK.DEFAULT;
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState("");
    const [timeLeft, setTimeLeft] = useState(15); // Explicit 15 Seconds Window Limit
    const [quizEnded, setQuizEnded] = useState(false);
    
    const timerRef = useRef(null);

    const currentQuestion = quizQuestions[currentIndex];

    // Format visual minutes:seconds timer block string nicely
    const formatTimerDisplay = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    // Core countdown timing cycle loop engine setup
    useEffect(() => {
        setTimeLeft(15); // Reset clock to 15 when landing on a new question card
        
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleNextQuestionAdvance(); // Timer hit 0! Forces auto-advance skip action
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [currentIndex]);

    const handleNextQuestionAdvance = () => {
        if (currentIndex < quizQuestions.length - 1) {
            setSelectedOption("");
            setCurrentIndex((prev) => prev + 1);
        } else {
            clearInterval(timerRef.current);
            setQuizEnded(true);
        }
    };

    const handleBackStepAction = () => {
        if (currentIndex > 0) {
            setSelectedOption("");
            setCurrentIndex((prev) => prev - 1);
        }
    };

    if (quizEnded) {
        return (
            <div className="quiz-play-screen-container">
                <div className="quiz-play-card-window end-session-layout">
                    <h2>Quiz Completed! 🎉</h2>
                    <p>Great effort! Your arena play performance has been tallied onto the scoreboard ecosystem.</p>
                    <button className="finish-session-btn" onClick={onExit}>Return to Main Lobby</button>
                </div>
            </div>
        );
    }

    // Dynamic fractional calculation logic parameters matching your visual loading layout specs
    const currentCompletedIndex = currentIndex + 1; 
    const progressPercent = (currentCompletedIndex / quizQuestions.length) * 100;

    return (
        <div className="quiz-play-screen-container">
            <div className="quiz-play-inner-wrapper">
                
                {/* Header Context Action Bar */}
                <div className="quiz-play-top-navigation">
                    <button className="quiz-nav-exit-btn" onClick={onExit}>Exit</button>
                    <span className="quiz-nav-category-tag">{quiz.title || "Geography & States"}</span>
                    <div className="quiz-nav-live-clock">{formatTimerDisplay(timeLeft)}</div>
                </div>

                {/* Tracking Meter Bar Module Component Layout */}
                <div className="quiz-play-progress-group">
                    <div className="progress-metrics-text-row">
                        {currentCompletedIndex}/{quizQuestions.length} completed
                    </div>
                    <div className="progress-bar-rail-base">
                        <div className="progress-bar-rail-fill" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                </div>

                {/* Main Content Presentation Card Component Element Frame */}
                <div className="quiz-play-card-window">
                    <h2 className="quiz-active-question-prompt">{currentQuestion.text}</h2>
                    
                    <div className="quiz-active-options-list-stack">
                        {currentQuestion.options.map((option, idx) => {
                            const isChosen = selectedOption === option;
                            return (
                                <label 
                                    key={idx} 
                                    className={`quiz-active-option-row-item ${isChosen ? "active-row-selected" : ""}`}
                                >
                                    <div className="native-radio-input-box-wrapper">
                                        <input 
                                            type="radio" 
                                            name="quiz-active-options" 
                                            value={option}
                                            checked={isChosen}
                                            onChange={() => setSelectedOption(option)}
                                        />
                                        <span className="native-custom-radio-target"></span>
                                    </div>
                                    <span className="native-option-label-string-text">{option}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* Footer Operational Navigation Command Action Toolbar */}
                <div className="quiz-play-footer-actions-bar">
                    <button 
                        className="quiz-action-back-btn"
                        onClick={handleBackStepAction}
                        disabled={currentIndex === 0}
                    >
                        Back
                    </button>
                    <button 
                        className="quiz-action-next-btn"
                        onClick={handleNextQuestionAdvance}
                    >
                        {currentIndex === quizQuestions.length - 1 ? "Submit" : "Next"}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default ActiveQuizPlay;