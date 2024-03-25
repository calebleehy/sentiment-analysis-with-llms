import logo from './logo.svg';
import './App.css';
import Plot from 'react-plotly.js';
import React from 'react';

function App() {
  return (
    <div className="App">
      <div className = "horizontal">
      <Plot
        data={[
          {
            domain: { x: [0, 1], y: [0, 1] },
            value: 60,
            title: { text: "NPS Score" },
            type: "indicator",
            mode: "gauge+number",
            delta: { reference: 100 },
            gauge: { axis: { range: [null, 100] },
            bar: { color: "darkblue" }, // Color of the gauge bar
            bgcolor: "lightgray", // Color of the gauge background
            borderwidth: 2,
            bordercolor: "gray" }
          }
        ]}
        layout={{
          width: 400, height: 300
        }}
      />
      <Plot
        data={[
          {
            x: ['2013-10-04 22:23:00', '2013-11-04 22:23:00', '2013-12-04 22:23:00','2014-01-04 22:23:00','2014-02-04 22:23:00'],
            y: [3.2,4.0,3.7,4.1,3.9],
            mode:'lines',
            type: "scatter",
          },
        ]}
        layout={{
          title: "Time series plot",
          xaxis: {
            title: "Date"
          },
          yaxis: {
            title: "Average rating",
            range:[0,5]
          },
          width:400, height: 300
        }}
      />
      <Plot
        data={[
          {
            x: ['Service 1','Service 2','Service 3','Service 4'],
            y: [75, 82, 66, 89],
            mode:'lines',
            type: "bar",
            orientation: 'v'
          },
        ]}
        layout={{
          title: "NPS Score by Service",
          width:400, height: 300
        }}
      />
      </div>
      <div className = "horizontal">
      <Plot
        data={[
          {
            x: [150,100],
            y: ['Apple','Andriod'],
            mode:'lines',
            type: "bar",
            orientation: 'h'
          },
        ]}
        layout={{
          title: "Samples by User",
          width:400, height: 300
        }}
      />
      <Plot
        data={[
          {
            x: [30,40,20,100,60],
            y: [1,2,3,4,5],
            mode:'lines',
            type: "bar",
            orientation: 'h'
          },
        ]}
        layout={{
          title: "Samples by Rating",
          width:400, height: 300,
          yaxis: {
            tickmode: 'array', // Set tick mode to 'array' to specify all tick values
            tickvals: [1, 2, 3, 4, 5]}
        }}
      />
      </div>
    </div>
    
  );
}

export default App;
