import React, {useState} from 'react';
import Plot from 'react-plotly.js';
import data from '../full.json';

const DetailedTable = () => {
  const gxs = data.filter(item => item.bank === 'GXS') //filtering for only GXS data
  const columns = Object.keys(data[0]);
  const [sentimentFilter, setSentimentFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [issueFilter, setIssueFilter] = useState('');
  const [intentFilter, setIntentFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');

  const sentimentOptions = [...new Set(gxs.map(item => item.sentiment))];
  const serviceOptions = [...new Set(gxs.map(item => item.service))];
  const issueOptions = [...new Set(gxs.map(item => item.issue))];
  const intentOptions = [...new Set(gxs.map(item => item.intent))];
  const ratingOptions = [...new Set(gxs.map(item => item.rating))];

  const filteredData = gxs.filter(item => {
    const sentimentMatch = sentimentFilter === '' || item.sentiment === sentimentFilter;
    const serviceMatch = serviceFilter === '' || item.service === serviceFilter;
    const issueMatch = issueFilter === '' || item.issue === issueFilter;
    const intentMatch = intentFilter === '' || item.intent === intentFilter;
    const ratingMatch = ratingFilter === '' || item.rating === ratingFilter;
    return sentimentMatch && serviceMatch && issueMatch && intentMatch && ratingMatch;
});
  return (
    <div>
    <div>
        <label>Sentiment:</label>
        <select value={sentimentFilter} onChange={e => setSentimentFilter(e.target.value)}>
          <option value="">All</option>
          {sentimentOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <label>Service:</label>
        <select value={serviceFilter} onChange={e => setServiceFilter(e.target.value)}>
          <option value="">All</option>
          {serviceOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <label>Issue:</label>
        <select value={issueFilter} onChange={e => setIssueFilter(e.target.value)}>
          <option value="">All</option>
          {issueOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <label>Intent:</label>
        <select value={intentFilter} onChange={e => setIntentFilter(e.target.value)}>
          <option value="">All</option>
          {intentOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <label>Rating:</label>
        <select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)}>
          <option value="">All</option>
          {ratingOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '400px'}}>
      <Plot
        data={[
          {
            type: 'table',
            columnwidth: [50, 50, 50,50,50,50,50,50,200],
            header: {
              values: columns.map((column) => column.toUpperCase()),
              align: ['center'],
              line: { width: 1, color: 'black' },
              fill: { color: 'purple' },
              font: { family: 'Arial', size: 12, color: 'white' }
            },
            cells: {
              values: columns.map((column) =>
              filteredData.map((row) => row[column])),
              align: ['left'],
              line: { color: 'black', width: 1 },
              fill: { color: ['white'] },
              font: { family: 'Arial', size: 11, color: ['black'] },
              height: 100 // Set cell height for each review
            }
          }
        ]}
        layout={{
          width: 1200,
          height: 5000,
          plot_bgcolor: 'black',
          paper_bgcolor: 'black',
          font: { color: 'white' },
          margin: { l: 0, r: 0, b: 0, t: 0 } // Set margin to 0
        }}
      />
      </div>
    </div>
  );
  };
  
  export default DetailedTable;