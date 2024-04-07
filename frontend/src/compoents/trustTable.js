import React, {useState} from 'react';
import Plot from 'react-plotly.js';
import data from '../full.json';

const TrustTable = () => {
  const trust = data.filter(item => item.bank === 'Trust') //filtering for only trust data
  const columns = ["Review"];
  const [filterCriteria, setFilterCriteria] = useState({ intent: '', service: '', issue: '' });
  const filteredData = trust.filter((item) =>
    (!filterCriteria.intent || item.intent === filterCriteria.intent) &&
    (!filterCriteria.service || item.service === filterCriteria.service) &&
    (!filterCriteria.issue || item.issue === filterCriteria.issue)
  );
  function transposeArray(array) {
    return array[0].map((_, colIndex) => array.map(row => row[colIndex]));
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterCriteria({ ...filterCriteria, [name]: value });
  
  };
  const rows = filteredData.map((item) => [item.review]);
  const transposedRows = transposeArray(rows);
  return (
    <div>
      <div>
        <label>
          Intent:
          <select name="intent" value={filterCriteria.intent} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="Praise">Praise</option>
            <option value="Feedback">Feedback</option>
            <option value="Complaint">Complaint</option>
          </select>
        </label>
        <label>
          Service:
          <select name="service" value={filterCriteria.service} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </label>
        <label>
          Issue:
          <select name="issue" value={filterCriteria.issue} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="C1">C1</option>
            <option value="C2">C2</option>
            <option value="C3">C3</option>
          </select>
        </label>
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
  
  export default TrustTable;