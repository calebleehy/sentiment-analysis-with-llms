import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { getWhatifRecNps, getBankNpsData } from '../api/getData';

const GaugeChart = () => {
  //store review data into data
  const [data, setData] = useState([]);
  const [bankData, setBankData] = useState([]);
  // fetch review data by getReviewData method

  // load data everytime
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWhatifRecNps();
        const content = data.whatifRecNpsData;
        setData(content);
        console.log(data)

      } catch (error) {
        console.log('Data before useEffect:', data)
      };
    };

    fetchData();
    const fetchBankData = async () => {
      try {
        const bankData = await getBankNpsData();
        const content = bankData.bankNpsData;
        setBankData(content);

      } catch (error) {

      };
    };

    fetchBankData();


  }, []);

  const [selectedIssue, setSelectedIssue] = useState(data[0]?data[0].issue:"Technical glitches");
  const firstTwoIssue = data.slice(0, 2);
  const issues = firstTwoIssue.map(item => item.issue);
  const gxs = bankData.find(item => item.bank === 'GXS');
  const gxsNPS = gxs ? gxs.nps : null;
  const handleChange = (event) => {
    setSelectedIssue(event.target.value);
  };

  const filteredData = firstTwoIssue.find(item => item.issue === selectedIssue);

  return (
    <div>
      <select className="custom-select" value={selectedIssue} onChange={handleChange} style={{ width: '39vw' }}>
        {issues.map((issue, index) => (
          <option key={index} value={issue}>{issue}</option>
        ))}
      </select>
      {filteredData && (
        <Plot
          data={[
            {
              type: 'indicator',
              mode: 'gauge+number+delta',
              value: filteredData.nps,
              delta: { reference: gxsNPS },
              title: {
                text: "Projected NPS", align: 'center',
                font: {
                  color: 'white',
                },
              },
              number: { font: { color: 'white' }, align: 'center' },
              gauge: {
                axis: { range: [-100, 100], tickwidth: 1, tickcolor: 'white', tickfont: { color: 'white' } },
                bar: { color: '#6237A0' },
                bgcolor: 'black',
                bordercolor: 'white',
              }
            }
          ]}
          layout={{
            width: 500, height: 250,
            margin: { t: 70, b: 40, l: 25, r: 25 },
            plot_bgcolor: 'rgb(25,25,26)', // Set plot background color to black
            paper_bgcolor: 'rgb(25,25,26)', // Set paper background color to black
          }}
          config={{
            responsive: true
          }}
        />
      )}
    </div>
  );
};

export default GaugeChart;
