import React from "react";
import { Container } from "react-bootstrap";
import Navigation from "../compoents/navigation";
import '../styles/App.css';

const AboutPage = () => {
    return (
        <div>
            <Navigation />
            <h1>About</h1>

            <Container className="Container">
                <h2>
                    Introduction
                </h2>

                <p className="px-3">
                    We are a group of students taking DSA3101 doing a customer feedback sentiment analysis 
                    project for GXS Bank. Using advanced Natural Language Processing (NLP) techniques such as 
                    Large Language Models (LLMs), we analyzed customer reviews from Google Play Store and Apple to 
                    help GXS understand and improve customer satisfaction.
                </p>
            </Container>
            <Container className="Container">
                <h2>
                    Key Features
                </h2>
                <ul>
                  <li>
                  <strong>Customizable Filters:</strong> Filter data by sentiment, service, and issue to focus on specific insights.
                  </li>
                  <li>
                  <strong>Competitor Analysis:</strong> Compare sentiment trends with competitors to benchmark performance.
                  </li>
                  <li>
                  <strong>Actionable Insights:</strong> Receive recommendations for improving customer experience based on sentiment analysis.
                  </li>
                  </ul>
            </Container>

            <Container className="Container ">
                <h2>
                    Members
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
