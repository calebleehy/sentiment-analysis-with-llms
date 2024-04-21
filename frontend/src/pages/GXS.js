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
import RatingsPlot from "../compoents/ratingCounts";

const DashBoardPage = () => {
  return (
    <div>
      <Navigation />
      <h1 style={{marginTop:'60px',color:'#28104E'}}>What are the most impactful areas to be addressed?</h1>
      <div className="dashboard" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '50px' }}>
        <div style={{marginTop:'35px',marginLeft:'8px'}}>
          <h2 style={{ color: '#6237A0', fontSize: '30px',marginBottom:'20px'}}>Our Recommendations</h2>
          <TopRecommendationsPlot />
        </div>
        <div style={{marginLeft:'100px',marginTop:'40px'}}>
          <GaugeChart />
        </div>
      </div>
      <h2 style={{ color: '#6237A0', fontSize: '30px',marginBottom:'30px',marginLeft:'-30px'}}>Your Bank Analysis</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px',marginTop:'-10px' }}>
        <div style={{marginLeft:'-40px'}}>
          <NPSScorePlot />
        </div>
        <div style={{marginLeft:'-10px'}}>
          <SentimentAnalysisPlot />
        </div>
        <div  style={{marginLeft:'-10px'}}>
          <RatingsPlot />
        </div>
      </div>
      <div style={{marginTop:'20px',marginLeft:'-40px'}}>
        <BankNPSPlot/>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px',marginTop:'20px'}}>
        <div style={{marginLeft:'-40px',marginTop:'35px'}}>
          <ServiceCountsPlot />
        </div>
        <div style={{marginLeft:'-10px',marginTop:'-11px'}}>
          <IssueCountsPlot />
        </div>
    </div>
    <div style={{marginTop:'30px'}}>
      <h2 style={{ color: '#6237A0', fontSize: '30px',marginBottom:'30px',marginLeft:'-5px'}}>GXS Reviews</h2>
      <DetailedTable />
    </div>
    </div>
  );
}

export default DashBoardPage;