import React from 'react';
import Plot from 'react-plotly.js';
import data from '../bank_nps.json';

const NPSScorePlot = () => {
  const gxs = data.find(item => item.bank === 'GXS');
  const data2 =[
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: gxs ? gxs.nps : 0,
          title: { text: "Overall NPS",
          font: {
            color: 'white',
            size: 20
          },},
          number: { font: { color: 'white' } },
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: { range: [-100, 100],tickwidth: 1, tickcolor: 'white', tickfont: { color: 'white' }},
            bar: { color: 'rgb(140, 81, 201)' },
            bgcolor: 'black',
            bordercolor: 'white',
            
          }
        },
      ];
    const layout={
        width: 500, height: 300,
        plot_bgcolor: 'black', // Set plot background color to black
        paper_bgcolor: 'black', // Set paper background color to black
      }
return (
  <Plot
  data={data2}
  layout={layout}
  />
  );
};

export default NPSScorePlot;