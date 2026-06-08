import React, { useState, useEffect } from "react";
import Leaderboard from "../components/Leaderboard";
import Navbar from "../components/Navbar";
import QuizGrid from "../components/QuizGrid";
import ActiveQuizPlay from "../pages/ActiveQuiz"; 
import "./Quizpage.css";

// Import assets needed for the Talent Leaderboard mock data fallbacks
import image from "../assets/girl.png";
import avatar from "../assets/avatar.png";

function Quizpage() {
    // Quiz Catalog States
    const [allQuizzes, setAllQuizzes] = useState([]);
    const [filteredQuizzes, setFilteredQuizzes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("ALL ENTRIES");
    const [quizzesLoading, setQuizzesLoading] = useState(true);

    // 🌟 Shared Talent Leaderboard States
    const [leaderboardCandidates, setLeaderboardCandidates] = useState([]);
    const [leaderboardLoading, setLeaderboardLoading] = useState(true);

    // Dynamic View Router Simulation State
    const [activeQuizSession, setActiveQuizSession] = useState(null); 

    const quizCategories = ["HISTORY", "GEOGRAPHY", "ENTERTAINMENT", "SPORTS", "STEM", "ICONS"];
    const talentCategories = ["Music", "Artwork", "Comedy", "Football", "Fashion", "Logo", "Photo", "Film", "Sports"];

    // 1. Load Quiz Catalog on mount
    useEffect(() => {
        setQuizzesLoading(true);
        loadMockQuizCatalog();
    }, []);

    // 2. Fetch Global Talent Leaderboard data on mount (identical to Voting Page)
    useEffect(() => {
        setLeaderboardLoading(true);

        const formatTalentItem = (item) => ({
            id: item.id,
            name: item.name || "Anonymous",
            category: item.category,
            votes: item.vote_count, 
            hasVoted: false,
            rank: "1", 
            image: image, 
            creator: { name: "Anwar", avatar: avatar }, 
            votersCountString: "1K",
        });

        // Map talent categories to fetch promises matching your API structure
        const fetchPromises = talentCategories.map((cat) =>
            fetch(`http://localhost:8000/api/v1/leaderboard/talent/${cat}?limit=20`)
                .then((res) => (res.ok ? res.json() : []))
                .catch(() => [])
        );

        Promise.all(fetchPromises)
            .then((results) => {
                const allEntries = results.flat();

                if (allEntries.length === 0) {
                    loadTalentMockData();
                    return;
                }

                const formattedData = allEntries.map(formatTalentItem);
                setLeaderboardCandidates(formattedData);
                setLeaderboardLoading(false);
            })
            .catch((err) => {
                console.error("Quiz Page Leaderboard fetch failure:", err);
                loadTalentMockData();
            });
    }, []);

    // 3. Handle Quiz Filtering
    useEffect(() => {
        if (selectedCategory === "ALL ENTRIES") {
            setFilteredQuizzes(allQuizzes);
        } else {
            const updates = allQuizzes.filter(quiz => quiz.category === selectedCategory);
            setFilteredQuizzes(updates);
        }
    }, [selectedCategory, allQuizzes]);

    // Mock Data Builders
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
        setQuizzesLoading(false);
    };

    const loadTalentMockData = () => {
        setLeaderboardCandidates([
            { id: 1, title: "Anwar's Manager", description: "MUSIC", votes: 14450, rank: "1", image: image, creator: { name: "Anwar", avatar: avatar }, votersCountString: "1K" },
            { id: 2, title: "Bisi's Friend", description: "ARTWORK", votes: 12300, rank: "2", image: image, creator: { name: "Bisi", avatar: avatar }, votersCountString: "921" },
            { id: 3, title: "Chidi's Sister", description: "COMEDY", votes: 9800,  rank: "3", image: image, creator: { name: "Chidi", avatar: avatar }, votersCountString: "850" },
            { id: 4, title: "Davido's Manager", description: "FOOTBALL", votes: 8400, rank: "4", image: image, creator: { name: "Davido", avatar: avatar }, votersCountString: "921" },
            { id: 5, title: "Efe's Mom", description: "FASHION", votes: 5200,  rank: "5", image: image, creator: { name: "Efe", avatar: avatar }, votersCountString: "1K" },
        ]);
        setLeaderboardLoading(false);
    };

    const handlePlayQuiz = (id) => {
        const selectedQuiz = allQuizzes.find(q => q.id === id);
        setActiveQuizSession(selectedQuiz);
    };

    const handleExitQuizView = () => {
        setActiveQuizSession(null);
    };

    if (activeQuizSession) {
        return <ActiveQuizPlay quiz={activeQuizSession} onExit={handleExitQuizView} />;
    }

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="quiz-zone-page">
                    <div className="quizzing-first">
                        <div className="quizzing-top">
                            <div className="quizzing-header-text">
                                <h2>NAIJA <span className="gold-text">QUIZ ZONE</span></h2>
                                <p>Test your knowledge about Nigerian history, geography, music, sports, and more. Compete with thousands of players in real-time.</p>
                                
                                <div className="quizzing-categories">
                                    <li 
                                        className={selectedCategory === "ALL ENTRIES" ? "active-category" : ""}
                                        onClick={() => setSelectedCategory("ALL ENTRIES")}
                                        style={{ cursor: "pointer" }}
                                    >
                                        ALL ENTRIES
                                    </li>
                                    {quizCategories.map((cat) => (
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
                            
                                <div className="quizzing-filter">
                                    <div className="quizzing-filter-left">
                                        <button>Trending</button>
                                        <button>Newest</button>
                                    </div>
                                </div>
                                <div className="quizzing-grid">
                                    {quizzesLoading ? (
                                        <div className="loading-state">Loading active sessions...</div>
                                    ) : (
                                        <QuizGrid items={filteredQuizzes} onPlay={handlePlayQuiz} />
                                    )}
                                </div>
                            
                        </div>
                            
                        </div>
                    <div className="quizzing-leaderboard">
                        {leaderboardLoading ? (
                        <div className="loading-state">Syncing Leaderboard...</div>
                        ) : (
                            <Leaderboard 
                                candidates={leaderboardCandidates}
                                totalEntries={48} 
                                categoriesCount={11}
                                votingEndsString="03d 04h"
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Quizpage;