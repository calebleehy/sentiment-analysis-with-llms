import React,{ useState } from "react";
import Navigation from "../compoents/navigation";
import '../styles/App.css';
import Plot from 'react-plotly.js';
import data from '../data.json'

const DetailedPage = () => { 
  const date = data.map(data => data.date);
  const client = data.map(data => data.client);
  const bank = data.map(data => data.bank);
  const rating = data.map(data => data.rating);
  const review = data.map(data => data.review);
  const service = data.map(data => data.service);
  const sentiment = data.map(data => data.sentiment);
  const intent = data.map(data => data.intent);
  const recommendation = data.map(data => data.recommendation);
  const values = [
    date,client,bank,rating,review,service,sentiment,intent,recommendation
  ]
  const [startIndex, setStartIndex] = useState(0);
  const columnNames = Object.keys(data[0]);
  const numRows = 5;
  const visibleData = values.slice(startIndex, startIndex + numRows);
    return (
        <div>
            <Navigation/>
            <h1>Reviews</h1>
            <Plot
            data={[
              {
                type: 'table',
                header: {
                  values: columnNames,
                  align: 'center',
                  fill: { color: 'purple' },
                  font: { color: 'white', family: 'Arial', size: 12 }
                },
                cells: {
                  values: values,
                  align: 'center',
                  font: { family: 'Arial', size: 11 },
                  height: 100,
                },
              },
            ]}
            layout={{
              width: 1500,
              height: 1000,
              title: 'Table Plot',
              margin: { t: 0, l: 0, r: 0, b: 0 }
            }}
            />
            <button onClick={() => setStartIndex(Math.max(0, startIndex - numRows))}>Previous</button>
            <button onClick={() => setStartIndex(Math.min(data.length - numRows, startIndex + numRows))}>Next</button>
        </div>
    )
}
export default DetailedPage;