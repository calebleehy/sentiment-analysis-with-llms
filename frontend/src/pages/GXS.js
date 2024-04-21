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
      <h1 style={{marginTop:'15vh',color:'#28104E'}}>What are the most impactful areas to be addressed?</h1>
      <div className="dashboard" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1vw', marginTop: '5vh' }}>
        <div style={{marginTop:'7vh',marginLeft:'2vw'}}>
          <h2 style={{ color: '#6237A0', fontSize: '2.5vw',marginBottom:'3.5vh'}}>Our Recommendations</h2>
          <TopRecommendationsPlot />
        </div>
        <div style={{marginLeft:'7vw',marginTop:'7vh'}}>
          <GaugeChart />
        </div>
      </div>
      <h2 style={{ color: '#6237A0', fontSize: '2.5vw',marginBottom:'4vh',marginLeft:'-4vw'}}>Your Bank Analysis</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1vw',marginTop:'-1vh',marginLeft:'-4vw' }}>
        <div>
          <NPSScorePlot />
        </div>
        <div>
          <SentimentAnalysisPlot />
        </div>
        <div>
          <RatingsPlot />
        </div>
      </div>
      <div style={{marginTop:'2vh',marginLeft:'-4vw'}}>
        <BankNPSPlot/>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1vw',marginTop:'1vh',marginLeft:'-4vw'}}>
        <div style={{marginTop:'8vh'}}>
          <ServiceCountsPlot />
        </div>
        <div>
          <IssueCountsPlot />
        </div>
    </div>
    <div style={{marginTop:'5vh'}}>
      <h2 style={{ color: '#6237A0', fontSize: '2.5vw'}}>GXS Reviews</h2>
      <DetailedTable />
    </div>
    </div>
  );
}

export default DashBoardPage;