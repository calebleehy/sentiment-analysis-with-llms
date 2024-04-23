import React from 'react';
import Plot from 'react-plotly.js';
import { useEffect, useState } from 'react';
import { getReviewData } from '../api/getData';

const ServiceCountsPlot = () => {
  
  //store review data into data
  const [data, setData] = useState([]);
  //fetch review data by getReviewData method
  const fetchData = async() => {
    try{
        const data = await getReviewData();
        const content = data.reviewData;
        setData(content);

    } catch (error){

    };
  };
  //load data everytime
  useEffect(() => {fetchData();}, []);
  
  const gxs = data.filter(item => item.sentiment === "Negative" && item.bank === 'GXS') //filtering for only GXS and negative sentiment
  const serviceCounts = gxs.reduce((acc, gxs) => { //gets frequency of each service
  const service = gxs.service;
  acc[service] = (acc[service] || 0) + 1;
    return acc;
  }, {});
  var topServices = Object.keys(serviceCounts) //gets top 2 most common service
            .sort(function(a, b) { return serviceCounts[b] - serviceCounts[a]; })
            .slice(0, 2);
  const data2=[
    {
      x: topServices.map(service => serviceCounts[service]),
      y: topServices,
      type: 'bar',
      orientation:'h',
      marker: {
      color: '#9754CB' 
    }
  }
];
const layout={
  width: 605, height: 300,
  title: {
    text:'Top 2 Services with Negative Sentiments',
    font: {
      color: 'white', // Set title text color to white,
    },
  },
  plot_bgcolor: 'rgb(25,25,26)', // Set plot background color to black
  paper_bgcolor: 'rgb(25,25,26)', // Set paper background color to black,
  xaxis: {
    title: {
      text: 'Count',
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
      font: {
        color: 'white', // Set y-axis text color to white
      },
    },
    tickfont: {
      color: 'white', // Set y-axis tick text color to white
    },
  },
};
var config ={
  responsive:true
};
return (
  <Plot
  data={data2}
  layout={layout}
  config={config}
  />
  );
};

export default ServiceCountsPlot;