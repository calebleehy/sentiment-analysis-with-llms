import React from 'react';
import Plot from 'react-plotly.js';
import { getWhatifBankNps } from '../api/getData';
import { useState, useEffect } from 'react';

const WhatIfNPSPlot = () => {
  //store review data into data
  const [data, setData] = useState();
  // fetch review data by getReviewData method

  // load data everytime
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWhatifBankNps();
        const content = data.wahtifBankNpsData;
        setData(content);
        console.log(data)

      } catch (error) {
        console.log('Data before useEffect:', data)
      };
    };

    fetchData();


  }, []);
  console.log(data)
  const banks = data?data.map(item => item.bank): [];
  const nps = data?data.map(item => item.nps):[];
  const data2 = [
    {
      x: banks,
      y: nps,
      type: 'bar',
      orientation: 'v',
      marker: {
        color: banks.map(bank => bank === 'GXS' ? '#6237A0' : '#9754CB')
      }
    }
  ];
  const layout = {
    width: 400, height: 300,
    title: {
      text: 'Projected GXS NPS if Recommendations <br>were Implemented',
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
  };
  var config = {
    responsive: true
  };
  return (
    <Plot
      data={data2}
      layout={layout}
      config={config}
    />
  );
};

export default WhatIfNPSPlot;