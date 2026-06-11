import './App.css'
// 1. Add BrowserRouter to your imports
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Home from './pages/Home'
import Voting from './pages/Voting'
import Quizpage from './pages/Quizpage';
import TalentDetails from './pages/TalentDetails';
import Icons from './pages/Icons';
import Champions from './pages/Champions';
import LiveQuizPlay from './pages/LiveQuiz';

function App() {
  return (
    // 2. Wrap everything inside BrowserRouter
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Home /> } />
        <Route path='/voting' element={ <Voting /> } />
        <Route path='/quiz' element={ <Quizpage /> } />
        <Route path='/livequiz' element={ <LiveQuizPlay /> } />
        <Route path='/details/:id' element={ <TalentDetails /> } />
        <Route  path='/icons' element={<Icons />}/>
        <Route  path='/champions' element={<Champions />}/>
        {/* <Route path='/upload' element={ <Home /> } /> */}
        <Route path='/voting' element={ <Home /> } />
        {/* <Route path='/quiz' element={ <Home /> } /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App