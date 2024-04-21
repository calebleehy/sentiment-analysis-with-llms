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
            bar: { color: '#6237A0' },
            bgcolor: 'black',
            bordercolor: 'white',
            
          }
        },
      ];
    const layout={
        width: 400, height: 300,
        plot_bgcolor: 'rgb(25, 25, 26)', // Set plot background color to black
        paper_bgcolor: 'rgb(25, 25, 26)', // Set paper background color to black,
        margin: { t: 80, b: 80, l: 50, r: 50 }
      }
return (
  <Plot
  data={data2}
  layout={layout}
  />
  );
};

export default NPSScorePlot;