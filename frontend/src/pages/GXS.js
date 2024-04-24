import React from "react";
import Navigation from "../components/navigation";
import '../styles/App.css';
import ServiceCountsPlot from '../components/serviceCounts';
import IssueCountsPlot from '../components/issueCounts';
import NPSScorePlot from '../components/npsScore';
import BankNPSPlot from '../components/bankNPS';
import TopRecommendationsPlot from "../components/topRecommendations";
import GaugeChart from "../components/gauge";
import SentimentAnalysisPlot from "../components/sentimentAnalysis";
import DetailedTable from "../components/detailedTable";
import RatingsPlot from "../components/ratingCounts";
import { Container } from "react-bootstrap";

const DashBoardPage = () => {
  return (
    <div>
      <Navigation />
      <Container>
      <h1 style={{marginTop:'15vh',color:'#28104E'}}>What are the most impactful areas to be addressed?</h1>
      <Container>
      <div className="dashboard" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1vw', marginTop: '5vh' }}>
        <div style={{marginTop:'7vh',marginLeft:'2vw'}}>
          <h2 style={{ color: '#6237A0', fontSize: '2.5vw',marginBottom:'3.5vh'}}>Our Recommendations</h2>
          <TopRecommendationsPlot />
        </div>
        <div style={{marginLeft:'7vw',marginTop:'7vh'}}>
          <GaugeChart />
        </div>
      </div>
      </Container>
      <Container>
      <h2 style={{ color: '#6237A0', fontSize: '2.5vw',marginBottom:'4vh',marginLeft:'-4vw'}}>Your Bank Analysis</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1vw',marginTop:'-1vh',marginLeft:'-5.5vw' }}>
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
      </Container>
      <Container>
      <div style={{marginTop:'2vh',marginLeft:'-5.5vw'}}>
        <BankNPSPlot/>
      </div>
      </Container>
      <Container>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1vw',marginTop:'1vh',marginLeft:'-5.5vw'}}>
        <div style={{marginTop:'8vh'}}>
          <ServiceCountsPlot />
        </div>
        <div>
          <IssueCountsPlot />
        </div>
    </div>
    </Container>
    <div style={{marginTop:'5vh'}}>
      <h2 style={{ color: '#6237A0', fontSize: '2.5vw'}}>GXS Reviews</h2>
      <DetailedTable />
    </div>
    </Container>
    </div>
  );
}

export default DashBoardPage;