import React,{ useState } from "react";
import Navigation from "../compoents/navigation";
import recommendation from '../serv_issue_rec.json';
import Plot from 'react-plotly.js';
import NPSScorePlot from "../compoents/npsScore";
import data from '../whatif_rec_nps.json';
import bankData from  '../bank_nps.json';
import '../styles/App.css';


const SummaryPage = () => {
    const columns = ["Service", "Issue", "Recommendation"];
    const [selectedRecommendation, setSelectedRecommendation] = useState(data[3]["recommendation"]);
    const recommendations = data.map(item => item.recommendation);
    const gxs = bankData.find(item => item.bank === 'GXS');
    const gxsNPS = gxs ? gxs.nps : null;
    const handleChange = (event) => {
      setSelectedRecommendation(event.target.value);
    };
  
    const filteredData = data.find(item => item.recommendation === selectedRecommendation);
    return (
        <div>
            <Navigation />
            <h1 style={{marginTop:'60px'}}>Summary of Recommendations</h1>
            <div style={{ display: 'flex',flexDirection: 'row',justifyContent: 'center',marginTop:'50px'}}>
            <Plot
    data={[
      {
        type: 'table',
        columnwidth: [200,200,500],
        header: {
          values: columns.map(col => col.toUpperCase()),
          align: ['center'],
          line: { width: 1, color: 'white' },
          fill: { color: '#28104E' },
          font: { family: 'Arial', size: 12, color: 'white' }
        },
        cells: {
          values: columns.map((column) =>
          recommendation.map((row) => row[column.toLowerCase()])),
          align: ['left'],
          line: { color: 'white', width: 1 },
          fill: { color: ['rgb(25,25,26)']},
          font: { family: 'Arial', size: 11, color: ['white'] },
          height: 80 // Set cell height for each review
        }
      }
    ]}
    layout={{
      width: 600,
      height: 300,
      plot_bgcolor: 'black',
      paper_bgcolor: 'black',
      font: { color: 'white' },
      margin: { l: 0, r: 0, b: 0, t: 0 } // Set margin to 0
    }}
  />
  </div>
  <div style={{ display: 'flex',flexDirection: 'column',justifyContent: 'space-between',marginTop:'40px',marginRight:'500px',marginLeft:'100px'}}>
    <NPSScorePlot />
  <div style ={{marginRight:'200px',flexDirection: 'column',marginLeft:'500px',marginTop:'-330px'}}>
  <select className="custom-select" value={selectedRecommendation} onChange={handleChange} style={{ width: '400px' }}>
          {recommendations.map((recommendation, index) => (
            <option key={index} value={recommendation}>{recommendation}</option>
          ))}
        </select>
        {filteredData && (
                <Plot
                    data={[
                        {
                            type: 'indicator',
                            mode: 'gauge+number+delta',
                            value: filteredData.nps,
                            delta: { reference: gxsNPS },
                            title: { text: "What-if NPS",
                                font: {
                                    color: 'white',
                                },},
                            number: { font: { color: 'white' } },
                            gauge: {
                                axis: { range: [-100, 100],tickwidth: 1, tickcolor: 'white', tickfont: { color: 'white' }},
                                bar: { color: '#9754CB' },
                                bgcolor: 'black',
                                bordercolor: 'white',
                            }
                        }
                    ]}
                    layout={{
                        width: 400, height: 300,
                        margin: { t: 0, b: 0},
                        plot_bgcolor: 'rgb(25,25,26)', // Set plot background color to black
                        paper_bgcolor: 'rgb(25,25,26)', // Set paper background color to black
                    }}
                />
                  )}
                  </div>
                  </div>
                </div>
    );
}

export default SummaryPage;