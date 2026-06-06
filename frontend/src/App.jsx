import './App.css'
// 1. Add BrowserRouter to your imports
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Home from './pages/Home'
import Voting from './pages/Voting'
import Quizpage from './pages/Quizpage';

function App() {
  return (
    // 2. Wrap everything inside BrowserRouter
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Home /> } />
        {/* <Route path='/upload' element={ <Home /> } /> */}
        <Route path='/voting' element={ <Voting /> } />
        <Route path='/quiz' element={ <Quizpage /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App