import React from "react";
import Navigation from "../compoents/navigation";
import '../styles/App.css';
import image from '../asset/image.jpg'; // import the image


const HomePage = () => {

    return (
        <div>
            <Navigation />
            <h1>Home</h1>
            <img src={image} alt="Example image" class = "image"></img>
            <h2 style={{fontSize: '40px', marginTop:'30px'}}>How to navigate the webapp?</h2>
            <ul class="my-list">
              <li>Home Page</li>
              <li>Dashboard Page</li>
                <ul class="my-list">
                  <li><a href="/dashboard">GXS Page</a></li>
                  <p>This page shows the sentiment analysis results of GXS bank.</p>
                  <li><a href="/comparisons">Bank Comparisons Page</a></li>
                  <p>This page compares GXS with Trust bank.</p>
                  <li><a href="/summary">Summary Page</a></li>
                  <p>
                    This page gives a summary of the recommendations and the projected NPS if the recommendations
                    are implemented.
                  </p>
                </ul>
              <li><a href = "/about">About Page</a></li>
              <p>
                  This page gives an introduction of our project and the key features of the webapp. The team members' names
                  and contact details can be found here.
                  </p>
              </ul>


        </div>
    );
}

export default HomePage;