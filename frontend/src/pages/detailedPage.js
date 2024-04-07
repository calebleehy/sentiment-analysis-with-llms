import React,{ useState, useEffect} from "react";
import Navigation from "../compoents/navigation";
import '../styles/App.css';
import Plot from 'react-plotly.js';
import { getReviewData } from "../api/getData";

const DetailedPage = () => {
  //store review data into data
  const [data, setData] = useState([0]);
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
  const gxs = data.filter(item => item.bank === 'GXS') //filtering for only GXS data
  const [filters, setFilters] = useState({});
  const [filteredData, setFilteredData] = useState(data);
  const columns = Object.keys(data[0]);
  const handleFilterChange = (e, column) => {
    const value = e.target.value;
    setFilters((prevFilters) => ({ ...prevFilters, [column]: value }));
  };
  useEffect(() => {
    const filtered = gxs.filter((row) =>
    Object.entries(filters).every(([column, value]) => {
      return row[column].toLowerCase().includes(value.toLowerCase());
    })
    );
    setFilteredData(filtered);
  }, [gxs, filters]);

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
              margin: { t: 0, l: 0, r: 0, b: 0 },
            }}
            />
        </div>
    )
}
export default DetailedPage;