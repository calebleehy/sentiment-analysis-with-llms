import React,{ useState, useEffect} from "react";
import Navigation from "../compoents/navigation";
import '../styles/App.css';
import Plot from 'react-plotly.js';
import data from '../data.json'

const DetailedPage = () => { 
  const [filters, setFilters] = useState({});
    const [filteredData, setFilteredData] = useState(data);

    const columns = Object.keys(data[0]);

    const handleFilterChange = (e, column) => {
        const value = e.target.value;
        setFilters((prevFilters) => ({ ...prevFilters, [column]: value }));
    };

    useEffect(() => {
        const filtered = data.filter((row) =>
            Object.entries(filters).every(([column, value]) => {
              if (!isNaN(value) && !isNaN(parseFloat(value))) {
                    return String(row[column]) === parseInt(value);
                }
                return row[column].toLowerCase().includes(value.toLowerCase());
            })

        );
        setFilteredData(filtered);
    }, [data, filters]);

    return (
        <div>
            <Navigation/>
            <h1>Reviews</h1>
            <tr>
              {columns.map((column) => (
                <th key={column}>
                  <input
                    type="text"
                    value={filters[column] || ''}
                    onChange={(e) => handleFilterChange(e, column)}
                    placeholder={`Filter ${column}...`}
                  />
                </th>
                ))}
              </tr>
            <Plot
            data={[
              {
                type: 'table',
                header: {
                  values: columns.map((column) => column.toUpperCase()),
                  align: 'center',
                  fill: { color: 'purple' },
                  font: { color: 'white', family: 'Arial', size: 12 }
                },
                cells: {
                  values: columns.map((column) =>
                  filteredData.map((row) => row[column])),
                  font: { family: 'Arial', size: 11 },
                  height: 100,
                },
              },
            ]}
            layout={{
              width: 1720,
              height: 1200,
              title: 'Table Plot',
              margin: { t: 0, l: 0, r: 0, b: 0 },
              columnwidth: [200, 200, 200,200,500,200,200,200,200] 
            }}
            />
        </div>
    )
}
export default DetailedPage;