import React from 'react';
import Plot from 'react-plotly.js';

const NPSScorePlot = () => {
    const data2 =[
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: 60,
          title: { text: "NPS",
          font: {
            color: 'white',
          },},
          number: { font: { color: 'white' } },
          type: "indicator",
          mode: "gauge+number",
          delta: { reference: 100 },
          gauge: {
            axis: { range: [-100, 100],tickwidth: 1, tickcolor: 'white', tickfont: { color: 'white' }},
            bar: { color: 'purple' },
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