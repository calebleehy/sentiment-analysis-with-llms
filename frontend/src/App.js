import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import HomePage from './pages/homePage';
import AboutPage from './pages/aboutPage';
import DashBoardPage from './pages/dashBoardPage';
import VotingPage from './pages/votingPage';
import './styles/App.css';

function App() {
  return (

    <div className='app'>
      <Router>
        <Routes>
          <Route exact path='/' element={<HomePage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/dashboard' element={<DashBoardPage />} />
          <Route path='/voting' element={<VotingPage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
