import axios from "axios";
import { envSettings } from "./env.config";
const { apiURL } = envSettings;

export const apiEndPoints = {
    createParticipants: "/api/participants/create",
    getParticipants: "/api/participants",
    updateParticipants: (participantId) =>  `/api/participants/update/${participantId}`,
    deleteParticipants: (participantId) => `/api/participants/delete/${participantId}`,
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

            const baseURL = apiURL + endPoint;

            const requestOptions = {
                method: method,
                url: baseURL,
                data: params,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            };

            // if the method is GET, remove the body from the request options
            if (method === APIMethods.GET) {
                delete requestOptions.body;
            }

            const response = await axios({...requestOptions});
;
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