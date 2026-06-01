import CTA from '../components/CTA'
import Hero from '../components/Hero'
import Icons from '../components/Icons'
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
        <Icons />
        <CTA />
    </>
  )
}

export default Home
