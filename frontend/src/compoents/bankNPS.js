import React from 'react';
import Plot from 'react-plotly.js';
//import { getMonthNps } from '../api/getData';
import { useEffect, useState } from 'react';
import data from '../month_nps.json';

const BankNPSPlot = () => {
  //store review data into data
  /* const [data, setData] = useState([]);
  //fetch review data by getReviewData method
  
  //load data everytime
  useEffect(() => {
    const fetchData = async() => {
      try{
          const data = await getMonthNps();
          const content = data.monthNpsData;
          setData(content);
  
        } catch (error){
  
        };
      };

    fetchData();

  }, []); */
  const month = data.map(data => data.month);
  const nps = data.map(data => data.nps);
  var sum = nps.reduce((acc, val) => acc + val, 0);
  var average = sum / nps.length;
  const data2= [
    {
      x: month,
      y: nps,
      type: 'scatter',
      line: {
        color: '#6237A0',
        width: 2
      },
      name: 'NPS',
    },
    {
      x: month,
      y: Array(month.length).fill(average),
      type: 'scatter',
      mode: 'lines',
      name: 'Average',
      line: {
        dash: 'dash'
      }
    }
];

const layout={
  width: 1225, height: 400,
  title: {
    text:'GXS Bank NPS over Time',
    font: {
      color: 'white', // Set title text color to white
    },
  },
  plot_bgcolor: 'rgb(25, 25, 26)', // Set plot background color to black
  paper_bgcolor: 'rgb(25, 25, 26)', // Set paper background color to black
  xaxis: {
    color: 'white',
    title: {
      text: 'Month-Year',
      font: {
        color: 'white', // Set x-axis text color to white
      },
    },
    tickfont: {
      color: 'white', // Set x-axis tick text color to white
    },
  },
  yaxis: {
    title: {
      text: 'NPS',
      font: {
        color: 'white', // Set y-axis text color to white
      },
    },
    tickfont: {
      color: 'white', // Set y-axis tick text color to white
    },
    color: 'white',
  },
}
return (
  <Plot
  data={data2}
  layout={layout}
  />
  );
};

export default BankNPSPlot;