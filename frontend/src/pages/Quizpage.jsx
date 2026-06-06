import React, { useState, useEffect } from "react";
import Leaderboard from "../components/Leaderboard";
import Navbar from "../components/Navbar";
import QuizGrid from "../components/QuizGrid"; // Assuming you build a parallel grid file
import "./Quizpage.css"; // Your page styling sheet

function Quizpage() {
    const [allQuizzes, setAllQuizzes] = useState([]);
    const [filteredQuizzes, setFilteredQuizzes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("ALL ENTRIES");
    const [loading, setLoading] = useState(true);

    const categories = ["HISTORY", "GEOGRAPHY", "ENTERTAINMENT", "SPORTS", "STEM", "ICONS"];

    // 1. Fetch live active quiz sessions from backend on mount
    useEffect(() => {
        setLoading(true);

        // Retrieve the login token your user got when signing in
        const userToken = localStorage.getItem("token"); 

        fetch("http://localhost:8000/api/v1/quiz/active", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // Pass user credentials so your friend's secure backend lets the request through
                "Authorization": `Bearer ${userToken}` 
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error("Could not fetch active quizzes");
                return res.json();
            })
            .then((data) => {
                // Map his data model properties onto your UI visual layout
                const formattedQuizzes = data.map((item, index) => ({
                    id: item.quiz_session_id || index + 1, // fallback id mapping
                    title: item.quiz,                      // maps 'quiz' title text
                    category: item.category.toUpperCase(), // ensures standard uppercase strings
                    plays: "14,450 plays",                 // can be static or added to DB schema later
                    description: "Test your speed and precision knowledge in this real-time arena challenge."
                }));
                
                setAllQuizzes(formattedQuizzes);
                setFilteredQuizzes(formattedQuizzes);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Backend unreachable or user unauthorized. Loading mock presets:", err);
                loadMockQuizCatalog();
            });
    }, []);

    // 2. Handle Frontend Filtering when clicking Category Tabs
    useEffect(() => {
        if (selectedCategory === "ALL ENTRIES") {
            setFilteredQuizzes(allQuizzes);
        } else {
            const updates = allQuizzes.filter(quiz => quiz.category === selectedCategory);
            setFilteredQuizzes(updates);
        }
    }, [selectedCategory, allQuizzes]);

    // Safety Fallback Framework to match your design screenshot while backend is connecting
    const loadMockQuizCatalog = () => {
        const mockArray = [
            { id: 1, title: "Slogans of the Nation", category: "GEOGRAPHY", plays: "14,450 plays", description: "Can you guess the state just by its official slogan?" },
            { id: 2, title: "Afrobeats Royalty", category: "ENTERTAINMENT", plays: "9,810 plays", description: "From Fela to the world stadium stages." },
            { id: 3, title: "The Road to 1960", category: "HISTORY", plays: "23,100 plays", description: "The heroes, movements, and milestones of independence." },
            { id: 4, title: "The 1996 Dream Team", category: "SPORTS", plays: "11,500 plays", description: "Relive Nigeria's historic Olympic Gold medal win." },
            { id: 5, title: "Yaba Silicon Ecosystem", category: "STEM", plays: "5,400 plays", description: "Startups, innovations, and tech founders." },
            { id: 6, title: "Phenomenal Women", category: "ICONS", plays: "8,250 plays", description: "Celebrating pioneers who transformed our landscape." }
        ];
        setAllQuizzes(mockArray);
        setFilteredQuizzes(mockArray);
        setLoading(false);
    };

    const handlePlayQuiz = (id) => {
        console.log(`Starting dynamic quiz interface container for Session reference ID: ${id}`);
        // This is where you will redirect users to the live active quiz room component later!
    };

    return (
        <>
            <Navbar />
            <div className="quiz-zone-page">
                <div className="container">
                    <div className="quizzing-top">
                        <div className="quizzing-header-text">
                            <h2>NAIJA <span className="gold-text">QUIZ ZONE</span></h2>
                            <p>Test your knowledge about Nigerian history, geography, music, sports, and more. Compete with thousands of players in real-time.</p>
                            
                            {/* Dynamic Filter Navigation Row */}
                            <div className="quizzing-categories">
                                <li 
                                    className={selectedCategory === "ALL ENTRIES" ? "active-category" : ""}
                                    onClick={() => setSelectedCategory("ALL ENTRIES")}
                                    style={{ cursor: "pointer" }}
                                >
                                    ALL ENTRIES
                                </li>
                                {categories.map((cat) => (
                                    <li 
                                        key={cat}
                                        className={selectedCategory === cat ? "active-category" : ""}
                                        onClick={() => setSelectedCategory(cat)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {cat}
                                    </li>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="quizzing-body">
                        <div className="quizzing-left">
                            <div className="quizzing-filter">
                                <div className="quizzing-filter-left">
                                    <button>Trending</button>
                                    <button>Newest</button>
                                </div>
                            </div>
                            
                            <div className="quizzing-grid">
                                {loading ? (
                                    <div className="loading-state">Syncing secure connection...</div>
                                ) : (
                                    /* Reuse or duplicate your grid mapping setup for Quiz lists */
                                    <QuizGrid items={filteredQuizzes} onPlay={handlePlayQuiz} />
                                )}
                            </div>
                        </div>
                        
                        {/* Perfect placement preservation for your shared Live Leaderboard component */}
                        <div className="quizzing-right">
                            <Leaderboard />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Quizpage;