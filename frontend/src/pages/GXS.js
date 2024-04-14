import React from "react";
import Navigation from "../compoents/navigation";
import '../styles/App.css';
import ServiceCountsPlot from '../compoents/serviceCounts';
import IssueCountsPlot from '../compoents/issueCounts';
import NPSScorePlot from '../compoents/npsScore';
import BankNPSPlot from '../compoents/bankNPS';
import TopRecommendationsPlot from "../compoents/topRecommendations";
import GaugeChart from "../compoents/gauge";
import SentimentAnalysisPlot from "../compoents/sentimentAnalysis";
import DetailedTable from "../compoents/detailedTable";

const DashBoardPage = () => {
  return (
    <div>
      <Navigation />
      <h1>What are the most impactful areas to be addressed?</h1>
      <div className="dashboard">
        <div className = "row">
          <div style= {{ marginLeft:'60px'}}>
          <NPSScorePlot />
          </div>
          <div className = "row" style = {{marginTop:'-30px',marginLeft: '20px'}}>
          <SentimentAnalysisPlot />
          </div>
        
        <div style={{ marginLeft:'100px',marginTop:'-20px' }}>
        <ServiceCountsPlot />
        </div>   
        </div>      
          <div className = "row" style = {{marginTop:'50px'}}>
          <BankNPSPlot />
          <div style= {{marginLeft:'100px',marginTop:'130px'}}>
          <IssueCountsPlot />
          </div>     
        </div>
      </div>
      <div>
        <h1>All Reviews </h1>
        <div style={{marginTop:'20px'}}>
        <DetailedTable />
        </div>
      </div>
      <div className="row" style={{ display: 'flex',marginTop:'50px' }}>
          <div style={{ flex: 1}}>
            <h1> Our Recommendations</h1>
            <div style = {{marginLeft:'250px'}}>
            <TopRecommendationsPlot />
            </div>           
          </div>
          <div style={{ flex: 1,justifyContent: 'center' }}>
            <h1>Projected NPS if Recommendations were Implemented</h1>
            <GaugeChart />
          </div>
        </div>
    </div>
  );     
}

export default DashBoardPage;