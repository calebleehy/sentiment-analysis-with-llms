import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import data from '../whatif_rec_nps.json';
import bankData from  '../bank_nps.json'

const GaugeChart = () => {
    const [selectedRecommendation, setSelectedRecommendation] = useState('');
    const firstTwoRec =  data.slice(0, 2);
    const recommendations = firstTwoRec.map(item => item.recommendation);
    const gxs = bankData.find(item => item.bank === 'GXS');
    const gxsNPS = gxs ? gxs.nps : null;
    const handleChange = (event) => {
      setSelectedRecommendation(event.target.value);
    };
  
    const filteredData = firstTwoRec.find(item => item.recommendation === selectedRecommendation);
  
    return (
      <div>
        <select value={selectedRecommendation} onChange={handleChange} style={{ width: '300px' }}>
          <option value="">Select Recommendation</option>
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
                  bar: { color: 'purple' },
                  bgcolor: 'black',
                  bordercolor: 'white',        
                }
              }
            ]}
            layout={{ 
              width: 400, height: 300,
              margin: { t: 0, b: 0},
              plot_bgcolor: 'black', // Set plot background color to black
        paper_bgcolor: 'black', // Set paper background color to black
             }}
          />
        )}
      </div>
    );
  };
  
  export default GaugeChart;
