import React, {useState} from 'react';
import Plot from 'react-plotly.js';
//import { getReviewData } from '../api/getData';
import data from '../full.json';
import Select from 'react-select';

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
  const [sentimentFilter, setSentimentFilter] = useState([]);
  const [serviceFilter, setServiceFilter] = useState([]);
  const [issueFilter, setIssueFilter] = useState([]);
  const [ratingFilter, setRatingFilter] = useState([]);
  const [filterWords, setFilterWords] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Change this to set the number of rows per page
  // Calculate the indexes of the first and last rows to display
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  // Function to change the current page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleFilterChange = (e) => {
      setFilterWords(e.target.value);
  };
  const MAX_PAGE_NUMBERS = 5; // Maximum number of page numbers to show
  const sentimentOptions = [...new Set(gxs.map(item => item.sentiment))];
  const serviceOptions = [...new Set(gxs.map(item => item.service))];
  const issueOptions = [...new Set(gxs.map(item => item.issue))];
  const ratingOptions = [...new Set(gxs.map(item => item.rating))];

  const filteredData = gxs.filter(item => {
    const sentimentMatch = sentimentFilter.length === 0 || sentimentFilter.includes(item.sentiment);
    const serviceMatch = serviceFilter.length === 0 || serviceFilter.includes(item.service);
    const issueMatch = issueFilter.length === 0 || issueFilter.includes(item.issue);
    const ratingMatch = ratingFilter.length === 0 || ratingFilter.includes(item.rating);
    const reviewText = item.review.toLowerCase();
    const wordsToFilter = filterWords.toLowerCase().split(' ');
    return sentimentMatch && serviceMatch && issueMatch && ratingMatch && wordsToFilter.every(word => reviewText.includes(word));
});
const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
const startPage = Math.max(1, currentPage - Math.floor(MAX_PAGE_NUMBERS / 2));
const endPage = Math.min(Math.ceil(filteredData.length / rowsPerPage), startPage + MAX_PAGE_NUMBERS - 1);
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
    <input className="custom-select"
      type="text"
      value={filterWords}
      onChange={handleFilterChange}
      placeholder="Enter words to filter"
      />
      <button onClick={downloadCSV} className="download-csv">Download CSV</button>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Select className = "select-container"
          isMulti
          placeholder="Select sentiment..."
          options={sentimentOptions.map(option => ({ value: option, label: option }))}
          value={sentimentFilter.map(option => ({ value: option, label: option }))}
          onChange={(selectedOptions) => setSentimentFilter(selectedOptions.map(option => option.value))}
          styles={{
            control: (provided) => ({
              ...provided,
              backgroundColor: '#deacf5', // Set your desired background color
            }),
            option: (provided) => ({
              ...provided,
              color: 'black', // Set your desired text color
            }),
          }}
        />
        <Select className = "select-container"
          isMulti
          placeholder="Select service..."
          options={serviceOptions.map(option => ({ value: option, label: option }))}
          value={serviceFilter.map(option => ({ value: option, label: option }))}
          onChange={(selectedOptions) => setServiceFilter(selectedOptions.map(option => option.value))}
          styles={{
            control: (provided,state) => ({
              ...provided,
              backgroundColor: '#deacf5', // Set your desired background color
            }),
            option: (provided) => ({
              ...provided,
              color: 'black', // Set your desired text color
            }),
          }}
        />
        <Select className = "select-container"
          isMulti
          placeholder="Select issue..."
          options={issueOptions.map(option => ({ value: option, label: option }))}
          value={issueFilter.map(option => ({ value: option, label: option }))}
          onChange={(selectedOptions) => setIssueFilter(selectedOptions.map(option => option.value))}
          styles={{
            control: (provided) => ({
              ...provided,
              backgroundColor: '#deacf5', // Set your desired background color
            }),
            option: (provided) => ({
              ...provided,
              color: 'black', // Set your desired text color
            }),
          }}
        />
        <Select className = "select-container"
          isMulti
          placeholder="Select rating.."
          options={ratingOptions.map(option => ({ value: option, label: option }))}
          value={ratingFilter.map(option => ({ value: option, label: option }))}
          onChange={(selectedOptions) => setRatingFilter(selectedOptions.map(option => option.value))}
          styles={{
            control: (provided) => ({
              ...provided,
              backgroundColor: '#deacf5', // Set your desired background color
            }),
            option: (provided) => ({
              ...provided,
              color: 'black', // Set your desired text color
            }),
          }}
        />
        </div>
      </div>
      <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '470px'}}>
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
              values: [currentRows.map(item => item.review),
                currentRows.map(item => item.service),
                currentRows.map(item => item.issue),
                currentRows.map(item => item.rating),
                currentRows.map(item => item.sentiment)],
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
      <div style={{ display: 'flex', justifyContent: 'center' }}>
      <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>&lt;</button>
    {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
      <button key={startPage + index} onClick={() => paginate(startPage + index)} disabled={currentPage === startPage + index}>{startPage + index}</button>
    ))}
    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(filteredData.length / rowsPerPage)}>&gt;</button>
         </div>
    </div>
  );
  };
  
  export default DetailedTable;