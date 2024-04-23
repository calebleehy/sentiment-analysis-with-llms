import React,{ useState, useEffect} from 'react';
import Plot from 'react-plotly.js';
import { getBankServiceFreq } from '../api/getData';

const BankComparisonServicePlot = () => {
  //store review data into data
  const [data, setData] = useState([]);
  //fetch review data by getReviewData method
  
  //load data everytime
  useEffect(() => {
    const fetchData = async() => {
      try{
          const data = await getBankServiceFreq();
          const content = data.bankServiceFreqData;
          setData(content);
  
        } catch (error){
  
        };
      };

    fetchData();

  }, []); 
  const services = Array.from(new Set(data.map(item => item.service)));
  const banks = Array.from(new Set(data.map(item => item.bank)));
  const bankColors = {
    "GXS": '#6237A0',
    "Trust": '#9754CB',
  };
  const data2 = banks.map(bank => ({
    x: services,
    y: services.map(service => {
      const dataPoint = data.find(item => item.bank === bank && item.service === service);
      return dataPoint ? dataPoint['frequency (%)'] : 0;
    }),
    name: bank,
    type: 'bar',
    marker: { color: bankColors[bank] }
  }));
  const layout = {
    width: 400, height: 300,
    barmode: 'group',
    title: {
      text: 'Proportion of Service (%) with <br /> Negative Sentiments' ,
      font: {
        color: 'white', // Set title text color to white
      },
    },
    plot_bgcolor: 'rgb(25,25,26)', // Set plot background color to black
    paper_bgcolor: 'rgb(25,25,26)', // Set paper background color to black,
    xaxis: {
      title: {
        text: 'Service',
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
        text: 'Proportion of Service (%)',
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
  };
  var config ={
    responsive:true
  };

  return (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Plot data={data2} layout={layout} config={config}/>
      </div>
    )}
  
  
  export default BankComparisonServicePlot;