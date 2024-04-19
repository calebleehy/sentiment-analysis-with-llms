import React, {useState}from "react";
import { Container } from "react-bootstrap";
import Navigation from "../compoents/navigation";
import '../styles/App.css';
import image from '../asset/image.jpg';

const AboutPage = () => {
    return (
        <div>
            <Navigation />
            <div className="plain-background">
                <div className="overlay-text">
                    About Us
                </div>
            </div>
            <Container className="Container" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={image} alt="About us" className="about-us"/>
            <div>
            <h2 style={{marginLeft:'10vw',marginTop:'4vh'}}>Our Project</h2>
                <p style={{fontSize: '3vh',maxWidth: '70vw',marginLeft:'10vw',marginTop:'1vh',flex: '1'}}>
                    We are a group of students taking DSA3101 doing a customer feedback sentiment analysis 
                    project for GXS Bank. Using advanced Natural Language Processing (NLP) techniques such as 
                    Large Language Models (LLMs), we analyzed customer reviews from Google Play Store and Apple Store to 
                    help GXS understand and improve customer satisfaction.
                </p>
                </div>
            </Container>
            <Container className="Container">
                <h2 style={{fontSize: '6vh',textAlign:'center',marginTop:'5vh'}}>
                    Key Features
                </h2>
            </Container>
            <div className="key-features-container">
                <div className="key-feature" style={{ background: '#28104E' }}>
                    Customizable Filters      
                </div>
                <div className="key-feature" style={{ background: '#28104E' }}>
                    Competitor Analysis
                </div>
                <div className="key-feature" style={{ background: '#28104E' }}>
                    Actionable Insights
                </div>
            </div>
            <div style={{display:"flex",marginTop:'2vh'}}>
            <p style={{ fontSize: '3vh',marginLeft:'5vw'}}>Filter data by sentiment, service, and issue to focus on specific insights.</p>
            <p style={{ fontSize: '3vh',marginLeft:'13vw' }}>Compare sentiment trends with competitors to benchmark performance.</p>
            <p style={{ fontSize: '3vh',marginLeft:'13vw'}}>Receive recommendations for improving customer experience based on sentiment analysis.</p>

            </div>
            <Container className="Container ">
                <h2 style={{marginTop:'5vh'}}>
                    Our Members
                </h2>

                <p className="px-3">
                    <em>
                        Caleb Lee Heng Yi <br />
                        Cheryl Tan Geok Ching <br />
                        Lim Jing Rui <br />
                        Ng Elangel <br />
                        Ng Keen Yung <br />
                        Sarah Goh Yue En <br />
                        Shi Shuangqi <br />
                        Wang Jianing <br />
                    </em>
                </p>
            </Container>

        </div>
    )

}

export default AboutPage;
