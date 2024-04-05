import React from 'react';
import Plot from 'react-plotly.js';
import data from '../data.json';

const IssueCountsPlot = () => {
    const gxs = data.filter(item => item.bank === 'GXS') //filtering for only GXS data
    const issueTypeCount = gxs.reduce((acc, gxs) => { //gets frequency of each issue
    const issue = gxs.issue;
    acc[issue] = (acc[issue] || 0) + 1;
      return acc;
    }, {});
    const issueTypes = Object.keys(issueTypeCount); 
    const issueCounts = Object.values(issueTypeCount);
  const data2=[
    {
      x: issueTypes,
      y: issueCounts,
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
    text:'Frequency of Issue',
    font: {
      color: 'white', // Set title text color to white
    },
  },
  plot_bgcolor: 'black', // Set plot background color to black
  paper_bgcolor: 'black', // Set paper background color to black
  xaxis: {
    color: 'white',
    title: {
      text: 'Issue',
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
      text: 'Count',
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

export default IssueCountsPlot;