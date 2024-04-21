
import React from "react";
import Navigation from "../compoents/navigation";
import '../styles/App.css';
import BankComparisonServicePlot from "../compoents/bankComparisonService";
import NPSScoreByBankPlot from "../compoents/npsScoreByBank";
import BankComparisonIssuePlot from "../compoents/bankComparisonbyIssue";
import GXSTable from "../compoents/gxsTable";
import TrustTable from "../compoents/trustTable";
import WhatIfNPSPlot from "../compoents/whatIfBankNPS";
import data from "../serv_issue_rec.json";
import Plot from 'react-plotly.js';

const ComparisonPage = () => {
  const lastEntry = data[data.length - 1];
  const columns = ["Service", "Issue", "Recommendation"];
    return (
        <div>
            <Navigation/>
            <h1 style = {{marginTop:'60px'}}>How does GXS stand against Trust?</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginTop: '20px' }}>
        <div style={{marginTop:'40px',marginLeft:'10px'}}>
          <h2 style={{ color: '#6237A0', fontSize: '30px' }}>Our Recommedation</h2>
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
        <div style={{marginLeft:'160px'}}>
          <WhatIfNPSPlot />
        </div>
      </div>
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px',marginTop:'20px' }}>
    <div style={{marginLeft:'-40px',marginTop:'30px'}}>
      <NPSScoreByBankPlot />
    </div>
    <div style={{marginLeft:'-10px',marginTop:'-112px'}}>
      <BankComparisonServicePlot />
    </div>
      <div  style={{marginLeft:'-10px',marginTop:'-10px'}}>
    <BankComparisonIssuePlot/>
    </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between',marginLeft:'-30px',marginTop:'-50px'}}>
      <div style={{ flex: 1,marginLeft:'70px',marginTop:'-40px' }}>
        <p style={{color:'#6237A0',fontSize:'30px'}}><strong>GXS</strong></p>
        <GXSTable />
      </div>
      <div style={{ flex: 1, marginTop:'-40px'}}>
        <p style={{color:'#9754CB',fontSize:'30px'}}><strong>Trust</strong></p>
        <TrustTable />
      </div>
    </div>
      
  </div>
)}

export default ComparisonPage;