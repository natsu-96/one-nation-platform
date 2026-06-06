import './App.css'
// 1. Add BrowserRouter to your imports
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Home from './pages/Home'
import Voting from './pages/Voting'

function App() {
  return (
    // 2. Wrap everything inside BrowserRouter
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Home /> } />
        {/* <Route path='/upload' element={ <Home /> } /> */}
        <Route path='/voting' element={ <Voting /> } />
        {/* <Route path='/quiz' element={ <Home /> } /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App