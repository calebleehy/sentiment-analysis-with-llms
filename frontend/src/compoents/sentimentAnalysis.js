import React, {useState} from 'react';
import Plot from 'react-plotly.js';
//import { getReviewData } from '../api/getData';
import data from '../full.json';

const SentimentAnalysisPlot = () => {
  
    //store review data into data
    /* const [data, setData] = useState([]);
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
    useEffect(() => {fetchData();}, []); */
    
    const gxs = data.filter(item => item.bank === 'GXS') //filtering for only GXS and negative sentiment
    const sentimentCounts = gxs.reduce((acc, gxs) => { //gets frequency of each service
    const sentiment = gxs.sentiment;
    acc[sentiment] = (acc[sentiment] || 0) + 1;
      return acc;
    }, {});
    const data2=[
      {
        x: Object.keys(sentimentCounts),
        y: Object.values(sentimentCounts),
        type: 'bar',
        orientation:'v',
        marker: {
        color: 'rgb(140, 81, 201' 
      }
    }
  ];
  const layout={
    width: 500, height: 350,
    title: {
      text:'Sentiment Analysis',
      font: {
        color: 'white', // Set title text color to white,
      },
    },
    plot_bgcolor: 'black', // Set plot background color to black
    paper_bgcolor: 'black', // Set paper background color to black,
    xaxis: {
        title: {
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
  }
  return (
    <Plot
    data={data2}
    layout={layout}
    />
    );
  };
  
  export default SentimentAnalysisPlot;