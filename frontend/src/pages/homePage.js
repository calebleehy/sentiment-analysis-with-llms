import React from "react";
import Navigation from "../compoents/navigation";
import '../styles/App.css';
import { Container } from "react-bootstrap";
import trustImage from '../asset/gxsvstrust.jpg';
import recommendationImage from  '../asset/recommendations.jpg';
import gxsImage from '../asset/gxs.jpg';

const HomePage = () => {

    return (
        <div>
            <Navigation />
            <div className="plain-background">
                    <div className="overlay-text roboto-bold">
                        Welcome to GXS Sentiment Analysis!
                    </div>
            </div>
            <Container className = "Container">
            <div className="gxs-content Container" style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="content-box">
                    <img src={gxsImage} alt="GXS" className="image" />
                    <div className="in-box-text">View the most pressing issues for GXS here.</div>
                    <a href="/dashboard"><button className="action-button">Click here</button></a>
                </div>
                <div className="content-box">
                    <img src={trustImage} alt="GXS vs Trust" className="image" />
                    <div className="in-box-text">See how we perform against Trust!</div>
                    <a href="/comparisons"><button className="action-button">Click here</button></a>
                </div>
                <div className="content-box">
                    <img src={recommendationImage} alt="Recommendation" className="image" />
                    <div  className="in-box-text">View all our recommendations here!</div>
                    <a href="/summary"><button className="action-button">Click here</button></a>
                </div>
                </div>
            </Container>
          </div>
    );
}

export default HomePage;