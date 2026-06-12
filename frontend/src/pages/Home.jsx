import Champs from '../components/Champs'
import CTA from '../components/CTA'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import Icons from '../components/Icons'
import Navbar from '../components/Navbar'
import Quiz from '../components/Quiz'
import Talents from '../components/Talents'
// import Votes from '../components/Votes'
import './Home.css'

function Home() {
  return (
    <>
        <Navbar />
        <Hero />
        <Talents />
        <Quiz />
        {/* <Votes /> */}
        <Icons />
        <Champs />
        <CTA />
        <Footer />
    </>
  )
}

export default Home
