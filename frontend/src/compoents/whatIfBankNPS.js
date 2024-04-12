import React from 'react';
import Plot from 'react-plotly.js';
import data from '../whatif_bank_nps.json';

const WhatIfNPSPlot = () => {
    const banks = data.map(data => data.bank);
    const nps = data.map(data => data.nps);
    const data2=[
    {
      x: banks,
      y: nps,
      type: 'bar',
      orientation:'v',
      marker: {
      color: banks.map(bank => bank === 'GXS' ? 'rgb(77, 6, 150)' : 'rgb(213, 166, 237)')
    }
  }
];
const layout={
  width: 450, height: 350,
  title: {
    text:'What-if NPS for Each Bank',
    font: {
      color: 'white', // Set title text color to white
    },
  },
  plot_bgcolor: 'black', // Set plot background color to black
  paper_bgcolor: 'black', // Set paper background color to black,
  xaxis: {
    title: {
      text: 'Bank',
      font: {
        color: 'white', // Set x-axis text color to white
      },
    },
    tickfont: {
      color: 'white', // Set x-axis tick text color to white
    },
    color: 'white'
  },
  yaxis: {
    color: 'white',
    title: {
      text: 'What-if NPS',
      font: {
        color: 'white', // Set y-axis text color to white
      },
    },
    tickfont: {
      color: 'white', // Set y-axis tick text color to white
    },
  },
}
return (
  <Plot
  data={data2}
  layout={layout}
  />
  );
};

export default WhatIfNPSPlot;