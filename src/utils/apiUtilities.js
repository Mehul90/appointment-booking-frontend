import axios from "axios";
import { envSettings } from "./env.config";
import { userLogout } from ".";
const { apiURL } = envSettings;

/**
 * An object containing API endpoint URLs for user authentication, participants, and appointments.
 */
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



/**
 * Enum for HTTP API methods.
 * @readonly
 * @enum {string}
 * @property {string} GET - Represents the HTTP GET method.
 * @property {string} POST - Represents the HTTP POST method.
 * @property {string} PUT - Represents the HTTP PUT method.
 * @property {string} DELETE - Represents the HTTP DELETE method.
 */
export const APIMethods = {
    GET : 'get',
    POST : 'post',
    PUT : 'put',
    DELETE : 'delete',
}

/**
 * Makes an API call to the specified endpoint with the given method and parameters.
 *
 * @async
 * @function
 * @param {Object} options - The options for the API call.
 * @param {string} options.endPoint - The API endpoint to call.
 * @param {string} options.method - The HTTP method to use (e.g., 'GET', 'POST', 'PUT').
 * @param {Object} [options.params] - The parameters or data to send with the request.
 * @returns {Promise<{data: any, error: boolean, message: string}>} The response data, error status, and message.
 *
 * @throws {Error} Throws an error if the API call fails.
 */
export async function mastersAPICall({ endPoint, method, params }) {
    try {

        const baseURL = apiURL + endPoint;

        const requestOptions = {
            method: method,
            url: baseURL,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
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
        
        return { data: responseData, error: false, message: "Success" };

    } catch (error) {
        if(error.response && error.response.status === 400 && (endPoint === apiEndPoints.createParticipants || !apiEndPoints.updateParticipants("").includes(endPoint))) {
            const { errors: [fieldError] } = error.response.data;

            return { data: [], error: true, message: fieldError.message };
        }

        // if token is expired, remove the token and redirect to login page
        if(endPoint !== apiEndPoints.userLogin && error.status === 401) {
            userLogout();
            return { data: [], error: true, message: "Token expired" };
        }
        return { data: [], error: true, message: error?.response?.data?.message || "Something went wrong" };
    }
}