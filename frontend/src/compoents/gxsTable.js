import React, {useState} from 'react';
import Plot from 'react-plotly.js';
//import { getReviewData } from '../api/getData';
import data from '../full.json';

const GXSTable = () => {

  //store review data into data
  /* const [data, setData] = useState([]);
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

  }, []); */
  const gxs = data.filter(item => item.bank === 'GXS') //filtering for only GXS data
  const columns = ["Review"];
  const [sentimentFilter, setSentimentFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [issueFilter, setIssueFilter] = useState('');

  const sentimentOptions = [...new Set(gxs.map(item => item.sentiment))];
  const serviceOptions = [...new Set(gxs.map(item => item.service))];
  const issueOptions = [...new Set(gxs.map(item => item.issue))];

  const filteredData = gxs.filter(item => {
    const sentimentMatch = sentimentFilter === '' || item.sentiment === sentimentFilter;
    const serviceMatch = serviceFilter === '' || item.service === serviceFilter;
    const issueMatch = issueFilter === '' || item.issue === issueFilter;
    return sentimentMatch && serviceMatch && issueMatch;
});
  function transposeArray(array) {
    if (!array || !Array.isArray(array) || array.length === 0) {
      return [];
    }
    return array[0].map((_, colIndex) => array.map(row => row[colIndex]));
  }
  const rows = filteredData.map((item) => [item.review]);
  const transposedRows = rows ? transposeArray(rows) : [];
  return (
    <div>
    <div>
        <label style = {{marginRight: '5px'}}>Sentiment:</label>
        <select value={sentimentFilter} onChange={e => setSentimentFilter(e.target.value)} style={{ width: '150px' }}>
          <option value="">All</option>
          {sentimentOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <label style = {{marginRight: '5px', marginLeft: '5px'}}>Service:</label>
        <select value={serviceFilter} onChange={e => setServiceFilter(e.target.value)} style={{ width: '150px' }}>
          <option value="">All</option>
          {serviceOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <div>
        <label style = {{marginRight: '5px'}}>Issue:</label>
        <select value={issueFilter} onChange={e => setIssueFilter(e.target.value)} style={{ width: '150px' }}>
          <option value="">All</option>
          {issueOptions.map(option => (
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
              fill: { color: 'rgb(77, 6, 150)' },
              font: { family: 'Arial', size: 12, color: 'white' }
            },
            cells: {
              values: transposedRows,
              align: ['left'],
              line: { color: 'black', width: 1 },
              fill: { color: ['white'] },
              font: { family: 'Arial', size: 11, color: ['black'] },
              height: 100 // Set cell height for each review
            }
          }
        ]}
        layout={{
          width: 500,
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
  
  export default GXSTable;