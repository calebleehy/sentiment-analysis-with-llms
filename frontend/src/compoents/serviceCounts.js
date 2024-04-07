import React from 'react';
import Plot from 'react-plotly.js';
import data from '../full.json';

const ServiceCountsPlot = () => {
  const gxs = data.filter(item => item.bank === 'GXS') //filtering for only GXS data
  const serviceTypeCount = gxs.reduce((acc, gxs) => { //gets frequency of each service
  const service = gxs.service;
  acc[service] = (acc[service] || 0) + 1;
    return acc;
  }, {});
  const serviceTypes = Object.keys(serviceTypeCount); 
  const serviceCounts = Object.values(serviceTypeCount);
  const data2=[
    {
      x: serviceTypes,
      y: serviceCounts,
      type: 'bar',
      orientation:'v',
      marker: {
      color: 'purple' 
    }
  }
];
const layout={
  width: 500, height: 350,
  title: {
    text:'Frequency of Service',
    font: {
      color: 'white', // Set title text color to white
    },
  },
  plot_bgcolor: 'black', // Set plot background color to black
  paper_bgcolor: 'black', // Set paper background color to black,
  xaxis: {
    title: {
      text: 'Service',
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
      text: 'Count',
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

export default ServiceCountsPlot;