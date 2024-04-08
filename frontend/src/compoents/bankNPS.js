import React from 'react';
import Plot from 'react-plotly.js';
import { getMonthNps } from '../api/getData';
import { useEffect, useState } from 'react';

const BankNPSPlot = () => {
  //store review data into data
  const [data, setData] = useState([]);
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

  }, []);
  const month = data.map(data => data.month);
  const nps = data.map(data => data.nps);
  const data2= [
    {
      x: month,
      y: nps,
      type: 'scatter',
      line: {
        color: 'rgb(140, 81, 201)',
        width: 2
      }
    }
];
const layout={
  width: 750, height: 400,
  title: {
    text:'GXS Bank NPS Score over Time',
    font: {
      color: 'white', // Set title text color to white
    },
  },
  plot_bgcolor: 'black', // Set plot background color to black
  paper_bgcolor: 'black', // Set paper background color to black
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
      text: 'NPS Score',
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