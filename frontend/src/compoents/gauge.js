import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import data from '../whatif_rec_nps.json';

const GaugeChart = () => {
    const [selectedRecommendation, setSelectedRecommendation] = useState('');
  
    const recommendations = data.map(item => item.recommendation);
  
    const handleChange = (event) => {
      setSelectedRecommendation(event.target.value);
    };
  
    const filteredData = data.find(item => item.recommendation === selectedRecommendation);
  
    return (
      <div>
        <select value={selectedRecommendation} onChange={handleChange}>
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
                mode: 'gauge+number',
                value: filteredData.nps,
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
