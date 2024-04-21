import React, {useState} from 'react';
import Plot from 'react-plotly.js';
import data from '../full.json';
//import { getReviewData } from '../api/getData';

const IssueCountsPlot = () => {
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

    }, []);
    console.log(data); */
    const [selectedService, setSelectedService] = useState("");
    const gxs = data.filter(item => item.sentiment === "Negative" && item.bank === 'GXS' ) //filtering for only GXS and negative sentiment
    const serviceCounts = gxs.reduce((acc, gxs) => { //gets frequency of each service
      const service = gxs.service;
      acc[service] = (acc[service] || 0) + 1;
        return acc;
      }, {});
    var topServices = Object.keys(serviceCounts) //gets top 2 most common service
                .sort(function(a, b) { return serviceCounts[b] - serviceCounts[a]; })
                .slice(0, 2);
    const filteredData = selectedService
      ? gxs.filter(item => item.service === selectedService)
      : gxs;
    const issueCounts = filteredData.reduce((freq, item) => { //get frequency of issues
      freq[item.issue] = (freq[item.issue] || 0) + 1;
      return freq;
    }, {});
    var topIssues = Object.keys(issueCounts) //gets the top 3 most common issues
            .sort(function(a, b) { return issueCounts[b] - issueCounts[a]; })
            .slice(0, 3);
    const handleSelectChange = (e) => {
      setSelectedService(e.target.value);
    };
    const data2 = topIssues.map(issue => ({
      x: [issueCounts[issue] || 0],
      y: [issue],
      type: 'bar',
      name: issue,
      orientation:'h',
      marker: {
        color: '#9754CB' 
      },
      showlegend: false,
    }));
const layout={
  width: 605, height: 300,
  title: {
    text:'Top 3 Issues with Negative Sentiments' ,
    font: {
      color: 'white', // Set title text color to white
    },
  },
  plot_bgcolor: 'rgb(25,25,26)', // Set plot background color to black
  paper_bgcolor: 'rgb(25,25,26)', // Set paper background color to black
  xaxis: {
    color: 'white',
    title: {
      text: 'Count',
      font: {
        color: 'white', // Set x-axis text color to white
      },
    },
    tickfont: {
      color: 'white', // Set x-axis tick text color to white
    },
  },
  yaxis: {
    automargin: true, 
    title: {
      font: {
        color: 'white', // Set y-axis text color to white
      },
    },
    tickfont: {
      color: 'white', // Set y-axis tick text color to white
    },
    color: 'white'
  },
}
return (
  <div>
    <div>
    <select className="custom-select" style={{marginBottom:'1vh'}} onChange={handleSelectChange}>
          {topServices.map(service => (
            <option key={service} value={service}>{service}</option>
      ))}
      </select>
    </div>
  <Plot
  data={data2}
  layout={layout}
  />
  </div>
  );
};

export default IssueCountsPlot;