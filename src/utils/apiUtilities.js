import axios from "axios";
import { envSettings } from "./env.config";
import { userLogout } from ".";
const { apiURL } = envSettings;

export const apiEndPoints = {
    // Login endpoints
    userLogin: "/api/login",

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

            // remove Authorization header if endPoint is login
            if (endPoint === apiEndPoints.userLogin) {
                delete requestOptions.headers.Authorization;
            }

            // if the method is GET, remove the body from the request options
            if (method === APIMethods.POST || method === APIMethods.PUT) {
                requestOptions.data = params;
            }

            const response = await axios({...requestOptions});
            const responseData = await response.data;
            
            return resolve({ data: responseData, error: false, message: "Success" });

    
        } catch (error) {
            if(error.response && error.response.status === 400 && endPoint === apiEndPoints.createParticipants){
                const { errors: [fieldError] } = error.response.data;

                return reject({ data: [], error: true, message: fieldError.message });
            }

            // if token is expired, remove the token and redirect to login page
            if(endPoint !== apiEndPoints.userLogin && error.status === 401) {
                userLogout();
                return reject({ data: [], error: true, message: "Token expired" });
            }
            return reject({ data: [], error: true, message: error?.response?.data?.message || "Something went wrong" });
        }
    });
}