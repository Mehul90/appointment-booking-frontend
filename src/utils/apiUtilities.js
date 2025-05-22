import axios from "axios";
import { envSettings } from "./env.config";
const { apiURL } = envSettings;

const client = axios.create({
    baseURL: apiURL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});


export const apiEndPoints = {
    createParticipants: ""
};


export const APIMethods = {
    GET : 'get',
    POST : 'post',
    PUT : 'put',
    DELETE : 'delete',
}

export async function mastersAPICall({ endPoint, method, params }) {
    return new Promise(async (resolve, reject) => {
        try {

            const requestOptions = {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: params,
            }

            // if the method is GET, remove the body from the request options
            if (method === APIMethods.GET) {
                delete requestOptions.body;
            }

            const response = await client( endPoint, {...requestOptions});
            const responseData = await response.data;
            // if the response is not ok
            if (response.status === 200) {
                return resolve({ data: responseData, error: false, message: "Success" });
            }

    
        } catch (error) {
            return reject({ data: [], error: true, message: "Error" });
        }
    });
}