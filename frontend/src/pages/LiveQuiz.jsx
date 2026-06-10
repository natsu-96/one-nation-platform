import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./LiveQuiz.css";

const LIVE_QUESTIONS_BANK = {
    DEFAULT: [
        { id: 1 },
        { id: 2 },
        { id: 3 }
    ]
};

function LiveQuizPlay({ liveQuiz, onExit }) {
    const navigate = useNavigate();
    // Added safety fallback handling (?.) to prevent blank loading screen if object isn't supplied
    const quizQuestions = LIVE_QUESTIONS_BANK[liveQuiz?.id] || LIVE_QUESTIONS_BANK.DEFAULT;
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15); 
    const [quizEnded, setQuizEnded] = useState(false);
    const [typedAnswer, setTypedAnswer] = useState("");
    
    const timerRef = useRef(null);

    // Mock dynamic contestants baseline timeline order data based on response speed
    const [contestantsTimeline, setContestantsTimeline] = useState([
        { name: "Chidi_99", speed: "1.2s" },
        { name: "Amina_Abuja", speed: "1.8s" },
        { name: "Tunde_Dev", speed: "2.4s" },
        { name: "Ngozi_Spark", speed: "3.1s" },
        { name: "Olumide_X", speed: "4.5s" }
    ]);

    const handleCloseQuizArea = () => {
        if (onExit) {
            onExit();
        }
        navigate("/quiz");
    }

    const formatTimerDisplay = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    useEffect(() => {
        setTimeLeft(15); 
        
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleNextQuestionAdvance(); 
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [currentIndex]);

    const handleNextQuestionAdvance = () => {
        if (currentIndex < quizQuestions.length - 1) {
            setTypedAnswer("");
            setCurrentIndex((prev) => prev + 1);
        } else {
            clearInterval(timerRef.current);
            setQuizEnded(true);
        }
    };

    const onSubmitAnswer = (e) => {
        e.preventDefault();
        if (!typedAnswer.trim()) return;

        // Visual Simulator: Push your name instantly to the front of the speed matrix array
        const userSpeedMetric = (15 - timeLeft).toFixed(1);
        setContestantsTimeline((prev) => [
            { name: "You (Local Contestant)", speed: `${userSpeedMetric}s` },
            ...prev
        ]);
        
        setTypedAnswer("");
        handleNextQuestionAdvance();
    };

    if (quizEnded) {
        return (
            <div className="quiz-play-screen-container">
                <div className="quiz-play-card-window end-session-layout">
                    <h2>Quiz Completed! 🎉</h2>
                    <p>Great effort! Your arena play performance has been tallied onto the scoreboard ecosystem.</p>
                    <button className="finish-session-btn" onClick={handleCloseQuizArea}>Return to Main Lobby</button>
                </div>
            </div>
        );
    }

    return (
        <div className="quiz-play-screen-container">
            <div className="quiz-play-inner-wrapper">
                
                {/* Header Context Action Bar */}
                <div className="quiz-play-top-navigation">
                    <button className="quiz-nav-exit-btn" onClick={handleCloseQuizArea}>Exit</button>
                    <span className="quiz-nav-category-tag">{liveQuiz?.title || "Live Quiz Arena"}</span>
                    <div className="quiz-nav-live-clock">{formatTimerDisplay(timeLeft)}</div>
                </div>
                <div className="quiz-play-card-window">
                    <div className="live-workspace-row-one">
                        
                        {/* Column A: Interactive Text Box Submission form block */}
                        <form className="live-input-container-pane" onSubmit={onSubmitAnswer}>
                            <label className="live-input-field-label">Your Live Answer</label>
                            <div className="live-input-field-row">
                                <input 
                                    type="text"
                                    className="live-text-answer-field"
                                    placeholder="Type your answer here..."
                                    value={typedAnswer}
                                    onChange={(e) => setTypedAnswer(e.target.value)}
                                />
                                <button type="submit" className="live-submit-action-btn">Submit</button>
                            </div>
                        </form>

                        {/* Column B: Embedded Live Stream Player Frame Container */}
                        <div className="live-video-stream-frame">
                            <div className="live-stream-badge">● LIVE STREAM</div>
                            <iframe 
                                className="embedded-video-player"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1" 
                                title="Live Quiz Presenter Feed"
                                frameBorder="0"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                            ></iframe>
                        </div>

                    </div>

                    {/* ROW 2: Velocity Timeline Node Element Block */}
                    <div className="live-workspace-row-two">
                        <h4 className="timeline-section-heading">Live Participant Speed Feed Timeline</h4>
                        <div className="timeline-horizontal-wrapper-track">
                            {contestantsTimeline.map((contestant, index) => (
                                <div className="timeline-node-item" key={index}>
                                    <span className={`timeline-username ${index === 0 ? "fastest-rank-highlight" : ""}`}>
                                        {contestant.name}
                                    </span>
                                    <div className="timeline-speed-badge">
                                        <span className="timeline-speed-text">{contestant.speed}</span>
                                        {index < contestantsTimeline.length - 1 && <span className="timeline-node-arrow">→</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default LiveQuizPlay;