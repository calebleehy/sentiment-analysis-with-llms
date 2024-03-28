import React from "react";
import Navigation from "../compoents/navigation";
import '../styles/App.css';
import Plot from 'react-plotly.js';

const DashBoardPage = () => {
    return (
        <><div>

            <Navigation />
            <h1>Dashboard</h1>
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
                                    axis: { range: [null, 100] },
                                    bar: { color: "purple" },
                                }
                            },
                        ]}
                        layout={{
                            width: 370, height: 300,
                        }} />
                    <Plot
                        data={[
                            {
                                x: ['2013-10-04 22:23:00', '2013-11-04 22:23:00', '2013-12-04 22:23:00', '2014-01-04 22:23:00', '2014-02-04 22:23:00'],
                                y: [75, 79, 71, 83, 76],
                                type: 'scatter',
                                mode: "lines",
                                line: { color: '#7F7F7F' }
                            }
                        ]}
                        layout={{
                            width: 370, height: 300,
                            title: 'NPS Score over time',
                            yaxis: {
                                range: [0, 100] // Limit the range of the y-axis to 5 to 20
                            }
                        }} />
                    <Plot
                        data={[
                            {
                                x: ['Service 1', 'Service 2', 'Service 3', 'Service 4'],
                                y: [65, 72, 68, 70],
                                type: 'bar',
                                marker: {
                                    color: 'purple' // Set the bar color to blue
                                }
                            }
                        ]}
                        layout={{
                            width: 370, height: 300,
                            title: 'NPS Score by Service',
                        }} />
                </div>
                <div classname="row">
                    <Plot
                        data={[
                            {
                                x: [120, 275],
                                y: ['Andriod', 'Apple'],
                                type: 'bar',
                                orientation: 'h',
                                marker: {
                                    color: 'purple' // Set the bar color to blue
                                }
                            }
                        ]}
                        layout={{
                            width: 400, height: 300,
                            title: 'Samples by Device Brand',
                        }} />
                    <Plot
                        data={[
                            {
                                x: [64, 36, 88, 130, 77],
                                y: ['1 star', '2 stars', '3 stars', '4 stars', '5 stars'],
                                type: 'bar',
                                orientation: 'h',
                                marker: {
                                    color: 'purple' // Set the bar color to blue
                                }
                            }
                        ]}
                        layout={{
                            width: 400, height: 300,
                            title: 'Samples by Rating',
                        }} />

                </div>

            </div></>

    )
}

export default DashBoardPage;