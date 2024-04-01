import React from "react";
import Navigation from "../compoents/navigation";
import '../styles/App.css';
import Plot from 'react-plotly.js';
import data from '../data.json'


const ComparisonPage = () => {
    const service = data.map(data => data.service);
    var y1 = [60, 56,70, 80];
    var y2 = [75, 70,62, 50];
    var y3 = [70,60,80,70];
    const extractUniqueValues = (columnName) => {
        const values = new Set();
        data.forEach((item) => {
          values.add(item[columnName]);
        });
        return Array.from(values);
      };
      const uniqueValues = extractUniqueValues('bank');
      const data2 = [
        {
          x: ['A','B','C','D'],
          y: y1,
          name: 'GXS',
          type: 'bar',
          text: y1.map(String),
          textposition: 'auto',
          hoverinfo: 'none',
          opacity: 0.5,
          marker: {
            color: 'rgb(77, 6, 150)',
            line: {
              color: 'rgb(108, 66, 245)',
              width: 1.5
            }
          }
        },
        {
          x: ['A','B','C','D'],
          y: y2,
          name: 'Trust',
          type: 'bar',
          text: y2.map(String),
          textposition: 'auto',
          hoverinfo: 'none',
          marker: {
            color: 'rgb(140, 81, 201)',
            line: {
              color: 'rgb(108, 66, 245)',
              width: 1.5
            }
          }
        },
        {
          x: ['A','B','C','D'],
          y: y3,
          name: 'MariBank',
          type: 'bar',
          text: y3.map(String),
          textposition: 'auto',
          hoverinfo: 'none',
          marker: {
            color: 'rgb(52, 3, 102)',
            line: {
              color: 'rgb(108, 66, 245)',
              width: 1.5
            }
          }
        },
      ];
    
      const layout = {
        barmode: 'group',
        title: 'Comparison of Services by Bank',
        xaxis: {
          title: 'Service',
        },
        yaxis: {
          title: 'NPS Score',
          range: [0, 100],
        },
      };
    return (
        <div>
            <Navigation/>
            <h1>How does GXS stand against Trust and Maribank?</h1>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
               <Plot data={data2} layout={layout} />
               </div>
          
        </div>

    )
}

export default ComparisonPage;