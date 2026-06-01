import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import Talents from '../components/Talents'
import Votes from '../components/Votes'
import './Home.css'

function Home() {
  return (
    <>
        <Navbar />
        <Hero />
        <Talents />
        <Votes />
    </>
  )
}

export default Home
