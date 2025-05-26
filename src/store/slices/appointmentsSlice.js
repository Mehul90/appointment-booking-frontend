import { apiEndPoints, APIMethods, mastersAPICall } from "@/utils/apiUtilities";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { format } from "date-fns";

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
    async (data, { rejectWithValue,  fulfillWithValue, dispatch }) => {
        try {
            const response = await mastersAPICall({ endPoint: apiEndPoints.createAppointment, method: APIMethods.POST, params: data })

            dispatch(getAppointments());

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
    async (_, { rejectWithValue,  fulfillWithValue }) => {
        try {
            const response = await mastersAPICall({ endPoint: apiEndPoints.getAppointments, method: APIMethods.GET })

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
    async (data, { rejectWithValue,  fulfillWithValue, dispatch }) => {
        try {
            const response = await mastersAPICall({ endPoint: apiEndPoints.updateAppointment(data.id), method: APIMethods.PUT, params: data.data })

            dispatch(getAppointments());

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
    async (data, { rejectWithValue,  fulfillWithValue, dispatch }) => {
        try {
            const response = await mastersAPICall({ endPoint: apiEndPoints.deleteAppointment(data), method: APIMethods.DELETE })

            dispatch(getAppointments())

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
    initialState: {
        isLoading: false,
        appointmentsList: [],
        isSeeMoreAppointments: false,
        date: "",
        time: "",
        seeMoreAppointsments: [],
        deleteAppointmentModal: false,
        deleteInProgress: false,
    },
    reducers: {
        handleSeeMoreAppontments: (state, action) => {
            state.isSeeMoreAppointments = action.payload.open;
            state.date = action.payload.date || "";
            state.time = action.payload.time || "";
            state.seeMoreAppointsments = action.payload.appointments;
        },
        resetSeeMoreAppointments: (state) => {
            state.isSeeMoreAppointments = false;
            state.seeMoreAppointsments = [];
        },
        setDeleteAppointmentModal: (state, action) => {
            state.deleteAppointmentModal = action.payload.open;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createAppointment.pending, (state) => {
                state.isLoading = true;
                state.appointmentsList = [...state.appointmentsList];
            })
            .addCase(createAppointment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.appointmentsList = [...state.appointmentsList];
            })
            .addCase(createAppointment.rejected, (state) => {
                state.isLoading = false;
                state.appointmentsList = [...state.appointmentsList];
            })
            .addCase(getAppointments.pending, (state) => {
                state.appointmentsList = [...state.appointmentsList];
            })
            .addCase(getAppointments.fulfilled, (state, action) => {

                const formatedData = action.payload.data.map((item) => {

                    const startTime = new Date(item.startTime * 1000);
                    const endTime = new Date(item.endTime * 1000);

                    return {
                        ...item,
                        startTime: format(startTime, "HH:mm"),
                        endTime: format(endTime, "HH:mm"),
                        date: format(startTime, "yyyy-MM-dd"),
                    }
                })
                
                state.appointmentsList = [...formatedData];
            })
            .addCase(getAppointments.rejected, (state) => {
                state.appointmentsList = [...state.appointmentsList];
            })
            .addCase(deleteAppointment.pending, (state) => {
                state.deleteInProgress = true;
            })
            .addCase(deleteAppointment.fulfilled, (state) => {
                state.deleteInProgress = false;
                state.isSeeMoreAppointments = false;
                state.seeMoreAppointsments = [];
            })
            .addCase(deleteAppointment.rejected, (state) => {
                state.deleteInProgress = false;
                state.isSeeMoreAppointments = false;
                state.seeMoreAppointsments = [];
            })
    }
})

export const { handleSeeMoreAppontments, resetSeeMoreAppointments, setDeleteAppointmentModal } = appointmentsSlice.actions


export default appointmentsSlice