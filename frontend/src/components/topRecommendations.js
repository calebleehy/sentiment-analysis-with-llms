import React from 'react';
import Plot from 'react-plotly.js';
import { getServIssueRec } from '../api/getData';
import { useState, useEffect } from 'react';

const TopRecommendationsPlot = () => {
  //store review data into data
  const [data, setData] = useState([0]);
  //fetch review data by getReviewData method
  const fetchData = async() => {
    try{
        const data = await getServIssueRec();
        const content = data.servIssueRecData;
        setData(content);

    } catch (error){

    };
  }; 
  //load data everytime
  useEffect(() => {fetchData();}, []);
  const firstTwoEntries = data.slice(0, 2);
  const columns = ["Service", "Issue", "Recommendation"];
  return (
    <Plot
    data={[
      {
        type: 'table',
        columnwidth: [50,50,200],
        header: {
          values: columns.map(col => col.toUpperCase()),
          align: ['center'],
          line: { width: 1, color: 'white' },
          fill: { color: '#28104E' },
          font: { family: 'Arial', size: 12, color: 'white' }
        },
        cells: {
          values:columns.map((column) =>
          firstTwoEntries.map((row) => row[column.toLowerCase()])),
          line: { color: 'white', width: 1 },
          fill: { color: ['rgb(25,25,26)']},
          font: { family: 'Arial', size: 12, color: ['white'] },
          height: 100 // Set cell height for each review
        }
      }
    ]}
    layout={{
      width: 600,
      height: 300,
      plot_bgcolor: 'black',
      paper_bgcolor: 'black',
      font: { color: 'white' },
      margin: { l: 0, r: 0, b: 0, t: 0 } // Set margin to 0
    }}
    config ={{
      responsive:true
    }}
  />
  );
};

export default TopRecommendationsPlot;