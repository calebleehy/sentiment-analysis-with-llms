import React,{ useState, useEffect} from 'react';
import Plot from 'react-plotly.js';
//import { getBankIssueFreq } from '../api/getData';
import data from '../bank_serv_issue_freq.json';

const BankComparisonIssuePlot = () => {
  //store review data into data
  /* const [data, setData] = useState([]);
  //fetch review data by getReviewData method
  
  //load data everytime
  useEffect(() => {
    const fetchData = async() => {
      try{
          const data = await getBankIssueFreq();
          const content = data.bankIssueFreqData;
          setData(content);
  
        } catch (error){
  
        };
      };

    fetchData();

  }, []); */
  const issues = Array.from(new Set(data.map(item => item.issue)));
  const banks = Array.from(new Set(data.map(item => item.bank)));
  const bankColors = {
    "GXS": 'rgb(77, 6, 150)',
    "Trust": 'rgb(140, 81, 201)',
  };
  const traces = banks.map(bank => ({
    x: issues,
    y: issues.map(issue => {
      const dataPoint = data.find(item => item.bank === bank && item.issue === issue);
      return dataPoint ? dataPoint['frequency (%)'] : 0;
    }),
    name: bank,
    type: 'bar',
    marker: { color: bankColors[bank] },
    orientation: 'v'
  }));
  const layout = {
    width: 500, height: 400,
    barmode: 'group',
    title: {
      text: 'Proportion of Issue (%) for Each Bank' ,
      font: {
        color: 'white', // Set title text color to white
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
        text: 'Proportion of Issue (%)',
        font: {
          color: 'white', // Set y-axis text color to white
        },
      },
      tickfont: {
        color: 'white', // Set y-axis tick text color to white
      },
    },
    legend: {
      font: { color: 'white' } // Set legend text color to white
    },
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Plot data={traces} layout={layout}/>

    </div> 
);
};    

export default BankComparisonIssuePlot;