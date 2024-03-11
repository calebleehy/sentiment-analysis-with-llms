import axios from 'axios';

const baseUrl = 'http://127.0.0.1:5000';

export const getMessage = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:4000/testingApi');
        if (response.status == 200){
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
