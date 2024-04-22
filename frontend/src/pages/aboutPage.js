import React from "react";
import { Container,Row,Col } from "react-bootstrap";
import Navigation from "../compoents/navigation";
import '../styles/App.css';
import image from '../asset/image.jpg';

const AboutPage = () => {
    return (
        <div>
            <Row>
                <Col>
            <Navigation />
            <div className="plain-background">
                <div className="overlay-text roboto-bold">
                    About Us
                </div>
            </div>
            </Col>
            </Row>
            <Container className="Container" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={image} alt="About us" className="about-us"/>
            <div>
            <h2 className="roboto-bold" style={{marginLeft:'10vw',marginTop:'4vh',color:'#6237A0'}}>Our Project</h2>
                <p className="roboto-regular" style={{fontSize: '3vh',maxWidth: '70vw',marginLeft:'10vw',marginTop:'1vh',flex: '1'}}>
                    We are a group of students taking DSA3101 doing a <strong style={{color:'#6237A0'}}>customer feedback sentiment analysis 
                    project</strong> for GXS Bank. Using advanced Natural Language Processing (NLP) techniques such 
                    as <strong style={{color:'#6237A0'}}>Large Language Models (LLMs)</strong>, we analyzed customer reviews from Google Play Store and Apple Store to 
                    help GXS understand and improve customer satisfaction.
                </p>
                </div>
            </Container>
            <Container className="Container">
                <h2 className="roboto-bold" style={{fontSize: '6vh',textAlign:'center',marginTop:'20vh',color:'#6237A0'}}>
                    Key Features
                </h2>
            </Container>
            <div className="key-features-container">
                <div className="key-feature roboto-regular" style={{ background: '#28104E' }}>
                    Customizable Filters      
                </div>
                <div className="key-feature roboto-regular" style={{ background: '#28104E' }}>
                    Competitor Analysis
                </div>
                <div className="key-feature roboto-regular" style={{ background: '#28104E' }}>
                    Actionable Insights
                </div>
                </div>
            
            <div style={{display:"flex",marginTop:'2vh'}}>
            <p className="roboto-regular" style={{ fontSize: '3vh',marginLeft:'5vw'}}>Filter data by sentiment, service, and issue to focus on specific insights.</p>
            <p className="roboto-regular" style={{ fontSize: '3vh',marginLeft:'13vw' }}>Compare sentiment trends with competitors to benchmark performance.</p>
            <p className="roboto-regular" style={{ fontSize: '3vh',marginLeft:'13vw'}}>Receive recommendations for improving customer experience based on sentiment analysis.</p>
            </div>
            <Container>
                <h2 className="roboto-bold"  style={{marginTop:'10vh',color:'#6237A0'}}>
                    Our Members
                </h2>

                <p className="roboto-regular-italic">
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
