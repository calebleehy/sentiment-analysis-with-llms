import React from "react";
import Navigation from "../compoents/navigation";
import '../styles/App.css';
import BankComparisonServicePlot from "../compoents/bankComparisonService";
import NPSScoreByBankPlot from "../compoents/npsScoreByBank";
import BankComparisonIssuePlot from "../compoents/bankComparisonbyIssue";
import GXSTable from "../compoents/gxsTable";
import TrustTable from "../compoents/trustTable";
import MaribankTable from "../compoents/mariBankTable";
import WhatIfNPSPlot from "../compoents/whatIfBankNPS";
import data from "../serv_issue_rec.json";
import Plot from 'react-plotly.js';

const ComparisonPage = () => {
  const lastEntry = data[data.length - 1];
  const columns = Object.keys(lastEntry).map(name => ({ name, title: name.charAt(0).toUpperCase() + name.slice(1) }));
  const rows = [{ id: 0, ...lastEntry }];
    return (
        <div>
            <Navigation/>
            <h1>How does GXS stand against Trust and Maribank?</h1>
            <div style={{ display: 'flex' }}>
              <div style={{ flex: 1,marginTop: '50px',marginLeft:'-30px' }}>
                <NPSScoreByBankPlot />
                </div>
                <div style={{ flex: 1, marginTop: '-90px'}}>
                  <BankComparisonServicePlot />
                  </div>
                  <div style={{ flex: 1, marginTop: '-90px'}}>
                    <BankComparisonIssuePlot />
                    </div>
                    </div>
                    <div classname = "table-container" style={{display: "flex",marginTop:'-90px'}}>
                      <div classname = "table" style={{ flex: 1,marginLeft:'-30px' }}>
                      <p>GXS</p>
                      <GXSTable />
                      </div>   
                      <div classname = "table" style={{ flex: 1 }}>   
                      <p>Trust</p> 
                      <TrustTable />     
                    </div>
                    <div classname = "table" style={{ flex: 1 }}>   
                      <p>Maribank</p> 
                      <MaribankTable />
                      <div style={{ display: 'flex', marginTop: '20px' }}>
                <div style={{ flex: 1,marginLeft:'-800px',marginTop:'30px' }}>
                <Plot
    data={[
      {
        type: 'table',
        columnwidth: [50, 50, 200],
        header: {
          values: columns.map(column => column.title),
          align: ['center'],
          line: { width: 1, color: 'black' },
          fill: { color: 'purple' },
          font: { family: 'Arial', size: 12, color: 'white' }
        },
        cells: {
          values: columns.map(column => rows.map(row => row[column.name])),
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
                  
                </div>
                <div style={{ flex: 1, marginLeft:'150px'}}>
                    <WhatIfNPSPlot />
                </div>
            </div>
                           
                    </div>
                    </div>
                    </div>
        )}

export default ComparisonPage;