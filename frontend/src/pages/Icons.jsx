import { useState, useEffect } from "react"
import "./Icons.css"
import Navbar from "../components/Navbar"
import IconsGrid from "../components/IconsGrid"
import CustomDropdown from "../components/CustomDropdown"
import IconsLeaderboard from "../components/IconsLeaderboard"
import { Link } from "react-router-dom"
import icon from '../assets/icon.png'

function Icons() {
    const [icons, setIcons] = useState([]);
    const [selectedNiche, setSelectedNiche] = useState("All");
    const [loading, setLoading] = useState(true);

    const niches = ["Music", "Artwork", "Comedy", "Football", "Fashion", "Logo", "Photo", "Film", "Sports"];

    useEffect(() => {
        setLoading(true);

        const formatIcon = (icon) => ({
            id: icon.id,
            name: icon.name || "Anon Icon",
            niche: icon.niche,
            bio: icon.bio,
            votes: icon.vote_count || 0,
            hasVoted: false,
            img: icon,
            votersCountString: "1K",
        });

        if (selectedNiche === "All") {
            const fetchPromises = niches.map((niche) =>
            fetch(`http://localhost:8000/api/v1/leaderboard/talent/${niche}?limit=20`)
                .then((res) => (res.ok ? res.json() : []))
                .catch(() => [])
            );

            Promise.all(fetchPromises)
                .then((results) => {
                    const allNiches = results.flat();
                    if (allNiches.length === 0) {
                        loadAllMockIcons();
                        return;
                    }
                    const formattedIcons = allNiches.map(formatIcon);
                    setIcons(formattedIcons);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("backend connection failed!", err);
                    loadAllMockIcons();
                });
        } else {
            fetch(`http://localhost:8000/api/v1/leaderboard/talent/${selectedNiche}?limit=20`)
            .then((res) => {
                if (!res.ok) throw new Error("failed to get data");
                return res.json();
            })
            .then((data) => {
                if (data.length === 0) {
                    loadSingleNicheMockData(selectedNiche);
                    return;
                }
                const formattedIcons = data.map(formatIcons);
                setIcons(formattedIcons);
                setLoading(false);
            });
        }

    }, [selectedNiche]);

    const loadAllMockIcons = () => {
        setIcons([
            {id:1, name:"John Doe", niche:"Music", bio:"A talented musician", votes:1000, img: icon, votersCountString:"1K", position: "5"},
            {id:1, name:"Doe Jean", niche:"Medicine", bio:"A registered nurse", votes:5000, img: icon, votersCountString:"5K", position: "4"},
            {id:1, name:"John Deer", niche:"Natural Science", bio:"A botanist", votes:10000, img: icon, votersCountString:"50K", position: "2"},
            {id:1, name:"Deer Doe", niche:"VisualArts", bio:"A talented artist", votes:15000, img: icon, votersCountString:"15K", position: "3"},
            {id:1, name:"John Jean", niche:"Sports", bio:"An exceptional athlete", votes:349000, img: icon, votersCountString:"349K", position: "1"}
        ]);
        setLoading(false);
    };

    const loadSingleNicheMockData = (niche) => {
        setIcons([
            {id:1, name:"John Doe", niche:niche, bio:`A talented ${niche} icon`, votes:1000, img: icon, votersCountString:"1K", position: "5"},
            {id:1, name:"Doe Jean", niche:niche, bio:`A registered ${niche} icon`, votes:5000, img: icon, votersCountString:"5K", position: "4"},
        ]);
        setLoading(false);
    };

    const handleVote = (id) => {
        setIcons((prevIcons) =>
            prevIcons.map((icon) =>
                icon.id === id
                    ? {
                        ...icon,
                        votes: icon.hasVoted ? icon.votes - 1 : icon.votes + 1,
                        hasVoted: !icon.hasVoted,
                    }
                    : icon
            )
        );
    }
    return (
        <>
            <Navbar />
            <div className="icons">
            <div className="container">
                    <div className="icons-first">
                        <div className="icons-top">
                            <div className="icons-header-text">
                                <h2>NAIJA <span>TALENT ZONE</span></h2>
                                <p>Showcase your talent, vote for the best, and celebrate Nigerian culture on Africa's biggest digital platform.</p>
                                <div className="icons-niches">
                                    <li className={selectedNiche === "All Entries" ? "active-category" : ""} onClick={() => setSelectedNiche("All Entries")}>All Entries</li>
                                    {niches.map((niche) => (
                                        <li key={niche} className={selectedNiche === niche ? "active-category" : ""} onClick={() => setSelectedNiche(niche)}>{niche}</li>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="icons-body">
                            <div className="icons-filter">
                                <div className="icons-filter-left">
                                    <button>Trending</button>
                                    <button>Newest</button>
                                    <button>Most Voted</button>
                                </div>
                                <div className="icons-filter-right"><CustomDropdown /></div>
                            </div>
                            <div className="grid-content">
                                {loading ? (
                                    <div className="loading-state">Fetching live entries...</div>
                                ) : (
                                    <IconsGrid icons={icons} onVote={handleVote} />
                                )}
                            </div>
                        </div>
                    </div>
                    {/* <div className="icon-leaderboard">
                        <IconsLeaderboard icons={icons}/>
                    </div> */}
                </div>
            </div>
        </>
    )
}

export default Icons

