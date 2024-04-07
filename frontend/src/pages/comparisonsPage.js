
import React,{ useState, useEffect} from "react";
import Navigation from "../compoents/navigation";
import '../styles/App.css';
import BankComparisonServicePlot from "../compoents/bankComparisonService";
import NPSScoreByBankPlot from "../compoents/npsScoreByBank";
import BankComparisonIssuePlot from "../compoents/bankComparisonbyIssue";
import GXSTable from "../compoents/gxsTable";
import TrustTable from "../compoents/trustTable";
import MaribankTable from "../compoents/mariBankTable";

const ComparisonPage = () => {
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
                    <div className = "table-container" style={{display: "flex",marginTop:'-90px'}}>
                      <div className = "table" style={{ flex: 1,marginLeft:'-30px' }}>
                      <p>GXS</p>
                      <GXSTable />
                      </div>   
                      <div className = "table" style={{ flex: 1 }}>   
                      <p>Trust</p> 
                      <TrustTable />     
                    </div>
                    <div className = "table" style={{ flex: 1 }}>   
                      <p>Maribank</p> 
                      <MaribankTable />     
                    </div>
                      
                    
                    </div>
                    </div>
        )}

export default ComparisonPage;