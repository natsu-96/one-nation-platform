import React, { useState, useEffect } from "react";
import Leaderboard from "../components/Leaderboard";
import Navbar from "../components/Navbar";
import VotingGrid from "../components/votingGrid";
import image from "../assets/girl.png";
import avatar from "../assets/avatar.png";
import "./Voting.css";
import CustomDropdown from "../components/CustomDropdown";

function Voting() {
    const [candidates, setCandidates] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All Entries");
    const [loading, setLoading] = useState(true);

    const categories = ["Music", "Artwork", "Comedy", "Football", "Fashion", "Logo", "Photo", "Film", "Sports"];

    useEffect(() => {
        setLoading(true);

        const formatItem = (item) => ({
            id: item.id,
            title: item.name || "Anonymous Project", // Map name to title consistently
            category: item.category,
            description: `An exceptional ${item.category || "talent"} entry showcase directly from the community.`,
            votes: item.vote_count || 0,
            hasVoted: false,
            rank: item.rank || "#1", 
            image: image, 
            creator: { 
                name: item.creator_name || "Anwar", 
                avatar: avatar 
            }, 
            votersCountString: "1K",
        });

        if (selectedCategory === "All Entries") {
            const fetchPromises = categories.map((cat) =>
                fetch(`http://localhost:8000/api/v1/leaderboard/talent/${cat}?limit=20`)
                    .then((res) => (res.ok ? res.json() : []))
                    .catch(() => [])
            );

            Promise.all(fetchPromises)
                .then((results) => {
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

    const loadAllMockData = () => {
        setCandidates([
            { id: 1, title: "Naija Soul – Orginal Afrobeat", description: "Music should be listened to and shared for everyone to enjoy", votes: 12440, rank: "1", image: image, creator: { name: "Kim", avatar: avatar }, votersCountString: "1K" },
            { id: 2, title: "Lagos Sunrise Canvas Art", description: "Capturing the vibrant golden hours of Lagos marina traffic.", votes: 8300, rank: "2", image: image, creator: { name: "Bisi", avatar: avatar }, votersCountString: "921" },
            { id: 3, title: "Super Eagles Standup Set", description: "Hilarious breakdown of football watch-parties across mainland bars.", votes: 6100, rank: "3", image: image, creator: { name: "Chidi", avatar: avatar }, votersCountString: "850" },
        ]);
        setLoading(false);
    };

    const loadSingleCategoryMockData = (cat) => {
        setCandidates([
            { id: 1, title: `Anwar's Showcase Project`, description: `Premium high-fidelity production within the ${cat} category space.`, votes: 14450, rank: "1", image: image, creator: { name: "Anwar", avatar: avatar }, votersCountString: "1K" },
            { id: 2, title: `Bisi Masterpiece Draft`, description: `Exploring expressions and stylized layers under ${cat}.`, votes: 12300, rank: "2", image: image, creator: { name: "Bisi", avatar: avatar }, votersCountString: "921" }
        ]);
        setLoading(false);
    };

    const handleVote = (id) => {
        setCandidates((prev) =>
            prev.map((cand) => (cand.id === id ? { ...cand, votes: cand.votes + 1, hasVoted: true } : cand))
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
                                <div className="voting-categories">
                                    <li className={selectedCategory === "All Entries" ? "active-category" : ""} onClick={() => setSelectedCategory("All Entries")}>All Entries</li>
                                    {categories.map((cat) => (
                                        <li key={cat} className={selectedCategory === cat ? "active-category" : ""} onClick={() => setSelectedCategory(cat)}>{cat}</li>
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
                                <div className="voting-filter-right"><CustomDropdown /></div>
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
                        <Leaderboard candidates={candidates}/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Voting;