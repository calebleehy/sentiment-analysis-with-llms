
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
            <h1>How does GXS stand against Trust?</h1>
            <div style={{ display: 'flex' }}>
              <div style={{ flex: 1,marginTop: '50px',marginLeft:'-30px' }}>
                <NPSScoreByBankPlot />
                </div>
                <div style={{ flex: 1,marginTop: '-90px'}}>
                  <BankComparisonServicePlot />
                  </div>
                  <div style={{ flex: 1, marginTop: '-90px'}}>
                    <BankComparisonIssuePlot />
                    </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between',marginLeft:'-30px',marginTop:'-50px'}}>
        <div style={{ flex: 1,marginLeft:'70px',marginTop:'-50px' }}>
          <p>GXS</p>
          <GXSTable />
        </div>
        <div style={{ flex: 1, marginTop:'-50px'}}>
          <p>Trust</p>
          <TrustTable />
        </div>
      </div>
      <div style={{marginTop:'10px'}}>
        <div style = {{marginRight:'50px'}}>
      <Plot
    data={[
      {
        type: 'table',
        columnwidth: [50, 50, 200],
        header: {
          values: columns.map(col => col.toUpperCase()),
          align: ['center'],
          line: { width: 1, color: 'black' },
          fill: { color: 'rgb(77, 6, 150)' },
          font: { family: 'Arial', size: 12, color: 'white' }
        },
        cells: {
          values:  columns.map((column) => lastEntry[column.toLowerCase()]),
          align: ['left'],
          line: { color: 'black', width: 1 },
          fill: { color: ['white', 'white', 'white']},
          font: { family: 'Arial', size: 11, color: ['black'] },
          height: 100 // Set cell height for each review
        }
      }
    ]}
    layout={{
      width: 600,
      height: 250,
      plot_bgcolor: 'black',
      paper_bgcolor: 'black',
      font: { color: 'white' },
      margin: { l: 0, r: 0, b: 0, t: 0 } // Set margin to 0
    }}
  />
  <WhatIfNPSPlot />
  </div>
  </div>
  </div>
)}

export default ComparisonPage;