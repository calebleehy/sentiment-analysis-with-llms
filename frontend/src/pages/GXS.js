import React from "react";
import Navigation from "../compoents/navigation";
import '../styles/App.css';
import Plot from 'react-plotly.js';
import data from '../data.json'

const DashBoardPage = () => {
  const date = data.map(data => data.date);
  const rating = data.map(data => data.rating);
  const recommendationTypeCount = data.reduce((acc, data) => {
    const recommendation = data.recommendation;
    acc[recommendation] = (acc[recommendation] || 0) + 1;
    return acc;
  }, {});
  const recommendationTypes = Object.keys(recommendationTypeCount);
  const recommendationCounts = Object.values(recommendationTypeCount);
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
                          width: 370, height: 300
                          }} 
                        />
                    <Plot
                        data={[
                            {
                                x: date,
                                y: rating,
                                mode: "line",
                                line: { color: '#7F7F7F' }
                            }
                        ]}
                        layout={{
                            width: 370, height: 300,
                            title: 'NPS Score over time',
                            yaxis: {
                                range: [0, 5]
                            }
                          }} 
                        />
                    <Plot
                        data={[
                            {
                                x: ['Service 1', 'Service 2', 'Service 3', 'Service 4'],
                                y: [65, 72, 68, 70],
                                type: 'bar',
                                marker: {
                                    color: 'purple' 
                                }
                            }
                        ]}
                        layout={{
                            width: 370, height: 300,
                            title: 'NPS Score by Service'
                          }} 
                        />
                </div>
                <div>
            <Plot
              data={[
                {
                  x: recommendationCounts,
                  y: recommendationTypes,
                  type: 'funnel',
                  hoverinfo: 'none',
                  marker: {
                    color: 'purple'
                  }
                }
              ]}
                layout={{
                  width: 600, height: 500,
                  title: 'Recommendations',
                  margin: { t: 50, r: 0, b: 0, l: 100 }
                }} 
                />
                </div>

            </div></>

    )
}

export default DashBoardPage;