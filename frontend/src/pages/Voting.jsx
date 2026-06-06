import React, { useState, useEffect } from "react";
import Leaderboard from "../components/Leaderboard";
import Navbar from "../components/Navbar";
import VotingGrid from "../components/votingGrid";
import "./Voting.css";

function Voting() {
    const [candidates, setCandidates] = useState([]);
    // Set "ALL ENTRIES" as your default opening view to match the design screenshot
    const [selectedCategory, setSelectedCategory] = useState("ALL ENTRIES");
    const [loading, setLoading] = useState(true);

    const categories = ["MUSIC", "ARTWORK", "COMEDY", "FOOTBALL", "FASHION", "LOGO", "PHOTO", "FILM", "SPORTS"];

    useEffect(() => {
        setLoading(true);

        // Helper function to format database raw structures to frontend variables
        const formatItem = (item) => ({
            id: item.id,
            name: item.name || "Anonymous",
            category: item.category,
            votes: item.vote_count, // Maps his database 'vote_count'
            hasVoted: false,
        });

        // --- FETCHING LOGIC BRIDGING ---
        if (selectedCategory === "ALL ENTRIES") {
            // Map every single category string to its own individual fetch promise array
            const fetchPromises = categories.map((cat) =>
                fetch(`http://localhost:8000/api/v1/leaderboard/talent/${cat}?limit=20`)
                    .then((res) => (res.ok ? res.json() : []))
                    .catch(() => []) // Silently catch offline errors per category stream
            );

            // Wait for all separate endpoint lines to resolve
            Promise.all(fetchPromises)
                .then((results) => {
                    // Flatten out the multidimensional array [[Music Acts], [Comedy Acts]] into one flat deck
                    const allEntries = results.flat();

                    if (allEntries.length === 0) {
                        loadAllMockData();
                        return;
                    }

                    const formattedData = allEntries.map(formatItem);
                    setCandidates(formattedData);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Backend connection failure:", err);
                    loadAllMockData();
                });
        } else {
            // Standard individual category fetch execution path
            fetch(`http://localhost:8000/api/v1/leaderboard/talent/${selectedCategory}?limit=20`)
                .then((res) => {
                    if (!res.ok) throw new Error("Failed to fetch data");
                    return res.json();
                })
                .then((data) => {
                    if (data.length === 0) {
                        loadSingleCategoryMockData(selectedCategory);
                        return;
                    }

                    const formattedData = data.map(formatItem);
                    setCandidates(formattedData);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Backend offline, loading category mock variables:", err);
                    loadSingleCategoryMockData(selectedCategory);
                });
        }
    }, [selectedCategory]);

    // --- SAFETY NET OFFLINE FALLBACK GENERATORS ---
    const loadAllMockData = () => {
        setCandidates([
            { id: 1, name: "Anwar (Mock)", category: "MUSIC", votes: 14450, hasVoted: false },
            { id: 2, name: "Bisi (Mock)", category: "ARTWORK", votes: 12300, hasVoted: false },
            { id: 3, name: "Chidi (Mock)", category: "COMEDY", votes: 9800, hasVoted: false, isMostVoted: true },
            { id: 4, name: "Davido (Mock)", category: "FOOTBALL", votes: 8400, hasVoted: false },
            { id: 5, name: "Efe (Mock)", category: "FASHION", votes: 5200, hasVoted: false }
        ]);
        setLoading(false);
    };

    const loadSingleCategoryMockData = (cat) => {
        setCandidates([
            { id: 1, name: `Anwar (${cat} Mock)`, category: cat, votes: 14450, hasVoted: false },
            { id: 2, name: `Bisi (${cat} Mock)`, category: cat, votes: 12300, hasVoted: false },
            { id: 3, name: `Chidi (${cat} Mock)`, category: cat, votes: 9800, hasVoted: false }
        ]);
        setLoading(false);
    };

    const handleVote = (id) => {
        setCandidates((prev) =>
            prev.map((candidate) => {
                if (candidate.id === id) {
                    return {
                        ...candidate,
                        votes: candidate.votes + 1,
                        hasVoted: true,
                    };
                }
                return candidate;
            })
        );
    };

    return (
        <>
            <Navbar />
            <div className="voting">
                <div className="container">
                    <div className="voting-top">
                        <div className="voting-header-text">
                            <h2>NAIJA <span>TALENT ZONE</span></h2>
                            <p>Showcase your talent, vote for the best, and celebrate Nigerian culture on Africa's biggest digital platform.</p>
                            
                            {/* Dynamic Category Tabs Panel Container */}
                            <div className="voting-categories">
                                {/* Explicitly render the ALL ENTRIES root choice anchor element */}
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
                                {loading ? (
                                    <div className="loading-state">Fetching live entries...</div>
                                ) : (
                                    <VotingGrid candidates={candidates} onVote={handleVote} />
                                )}
                            </div>
                        </div>
                        
                        <div className="voting-right">
                            <Leaderboard candidates={candidates} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Voting;