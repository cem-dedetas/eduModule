import React from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLine, VictoryStack } from 'victory';

const Analytics: React.FC = () => {
    // useState for data
    const videoData = [
        { label: 'Video 1', watchtime: 200, views: 500, likes: 300, comments: 150 },
        { label: 'Video 2', watchtime: 350, views: 750, likes: 400, comments: 200 },
        { label: 'Video 3', watchtime: 150, views: 400, likes: 200, comments: 100 },
        { label: 'Video 4', watchtime: 400, views: 900, likes: 450, comments: 300 },
        { label: 'Video 5', watchtime: 250, views: 600, likes: 350, comments: 200 },
    ];

    const navigate = useNavigate();

    // onJoin function

    return (
        <>
            <Header />
            <div className="w3-container">
                <h4 className="w3-center">Watchtime Analytics for:  Course 4 {`(Workplace Health and Safety)`}</h4>
                <div className="w3-row-padding w3-margin-top">
                    <div className="w3-third">
                        <div className="w3-card">
                            <h2 className="w3-container w3-blue w3-center">Watchtime Distribution</h2>
                            <div className="w3-container">
                                <VictoryBar
                                    data={videoData}
                                    x="label"
                                    y="watchtime"
                                    style={{ data: { fill: '#8884d8' } }}
                                    height={200}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w3-third">
                        <div className="w3-card">
                            <h2 className="w3-container w3-blue w3-center">Views per Video</h2>
                            <div className="w3-container">
                                <VictoryBar
                                    data={videoData}
                                    x="label"
                                    y="views"
                                    style={{ data: { fill: '#8884d8' } }}
                                    height={200}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w3-third">
                        <div className="w3-card">
                            <h2 className="w3-container w3-blue w3-center">Likes vs. Comments</h2>
                            <div className="w3-container">
                                <VictoryStack height={200}>
                                    <VictoryBar
                                        data={videoData}
                                        x="label"
                                        y="likes"
                                        style={{ data: { fill: '#8884d8' } }}
                                    />
                                    <VictoryBar
                                        data={videoData}
                                        x="label"
                                        y="comments"
                                        style={{ data: { fill: '#ff8a65' } }}
                                    />
                                </VictoryStack>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w3-card w3-half w3-margin-top">
                    <h2 className="w3-container w3-blue w3-center">Watchtime vs. Views</h2>
                    <div className="w3-container">
                        <VictoryChart height={200}>
                            <VictoryAxis
                                tickFormat={() => ''}
                                style={{ tickLabels: { fontSize: 10, padding: 5 } }}
                            />
                            <VictoryAxis dependentAxis />
                            <VictoryBar
                                data={videoData}
                                x="label"
                                y="watchtime"
                                style={{ data: { fill: '#8884d8' } }}
                            />
                            <VictoryLine
                                data={videoData}
                                x="label"
                                y="views"
                                style={{ data: { stroke: '#ff8a65' } }}
                            />
                        </VictoryChart>
                    </div>
                </div>
                <div className="w3-card  w3-half w3-margin-top">
                    <h2 className="w3-container w3-blue w3-center">Watchtime vs. Views</h2>
                    <div className="w3-container">
                        <VictoryChart height={200}>
                            <VictoryAxis
                                tickFormat={() => ''}
                                style={{ tickLabels: { fontSize: 10, padding: 5 } }}
                            />
                            <VictoryAxis dependentAxis />
                            <VictoryBar
                                data={videoData}
                                x="label"
                                y="watchtime"
                                style={{ data: { fill: '#8884d8' } }}
                            />
                            <VictoryLine
                                data={videoData}
                                x="label"
                                y="views"
                                style={{ data: { stroke: '#ff8a65' } }}
                            />
                        </VictoryChart>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Analytics;
