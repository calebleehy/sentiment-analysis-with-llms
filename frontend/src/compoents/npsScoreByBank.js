import React from 'react';
import Plot from 'react-plotly.js';
import data from '../bank_nps.json';

const NPSScoreByBankPlot = () => {
    const bank = data.map(data => data.bank);
    const nps = data.map(data => data.nps);
    const data2= [
      {
        x: bank,
        y: nps,
        type: 'bar',
        orientation:'v',
        marker: {
        color: 'rgb(77, 6, 150)' 
      }
    }
  ];
  const layout={
    width: 400, height: 300,
    title: {
      text:'NPS by Bank',
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
        text: 'NPS Score',
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
  
  export default NPSScoreByBankPlot;