import React, {useState, useEffect} from 'react';
import Plot from 'react-plotly.js';
import { getReviewData } from '../api/getData';

const MaribankTable = () => {
  //store review data into data
  const [data, setData] = useState([]);
  //fetch review data by getReviewData method
  
  //load data everytime
  useEffect(() => {
    const fetchData = async() => {
      try{
          const data = await getReviewData();
          const content = data.reviewData;
          setData(content);
  
        } catch (error){
  
        };
      };

    fetchData();

  }, []);
  const maribank = data.filter(item => item.bank === 'MariBank') //filtering for only maribank data
  const columns = ["Review"];
  const [sentimentFilter, setSentimentFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [issueFilter, setIssueFilter] = useState('');
  const [intentFilter, setIntentFilter] = useState('');

  const sentimentOptions = [...new Set(maribank.map(item => item.sentiment))];
  const serviceOptions = [...new Set(maribank.map(item => item.service))];
  const issueOptions = [...new Set(maribank.map(item => item.issue))];
  const intentOptions = [...new Set(maribank.map(item => item.intent))];

  const filteredData = maribank.filter(item => {
    const sentimentMatch = sentimentFilter === '' || item.sentiment === sentimentFilter;
    const serviceMatch = serviceFilter === '' || item.service === serviceFilter;
    const issueMatch = issueFilter === '' || item.issue === issueFilter;
    const intentMatch = intentFilter === '' || item.intent === intentFilter;
    return sentimentMatch && serviceMatch && issueMatch && intentMatch;
});
  function transposeArray(array) {
    if (!array || !Array.isArray(array) || array.length === 0) {
      return [];
    }
    return array[0].map((_, colIndex) => array.map(row => row[colIndex]));
  }
  const rows = filteredData.map((item) => [item.review]);
  const transposedRows = rows ? transposeArray(rows) : [];

  if (!filteredData.length) {
    return <p>No data available.</p>;
  }

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
        <div>
        <label>Intent:</label>
        <select value={intentFilter} onChange={e => setIntentFilter(e.target.value)}>
          <option value="">All</option>
          {intentOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        </div>
      </div>
      <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '400px'}}>
      <Plot
        data={[
          {
            type: 'table',
            header: {
              values: columns,
              align: ['center'],
              line: { width: 1, color: 'black' },
              fill: { color: 'grey' },
              font: { family: 'Arial', size: 12, color: 'white' }
            },
            cells: {
              values: transposedRows,
              align: ['left'],
              line: { color: 'black', width: 1 },
              fill: { color: ['lightgrey', 'white'] },
              font: { family: 'Arial', size: 11, color: ['black'] },
              height: 100 // Set cell height for each review
            }
          }
        ]}
        layout={{
          width: 400,
          height: 300,
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
  
  export default MaribankTable;