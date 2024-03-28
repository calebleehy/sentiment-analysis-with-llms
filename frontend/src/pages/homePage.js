import React from "react";
import Navigation from "../compoents/navigation";
import { useEffect, useState } from "react";
import { getMessage } from "../api/message";
import '../styles/App.css';


const HomePage = () => {

    const [message, setMessage] = useState([]);

    const fetchData = async() => {
        try{
            const data = await getMessage();
            const content = data.sentence;
            setMessage(content);

        } catch (error){

        };
    };

    useEffect(() => {fetchData();}, []);


    return (
        <div>
            <Navigation />
            <h1>HomePage</h1>
            <p>{message}</p>

        </div>
    );
}

export default HomePage;