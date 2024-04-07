import React from "react";
import Navigation from "../compoents/navigation";
import '../styles/App.css';
import data from '../full.json';
import ServiceCountsPlot from '../compoents/serviceCounts';
import IssueCountsPlot from '../compoents/issueCounts';
import NPSScorePlot from '../compoents/npsScore';
import BankNPSPlot from '../compoents/bankNPS';
import TopRecommendationsPlot from "../compoents/topRecommendations";

const DashBoardPage = () => {
  return (
    <div>
      <Navigation />
      <h1>What are the most impactful areas to be addressed?</h1>
      <div className="dashboard">
        <div className = "row">
        <NPSScorePlot />
        <div style={{ marginLeft:'100px',marginTop:'100px' }}>
        <ServiceCountsPlot />
        </div>   
        </div>      
          <div className = "row">
          <BankNPSPlot />
          <div style= {{marginLeft:'100px'}}>
          <IssueCountsPlot />

          </div>     
        </div>
      </div>
      <div classname = "row" style = {{alignItems: 'center',justifyContent: 'center',display: 'flex'}}>
          <TopRecommendationsPlot />
        </div>
      </div>
  );     
}

export default DashBoardPage;