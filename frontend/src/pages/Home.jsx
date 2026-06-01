import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import Quiz from '../components/Quiz'
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
        <Quiz />
    </>
  )
}

export default Home
