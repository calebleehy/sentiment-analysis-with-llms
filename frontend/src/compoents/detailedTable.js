import React, {useState} from 'react';
import Plot from 'react-plotly.js';
//import { getReviewData } from '../api/getData';
import data from '../full.json';

const DetailedTable = () => {
   //store review data into data
   /* const [data, setData] = useState([0]);
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
  const columns = ["Review","Service","Issue","Rating","Sentiment"];
  const [sentimentFilter, setSentimentFilter] = useState('Negative');
  const [serviceFilter, setServiceFilter] = useState('App');
  const [issueFilter, setIssueFilter] = useState('Technical glitches');
  const [ratingFilter, setRatingFilter] = useState('');

  const sentimentOptions = [...new Set(gxs.map(item => item.sentiment))];
  const serviceOptions = [...new Set(gxs.map(item => item.service))];
  const issueOptions = [...new Set(gxs.map(item => item.issue))];
  const ratingOptions = [...new Set(gxs.map(item => item.rating))];

  const filteredData = gxs.filter(item => {
    const sentimentMatch = sentimentFilter === '' || item.sentiment === sentimentFilter;
    const serviceMatch = serviceFilter === '' || item.service === serviceFilter;
    const issueMatch = issueFilter === '' || item.issue === issueFilter;
    const ratingMatch = ratingFilter === '' || item.rating === ratingFilter;
    return sentimentMatch && serviceMatch && issueMatch && ratingMatch;
});
const downloadCSV = () => {
  const headers = columns.map(col => col.toUpperCase());
  const rows = [headers,...filteredData.map(item => columns.map(col => (col === 'Review' ? `"${item[col.toLowerCase()] || ''}"` : item[col.toLowerCase()] || '')))];
  const csvContent = rows.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'data.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
  return (
    <div>
    <div>
        <label style={{marginRight:'5px'}}>Sentiment:</label>
        <select value={sentimentFilter} onChange={e => setSentimentFilter(e.target.value)} style={{ width: '150px' }}>
          <option value="">All</option>
          {sentimentOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <label style={{marginLeft:'5px',marginRight:'5px'}}>Service:</label>
        <select value={serviceFilter} onChange={e => setServiceFilter(e.target.value)} style={{ width: '150px' }}>
          <option value="">All</option>
          {serviceOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <label style={{marginLeft:'5px',marginRight:'5px'}}>Issue:</label>
        <select value={issueFilter} onChange={e => setIssueFilter(e.target.value)} style={{ width: '150px' }}>
          <option value="">All</option>
          {issueOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <label style={{marginLeft:'5px',marginRight:'5px'}}>Rating:</label>
        <select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)} style={{ width: '150px' }}>
          <option value="">All</option>
          {ratingOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <button onClick={downloadCSV} className="download-csv">Download CSV</button>
      </div>
      <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '400px'}}>
      <Plot
        data={[
          {
            type: 'table',
            columnwidth: [150,45,45,45,45],
            header: {
              values: columns.map((column) => column.toUpperCase()),
              align: ['center'],
              line: { width: 1, color: 'white' },
              fill: { color: '#28104E' },
              font: { family: 'Arial', size: 12, color: 'white' }
            },
            cells: {
              values: [filteredData.map(item => item.review),
                filteredData.map(item => item.service),
                filteredData.map(item => item.issue),
                filteredData.map(item => item.rating),
                filteredData.map(item => item.sentiment)],
              align: ['left'],
              line: { color: 'white', width: 1 },
              fill: { color: ['rgb(25,25,26)'] },
              font: { family: 'Arial', size: 11, color: ['white'] },
              height: 80 // Set cell height for each review
            }
          }
        ]}
        layout={{
          width: 1117,
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