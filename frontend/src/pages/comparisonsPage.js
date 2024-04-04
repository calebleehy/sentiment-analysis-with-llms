import React,{ useState } from "react";
import Navigation from "../compoents/navigation";
import '../styles/App.css';
import Plot from 'react-plotly.js';
import data from '../data.json'


const ComparisonPage = () => {
  const [frequencyData, setFrequencyData] = useState(null);
  
  const countFrequency = () => {
    const freqMap = data.reduce((acc, item) => {
      if (!acc[item.bank]) {
        acc[item.bank] = {};
      }
      acc[item.bank][item.service] = (acc[item.bank][item.service] || 0) + 1;
      return acc;
    }, {});
    const colors = ['rgb(77, 6, 150)','rgb(140, 81, 201)','rgb(52, 3, 102)'];

    // Convert frequency map to Plotly data format
    const data2 = Object.keys(freqMap).map((bank, index) => ({
      x: Object.keys(freqMap[bank]),
      y: Object.values(freqMap[bank]),
      type: 'bar',
      name: bank,
      marker: { color: colors[index] } // Set color for each bank
    }));

    setFrequencyData(data2);
  };
    return (
        <div>
            <Navigation/>
            <h1>How does GXS stand against Trust and Maribank?</h1>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
               <Plot data={frequencyData} layout={{ barmode: 'group', title: 'Frequency of Service for Each Bank' }} />
            </div>
        
          
        </div>

    )
}

export default ComparisonPage;