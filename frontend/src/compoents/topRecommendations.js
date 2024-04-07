import React from 'react';
import Plot from 'react-plotly.js';
import data from '../serv_issue_rec.json';

const TopRecommendationsPlot = () => {
  const columns = Object.keys(data[0]).map(name => ({ name, title: name.charAt(0).toUpperCase() + name.slice(1) }));
  const rows = data.map((item, index) => ({
    id: index,
    ...item,
}));
  return (
    <Plot
    data={[
      {
        type: 'table',
        columnwidth: [50, 50, 200],
        header: {
          values: columns.map(column => column.title),
          align: ['center'],
          line: { width: 1, color: 'black' },
          fill: { color: 'purple' },
          font: { family: 'Arial', size: 12, color: 'white' }
        },
        cells: {
          values: columns.map(column => rows.map(row => row[column.name])),
          align: ['left'],
          line: { color: 'black', width: 1 },
          fill: { color: ['white', 'white', 'white']},
          font: { family: 'Arial', size: 11, color: ['black'] },
          height: 100 // Set cell height for each review
        }
      }
    ]}
    layout={{
      width: 600,
      height: 400,
      plot_bgcolor: 'black',
      paper_bgcolor: 'black',
      font: { color: 'white' },
      margin: { l: 0, r: 0, b: 0, t: 0 } // Set margin to 0
    }}
  />
  );
};

export default TopRecommendationsPlot;