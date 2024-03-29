import React from "react";
import { Container } from "react-bootstrap";
import Navigation from "../compoents/navigation";
import '../styles/App.css';
import data from '../data.json'

const AboutPage = () => {
    return (
        <div>
            <Navigation />
            <h1>About</h1>

            <Container className="Container">
                <h2>
                    Introduction
                </h2>

                <p className="px-3">introduction details...</p>
            </Container>

            <Container className="Container ">
                <h2>
                    Memebers
                </h2>

                <p className="px-3">
                    <em>
                        Caleb Lee Heng Yi <br />
                        Cheryl Tan Geok Ching <br />
                        Lim Jing Rui <br />
                        Ng Elangel <br />
                        Ng Keen Yung <br />
                        Sarah Goh Yue En <br />
                        Shi Shuanqi <br />
                        Wang Jianing <br />
                    </em>
                </p>
            </Container>

            <Container>
                <h2>
                    Contact
                </h2>
                <p className="px-3">
                    <em>
                        contact person and contact details
                    </em>
                </p>
            </Container>

        </div>
    )

}

export default AboutPage;