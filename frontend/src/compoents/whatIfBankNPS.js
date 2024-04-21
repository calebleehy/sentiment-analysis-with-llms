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
      color: banks.map(bank => bank === 'GXS' ? '#6237A0' : '#9754CB')
    }
  }
];
const layout={
  width: 400, height: 300,
  title: {
    text:'Projected GXS NPS if Recommendations <br>were Implemented',
    font: {
      color: 'white', // Set title text color to white
    },
  },
  plot_bgcolor: 'rgb(25,25,26)', // Set plot background color to black
  paper_bgcolor: 'rgb(25,25,26)', // Set paper background color to black,
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