import React from 'react';
import Plot from 'react-plotly.js';
import data from '../full.json';
//import { getReviewData } from '../api/getData';

const ServiceCountsPlot = () => {
  
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
      color: 'purple' 
    }
  }
];
const layout={
  width: 500, height: 350,
  title: {
    text:'Top 2 Most Frequent Services from Reviews',
    font: {
      color: 'white', // Set title text color to white,
    },
  },
  plot_bgcolor: 'black', // Set plot background color to black
  paper_bgcolor: 'black', // Set paper background color to black,
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
      text: 'Service',
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