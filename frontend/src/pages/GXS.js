import React from "react";
import Navigation from "../compoents/navigation";
import '../styles/App.css';
import Plot from 'react-plotly.js';
import ServiceCountsPlot from '../compoents/serviceCounts';
import IssueCountsPlot from '../compoents/issueCounts';
import NPSScorePlotPlot from '../compoents/npsScore';

const DashBoardPage = () => {
  return (
    <div>
      <Navigation />
      <h1>What are the most impactful areas to be addressed?</h1>
      <div className="dashboard">
        <div className = "row">
        <NPSScorePlotPlot />
        </div>      
          <div className = "row">
          <ServiceCountsPlot />
          </div>
          <div className = "row">
          <IssueCountsPlot />
          </div>       
        </div>
      </div>
  );     
}

export default DashBoardPage;