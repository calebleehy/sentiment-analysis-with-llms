import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { getBankNpsData } from '../api/getData';

const NPSScoreByBankPlot = () => {

  //store review data into data
  const [data, setData] = useState([]);
  //fetch review data by getReviewData method

  //load data everytime
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBankNpsData();
        const content = data.bankNpsData;
        setData(content);

      } catch (error) {

      };
    };

    fetchData();

  }, []);
  const banks = data.map(data => data.bank);
  const nps = data.map(data => data.nps);
  const data2 = [
    {
      x: banks,
      y: nps,
      type: 'bar',
      orientation: 'v',
      marker: {
        color: banks.map(bank => bank === 'GXS' ? '#6237A0' : '#9754CB')
      },
      responsive: false
    }
  ];
  const layout = {
    width: 400, height: 300,
    title: {
      text: 'NPS Score by Bank',
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
        text: 'NPS Score',
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

export default NPSScoreByBankPlot;