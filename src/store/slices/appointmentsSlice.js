import { apiEndPoints, APIMethods, mastersAPICall } from "@/utils/apiUtilities";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/**
 * Async thunk for creating a new appointment.
 *
 * Dispatches an API call to create an appointment using the provided data.
 * On success, fulfills with the response data.
 * On failure, rejects with the error message.
 *
 * @function
 * @param {Object} data - The appointment data to be sent in the API request.
 * @returns {Promise<Object>} The fulfilled response data or rejected error message.
 */
export const createAppointment = createAsyncThunk(
    "appointments/createAppointment",
    async (data, { rejectWithValue,  fulfillWithValue }) => {
        try {
            const response = await mastersAPICall({ endPoint: apiEndPoints.createAppointment, method: APIMethods.POST, params: data })

            return fulfillWithValue(response.data);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Async thunk to fetch appointments from the API.
 *
 * @function
 * @param {Object} data - The parameters to be sent with the API request.
 * @returns {Promise<Object>} The fulfilled or rejected action with the API response data or error message.
 */
export const getAppointments = createAsyncThunk(
    "appointments/getAppointments",
    async (data, { rejectWithValue,  fulfillWithValue }) => {
        try {
            const response = await mastersAPICall({ endPoint: apiEndPoints.getAppointments, method: APIMethods.GET, params: data })

            return fulfillWithValue(response.data);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Async thunk to update an appointment.
 *
 * Dispatches a PUT request to update the appointment with the given data.
 *
 * @function
 * @param {Object} data - The data for updating the appointment.
 * @param {string|number} data.id - The ID of the appointment to update.
 * @param {Object} data.data - The updated appointment data.
 * @returns {Promise<Object>} The updated appointment data on success, or an error message on failure.
 */
export const updateAppointment = createAsyncThunk(
    "appointments/updateAppointment",
    async (data, { rejectWithValue,  fulfillWithValue }) => {
        try {
            const response = await mastersAPICall({ endPoint: apiEndPoints.updateAppointment(data.id), method: APIMethods.PUT, params: data.data })

            return fulfillWithValue(response.data);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Async thunk to delete an appointment.
 *
 * Dispatches a DELETE request to the API to remove an appointment by its ID.
 *
 * @function
 * @param {Object} data - The data object containing appointment details.
 * @param {string|number} data.appointmentId - The ID of the appointment to delete.
 * @returns {Promise<any>} The fulfilled value with response data or rejected value with error message.
 */
export const deleteAppointment = createAsyncThunk(
    "appointments/deleteAppointment",
    async (data, { rejectWithValue,  fulfillWithValue }) => {
        try {
            const response = await mastersAPICall({ endPoint: apiEndPoints.deleteAppointment(data), method: APIMethods.DELETE })

            return fulfillWithValue(response.data);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


/**
 * Redux slice for managing appointment-related state.
 *
 * @namespace appointmentsSlice
 * @property {Array} initialState.appointmentsList - List of all appointments.
 * @property {Object} initialState.appointmentDetails - Details of a selected appointment.
 * @property {?string} initialState.appointmentStatus - Status of appointment-related actions (e.g., 'loading', 'succeeded', 'failed').
 * @property {?string} initialState.appointmentError - Error message related to appointment actions, if any.
 * @property {Object} reducers - Synchronous reducers for appointments (currently empty).
 * @property {Function} extraReducers - Handles asynchronous actions for appointments (currently empty).
 */
export const appointmentsSlice = createSlice({
    name: "appointments",
    initialState: {},
    reducers: {},
    extraReducers: (builder) => {}
})


export default appointmentsSlice