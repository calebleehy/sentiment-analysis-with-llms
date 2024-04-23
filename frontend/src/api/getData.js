import axios from 'axios';


export const getReviewData = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:4000/reviewData');
        if (response.status === 200){
            console.log(response)
            const data = response.data;
            const jsonString = JSON.stringify(data, null, 2);
            const parsedData = JSON.parse(jsonString);
            return parsedData;
        };

    }
    catch (error){
    console.error('Error fetching data:', error);
    throw error;
    }

}

export const getBankNpsData = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:4000/bankNps');
        if (response.status === 200){
            console.log(response)
            const data = response.data;
            const jsonString = JSON.stringify(data, null, 2);
            const parsedData = JSON.parse(jsonString);
            return parsedData;
        };

    }
    catch (error){
    console.error('Error fetching data:', error);
    throw error;
    }

}

export const getBankServiceFreq = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:4000/bankServiceFreq');
        if (response.status === 200){
            console.log(response)
            const data = response.data;
            const jsonString = JSON.stringify(data, null, 2);
            const parsedData = JSON.parse(jsonString);
            return parsedData;
        };

    }
    catch (error){
    console.error('Error fetching data:', error);
    throw error;
    }

}

export const getBankIssueFreq = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:4000/bankIssueFreq');
        if (response.status === 200){
            console.log(response)
            const data = response.data;
            const jsonString = JSON.stringify(data, null, 2);
            const parsedData = JSON.parse(jsonString);
            return parsedData;
        };

    }
    catch (error){
    console.error('Error fetching data:', error);
    throw error;
    }

}

export const getMonthNps = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:4000/monthNps');
        if (response.status === 200){
            console.log(response)
            const data = response.data;
            const jsonString = JSON.stringify(data, null, 2);
            const parsedData = JSON.parse(jsonString);
            return parsedData;
        };

    }
    catch (error){
    console.error('Error fetching data:', error);
    throw error;
    }

}

export const getServIssueRec = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:4000/servIssueRec');
        if (response.status === 200){
            console.log(response)
            const data = response.data;
            const jsonString = JSON.stringify(data, null, 2);
            const parsedData = JSON.parse(jsonString);
            return parsedData;
        };

    }
    catch (error){
    console.error('Error fetching data:', error);
    throw error;
    }

}

export const getWhatifBankNps = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:4000/whatifBankNps');
        if (response.status === 200){
            console.log(response)
            const data = response.data;
            const jsonString = JSON.stringify(data, null, 2);
            const parsedData = JSON.parse(jsonString);
            return parsedData;
        };

    }
    catch (error){
    console.error('Error fetching data:', error);
    throw error;
    }

}

export const getWhatifRecNps = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:4000/whatifRecNps');
        if (response.status === 200){
            console.log(response)
            const data = response.data;
            const jsonString = JSON.stringify(data, null, 2);
            const parsedData = JSON.parse(jsonString);
            return parsedData;
        };

    }
    catch (error){
    console.error('Error fetching data:', error);
    throw error;
    }

}



