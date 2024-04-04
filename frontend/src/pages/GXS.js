import React from "react";
import Navigation from "../compoents/navigation";
import '../styles/App.css';
import Plot from 'react-plotly.js';
import data from '../data.json'

const DashBoardPage = () => {
  const date = data.map(data => data.date);
  const rating = data.map(data => data.rating);
  const gxs = data.filter(item => item.bank === 'GXS') //filtering for only GXS data
  const recommendationTypeCount = data.reduce((acc, data) => {
    const recommendation = data.recommendation;
    acc[recommendation] = (acc[recommendation] || 0) + 1;
    return acc;
  }, {});
  const recommendationTypes = Object.keys(recommendationTypeCount); 
  const recommendationCounts = Object.values(recommendationTypeCount);
  const serviceTypeCount = gxs.reduce((acc, gxs) => { //gets frequency of each service
    const service = gxs.service;
    acc[service] = (acc[service] || 0) + 1;
    return acc;
  }, {});
  const serviceTypes = Object.keys(serviceTypeCount); 
  const serviceCounts = Object.values(serviceTypeCount);
  
    return (
        <><div>
            <Navigation />
            <h1>What are the most impactful areas to be addressed?</h1>
        </div>
        <div classname="dashboard">
                <div classname="row">
                    <Plot
                        data={[
                            {
                                domain: { x: [0, 1], y: [0, 1] },
                                value: 60,
                                title: { text: "NPS Score" },
                                type: "indicator",
                                mode: "gauge+number",
                                delta: { reference: 100 },
                                gauge: {
                                    axis: { range: [-100, 100] },
                                    bar: { color: "purple" },
                                }
                            },
                        ]}
                        layout={{
                          width: 500, height: 300
                          }} 
                        />
                    <Plot
                        data={[
                            {
                                x: date,
                                y: rating,
                                mode: "line",
                                line: { color: '#4e0c7d' }
                            }
                        ]}
                        layout={{
                            width: 500, height: 300,
                            title: 'NPS Score over time',
                            yaxis: {
                                range: [0, 5]
                            }
                          }} 
                        />
                    
                </div>
                <div>
                <Plot
                  data={[
                    {
                     x: serviceTypes,
                     y: serviceCounts,
                     type: 'bar',
                     orientation:'v',
                     marker: {
                      color: 'purple' 
                    }
                  }
                ]}
                layout={{
                  width: 500, height: 350,
                  title: 'Frequency of Service'
                }} 
                />
                </div>

            </div></>

    )
}

export default DashBoardPage;