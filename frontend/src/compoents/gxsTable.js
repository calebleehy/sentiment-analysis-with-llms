import React, {useState} from 'react';
import Plot from 'react-plotly.js';
//import { getReviewData } from '../api/getData';
import data from '../full.json';
import Select from 'react-select';

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
  const [sentimentFilter, setSentimentFilter] = useState([]);
  const [serviceFilter, setServiceFilter] = useState([]);
  const [issueFilter, setIssueFilter] = useState([]);

  const sentimentOptions = [...new Set(gxs.map(item => item.sentiment))];
  const serviceOptions = [...new Set(gxs.map(item => item.service))];
  const issueOptions = [...new Set(gxs.map(item => item.issue))];

  const filteredData = gxs.filter(item => {
    const sentimentMatch = sentimentFilter.length === 0 || sentimentFilter.includes(item.sentiment);
    const serviceMatch = serviceFilter.length === 0 || serviceFilter.includes(item.service);
    const issueMatch = issueFilter.length === 0 || issueFilter.includes(item.issue);
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
        <div>
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
              line: { width: 1, color: 'white' },
              fill: { color: '#6237A0' },
              font: { family: 'Arial', size: 12, color: 'white' }
            },
            cells: {
              values: transposedRows,
              align: ['left'],
              line: { color: 'white', width: 1 },
              fill: { color: ['rgb(25,25,26)'] },
              font: { family: 'Arial', size: 11, color: ['white'] },
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