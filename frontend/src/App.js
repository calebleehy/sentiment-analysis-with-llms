import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import HomePage from './pages/homePage';
import AboutPage from './pages/aboutPage';
import DashBoardPage from './pages/dashBoardPage';
import DetailedPage from './pages/detailedPage';
import RecommendationPage from './pages/recommendationPage';
import ComparisonPage from './pages/comparisonsPage';
import StatisticsPage from './pages/statisticsPage';
import './styles/App.css';

function App() {
  return (

    <div className='app'>
      <Router>
        <Routes>
          <Route exact path='/' element={<HomePage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/dashboard' element={<DashBoardPage />} />
          <Route path='/detailed' element={<DetailedPage/>} />
          <Route path='/recommendation' element={<RecommendationPage/>} />
          <Route path='/comparisons' element={<ComparisonPage/>} />
          <Route path='/statistics' element={<StatisticsPage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
