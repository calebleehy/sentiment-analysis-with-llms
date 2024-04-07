
import React,{ useState, useEffect} from "react";
import Navigation from "../compoents/navigation";
import '../styles/App.css';
import Plot from 'react-plotly.js';
import data from '../data.json'


const ComparisonPage = () => {
  const [frequencyData, setFrequencyData] = useState([]);
  useEffect(() => {
    const freqMap = data.reduce((acc, item) => {
      if (!acc[item.bank]) {
        acc[item.bank] = {};
      }
      acc[item.bank][item.service] = (acc[item.bank][item.service] || 0) + 1;
      return acc;
    }, {});

    const colors = ['rgb(77, 6, 150)', 'rgb(140, 81, 201)', 'rgb(213, 166, 237)'];

    const newData = Object.keys(freqMap).map((bank, index) => ({
      x: Object.keys(freqMap[bank]),
      y: Object.values(freqMap[bank]),
      type: 'bar',
      name: bank,
      marker: { color: colors[index] }
    }));

    setFrequencyData(newData);
  }, []); // Empty dependency array ensures this runs once on mount
  const layout = {
    barmode: 'group',
    title: {
      text: 'Frequency of Service for Each Bank' ,
      font: {
        color: 'white', // Set title text color to white
      },
    },
    plot_bgcolor: 'black', // Set plot background color to black
    paper_bgcolor: 'black', // Set paper background color to black,
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
        text: 'Count',
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
        <div>
            <Navigation/>
            <h1>How does GXS stand against Trust and Maribank?</h1>
            {frequencyData.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Plot data={frequencyData} layout={layout} />
        </div>
        )}
        </div>

    )
}

export default ComparisonPage;