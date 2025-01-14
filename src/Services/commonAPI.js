import axios from 'axios';

export const commonAPI = async (httpMethod, url, reqBody, reqHeader) => {
    const reqConfig = {
        method: httpMethod,
        url,
        data: reqBody,
        headers: reqHeader || {
            "Content-Type": "application/json"
        }
    };

    try {
        const response = await axios(reqConfig);
        return response;
    } catch (error) {
        throw error; 
    }
};

export default commonAPI;