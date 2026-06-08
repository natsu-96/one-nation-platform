import React, { useState, useEffect } from "react";
import Leaderboard from "../components/Leaderboard";
import Navbar from "../components/Navbar";
import VotingGrid from "../components/votingGrid";
import image from "../assets/girl.png"
import avatar from "../assets/avatar.png"
import "./Voting.css";
import CustomDropdown from "../components/CustomDropdown";

function Voting() {
    const [candidates, setCandidates] = useState([]);
    // Set "ALL ENTRIES" as your default opening view to match the design screenshot
    const [selectedCategory, setSelectedCategory] = useState("All Entries");
    const [loading, setLoading] = useState(true);

    const categories = ["Music", "Artwork", "Comedy", "Football", "Fashion", "Logo", "Photo", "Film", "Sports"];

    useEffect(() => {
        setLoading(true);

        // Helper function to format database raw structures to frontend variables
        const formatItem = (item) => ({
            id: item.id,
            name: item.name || "Anonymous",
            category: item.category,
            votes: item.vote_count, // Maps his database 'vote_count'
            hasVoted: false,
            rank: "1", 
            image: image, 
            creator: { 
                name: "Anwar", avatar: avatar 
            }, 
            votersCountString: "1K",
        });

        // --- FETCHING LOGIC BRIDGING ---
        if (selectedCategory === "All Entries") {
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
            { id: 1, title: "Anwar's Manager", description: "MUSIC", votes: 14450, rank: "1", image: image, creator: { name: "Anwar", avatar: avatar }, votersCountString: "1K" },
            { id: 2, title: "Bisi's Friend", description: "ARTWORK", votes: 12300, rank: "2", image: image, creator: { name: "Bisi", avatar: avatar }, votersCountString: "921" },
            { id: 3, title: "Chidi's Sister", description: "COMEDY", votes: 9800,  rank: "3", image: image, creator: { name: "Chidi", avatar: avatar }, votersCountString: "850" },
            { id: 4, title: "Davido's Manager", description: "FOOTBALL", votes: 8400, rank: "4", image: image, creator: { name: "Davido", avatar: avatar }, votersCountString: "921" },
            { id: 5, title: "Efe's Mom", description: "FASHION", votes: 5200,  rank: "5", image: image, creator: { name: "Efe", avatar: avatar }, votersCountString: "1K" },
        ]);
        setLoading(false);
    };

    const loadSingleCategoryMockData = (cat) => {
        setCandidates([
            { id: 1, title: `Anwar (${cat} Mock)`, description: cat, votes: 14450, rank: "#1", image: image, creator: { name: "Anwar", avatar: "" }, votersCountString: "1K" },
            { id: 2, title: `Bisi (${cat} Mock)`, description: cat, votes: 12300,  rank: "#2", image: image, creator: { name: "Bisi", avatar: "" }, votersCountString: "921" },
            { id: 3, title: `Chidi (${cat} Mock)`, description: cat, votes: 9800, rank: "#3", image: image, creator: { name: "Chidi", avatar: "" }, votersCountString: "850" }
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
            <div className="container">
                <div className="voting">
                    <div className="voting-first">
                        <div className="voting-top">
                            <div className="voting-header-text">
                                <h2>NAIJA <span>TALENT ZONE</span></h2>
                                <p>Showcase your talent, vote for the best, and celebrate Nigerian culture on Africa's biggest digital platform.</p>
                                
                                {/* Dynamic Category Tabs Panel Container */}
                                <div className="voting-categories">
                                    {/* Explicitly render the ALL ENTRIES root choice anchor element */}
                                    <li 
                                        className={selectedCategory === "All Entries" ? "active-category" : ""}
                                        onClick={() => setSelectedCategory("All Entries")}
                                        style={{ cursor: "pointer" }}
                                    >
                                        All Entries
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
                            
                                <div className="voting-filter">
                                    <div className="voting-filter-left">
                                        <button>Trending</button>
                                        <button>Newest</button>
                                        <button>Most Voted</button>
                                    </div>
                                    <div className="voting-filter-right">
                                        <CustomDropdown />
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
                    </div>
                    <div className="vote-leaderboard">
                        <Leaderboard  candidates={candidates}/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Voting;