
import React from "react";
import Navigation from "../components/navigation";
import '../styles/App.css';
import BankComparisonServicePlot from "../components/bankComparisonService";
import NPSScoreByBankPlot from "../components/npsScoreByBank";
import BankComparisonIssuePlot from "../components/bankComparisonbyIssue";
import GXSTable from "../components/gxsTable";
import TrustTable from "../components/trustTable";
import WhatIfNPSPlot from "../components/whatIfBankNPS";
import Plot from 'react-plotly.js';
import { Container } from "react-bootstrap";
import { getServIssueRec } from "../api/getData";
import { useState, useEffect } from "react";
const ComparisonPage = () => {

    //store review data into data
    const [data, setData] = useState([{'Service':'', 'Issue':'', 'Recommendation':'' }]);
    //fetch review data by getReviewData method
  
    //load data everytime
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getServIssueRec();
          const content = data.servIssueRecData;
          setData(content);
  
        } catch (error) {
  
        };
      };
  
      fetchData();
  
    }, []);
    console.log(data)

  const lastEntry = data[data.length - 1];
  const columns = ["Service", "Issue", "Recommendation"];
    return (
        <div>
            <Navigation/>
            <h1 style = {{marginTop:'15vh'}}>How does GXS stand against Trust?</h1>
            <Container>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1vw', marginTop: '7vh' }}>
        <div style={{marginTop:'8vh',marginLeft:'-0.5vw'}}>
          <h2 style={{ color: '#6237A0', fontSize: '2.5vw',marginTop:'2vh' }}>Our Recommedation</h2>
          <Plot
            data={[
              {
                type: 'table',
                columnwidth: [300, 300, 1000],
                header: {
                  values: columns.map(col => col.toUpperCase()),
                  align: ['center'],
                  line: { width: 1, color: 'white' },
                  fill: { color: '#28104E' },
                  font: { family: 'Arial', size: 12, color: 'white' }
                },
                cells: {
                  values: columns.map((column) => lastEntry[column.toLowerCase()]),
                  align: ['left'],
                  line: { color: 'white', width: 1 },
                  fill: { color: ['rgb(25,25,26)'] },
                  font: { family: 'Arial', size: 11, color: ['white'] },
                  height: 100 // Set cell height for each review
                }
              }
            ]}
            layout={{
              width: 600,
              height: 130,
              plot_bgcolor: 'rgb(25,25,26)',
              paper_bgcolor: 'rgb(25,25,26)',
              font: { color: 'white' },
              margin: { l: 0, r: 0, b: 0, t: 0 } // Set margin to 0
            }}
          />
        </div>
        <div style={{marginLeft:'12vw'}}>
          <WhatIfNPSPlot />
        </div>
      </div>
      </Container>
      <Container>
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1vw',marginTop:'7vh',marginLeft:'-5vw'}}>
    <div>
      <NPSScoreByBankPlot />
    </div>
    <div style={{marginTop:'-24.2vh'}}>
      <BankComparisonServicePlot />
    </div>
      <div style={{marginTop:'-7.2vh'}}>
    <BankComparisonIssuePlot/>
    </div>
    </div>
    </Container>
    <Container>
    <div style={{ display: 'flex', justifyContent: 'space-between',marginLeft:'2vw',marginTop:'-10vh'}}>
      <div style={{ flex: 1}}>
        <p style={{color:'#6237A0',fontSize:'2.5vw'}}><strong>GXS</strong></p>
        <GXSTable />
      </div>
      <div style={{ flex: 1}}>
        <p style={{color:'#9754CB',fontSize:'2.5vw'}}><strong>Trust</strong></p>
        <TrustTable />
      </div>
    </div>
    </Container>
  </div>
)}

export default ComparisonPage;