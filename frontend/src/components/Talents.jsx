import './Talents.css'

const talentCategories = [
    { name: 'Music', icon: '🎵' },
    { name: 'Football Freestyle', icon: '⚽' },
    { name: 'Basketball Freestyle', icon: '🏀' },
    { name: 'Comedy', icon: '😂' },
    { name: 'Visual Arts', icon: '🎨' },
    { name: 'Hair Artistry', icon: '💇' },
    { name: 'Fashion', icon: '👗' },
    { name: 'Film', icon: '🎬' },
    { name: 'Photography', icon: '📸' },
    { name: 'Tech Innovation', icon: '💻' },
    { name: 'Logo Design', icon: '💡' }
];

function Talents() {
  return (
    <>
      <div className="talents">
        <div className="talents-header">
            <h1>Naija Talent Zone</h1>
            <p>Explore incredible talents across 11 categories. From music to tech innovation, find the best of Nigerian creativity.</p>
        </div>
        <div className="talents-grid">
          {talentCategories.map((category, index) => (
            <div key={index} className="talent-card">
              <span className="talent-icon">{category.icon}</span>
              <h3>{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Talents
