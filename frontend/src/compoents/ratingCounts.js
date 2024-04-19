import React, {useState} from 'react';
import Plot from 'react-plotly.js';
//import { getReviewData } from '../api/getData';
import data from '../full.json';

const RatingsPlot = () => {
  
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
    
    const gxs = data.filter(item => item.bank === 'GXS') //filtering for only GXS
    const ratingCounts = gxs.reduce((acc, gxs) => { //gets frequency of each rating
    const rating = gxs.rating;
    acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {});
    const data2=[
      {
        x: Object.keys(ratingCounts),
        y: Object.values(ratingCounts),
        type: 'bar',
        orientation:'v',
        marker: {
        color: 'rgb(140, 81, 201)' 
      }
    }
  ];
  const layout={
    width: 400, height: 300,
    title: {
      text:'Count of Ratings',
      font: {
        color: 'white', // Set title text color to white,
      },
    },
    plot_bgcolor: 'rgb(25, 25, 26)', // Set plot background color to black
    paper_bgcolor: 'rgb(25, 25, 26)', // Set paper background color to black,
    xaxis: {
        title: {
          font: {
            color: 'white', // Set x-axis text color to white
          },
        },
        tickfont: {
          color: 'white', // Set x-axis tick text color to white
        },
        color: 'white',
        automargin: true,
        range: [1, 5],
      },
      yaxis: {
        color: 'white',
        automargin: true,
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
  
  export default RatingsPlot;