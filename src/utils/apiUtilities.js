import axios from "axios";
import { envSettings } from "./env.config";
const { apiURL } = envSettings;

export const apiEndPoints = {
    // Participants endpoints
    createParticipants: "/api/participants/create",
    getParticipants: "/api/participants/list",
    updateParticipants: (participantId) =>  `/api/participants/update/${participantId}`,
    deleteParticipants: (participantId) => `/api/participants/delete/${participantId}`,

    // Appointments endpoints
    createAppointment: "/api/appointments/create",
    getAppointments: "/api/appointments/list",
    updateAppointment: (appointmentId) => `/api/appointments/update/${appointmentId}`,
    deleteAppointment: (appointmentId) => `/api/appointments/delete/${appointmentId}`,
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
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    'ngrok-skip-browser-warning': true
                },
            };

            // if the method is GET, remove the body from the request options
            if (method === APIMethods.POST || method === APIMethods.PUT) {
                requestOptions.data = params;
            }

            const response = await axios({...requestOptions});
;
            const responseData = await response.data;
            
            return resolve({ data: responseData, error: false, message: "Success" });

    
        } catch (error) {
            return reject({ data: [], error: true, message: "Error" });
        }
    });
}