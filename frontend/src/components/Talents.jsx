import './Talents.css'

const talentCategories = [
    { name: 'Music' },
    { name: 'Football Freestyle' },
    { name: 'Basketball Freestyle' },
    { name: 'Comedy' },
    { name: 'Visual Arts' },
    { name: 'Hair Artistry' },
    { name: 'Fashion' },
    { name: 'Film' },
    { name: 'Photography' },
    { name: 'Tech Innovation' },
    { name: 'Logo Design' }
];

function Talents() {
  return (
    <>
      <div className="talents">
        <div className="container">
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
      </div>
    </>
  )
}

export default Talents
