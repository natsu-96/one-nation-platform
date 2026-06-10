import './Champions.css'
import avatar from '../assets/avatar.png'
import Navbar from '../components/Navbar';
import CustomDropdown from '../components/CustomDropdown';

const championsData = [
    {
        avatar: avatar, 
        name: "Kennedy",
        votes: 150499
    },
    {
        avatar: avatar, 
        name: "Yaounde",
        votes: 12967
    },
    {
        avatar: avatar, 
        name: "Noyi",
        votes: 85032
    },
     {
        avatar: avatar, 
        name: "Waldo",
        votes: 5409
    },
     {
        avatar: avatar, 
        name: "L-loyd",
        votes: 7764
    }
];

function Champions () {
    const sortedChampions = [...championsData].sort((a,b) => b.votes - a.votes);
    return (
        <>
        <Navbar />
        <div className="champion-page-top">
            <CustomDropdown />
        </div>
        <div className="container">
            <div className="champions-header">
                <div className="title-section">
                    <h2 className='champions-title'>Naija Champs</h2>
                    <p className='champions-description'>See the latest updates on our champion contestants</p>
                </div>
                    <span className="champions-badge">● Live Leaderboard</span>
                </div>
            <div className="champions">
                <div className="champions-board">
                    {championsData.map((champs, index) => (
                        <div className="champions-row">
                            <div className="champ-left">
                                <span className='champ-rank'>{index + 1}</span>
                                <div className="champ-image">
                                    <img src={champs.avatar} alt={champs.name} />
                                </div>
                                <p className='champ-name'>{champs.name}</p>
                            </div>
                            <div className="champ-right">
                                <span className='champ-votes'>{champs.votes.toLocaleString()}Votes</span>
                            </div>
                        </div>
                    ))}
                </div>
                </div>
            </div>
        </>
    )
}

export default Champions