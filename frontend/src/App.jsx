import { div } from 'framer-motion/client';
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from 'react';


const Home = lazy(() => import('./pages/Home')); 
const Voting = lazy(() =>  import ('./pages/Voting'));
const Quizpage = lazy(() =>  import ('./pages/Quizpage'));
const ActiveQuizPlay = lazy(() =>  import ('./pages/ActiveQuiz'));
const TalentDetails = lazy(() =>  import ('./pages/TalentDetails'));
const Iconspage = lazy(() =>  import ('./pages/Iconspage'));
const Champions = lazy(() =>  import ('./pages/Champions'));
// import Quizpage from './pages/Quizpage';
// import TalentDetails from './pages/TalentDetails';
// import Iconspage from './pages/Iconspage';
// import Champions from './pages/Champions';
// import LiveQuizPlay from './pages/LiveQuiz';

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
    <h2>Loading Naija Ceelbrates</h2>
  </div>
)

function App() {
  return (
    // 2. Wrap everything inside BrowserRouter
    <BrowserRouter>
    <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path='/' element={ <Home /> } />
          <Route path='/voting' element={ <Voting /> } />
          <Route path='/quiz' element={ <Quizpage /> } />
          <Route path='/livequiz' element={ <ActiveQuizPlay /> } />
          <Route path='/details/:id' element={ <TalentDetails /> } />
          <Route  path='/icons' element={<Iconspage />}/>
          <Route  path='/champions' element={<Champions />}/>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App