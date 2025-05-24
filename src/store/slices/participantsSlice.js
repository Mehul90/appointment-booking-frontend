import { apiEndPoints, APIMethods, mastersAPICall } from "@/utils/apiUtilities";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/**
 * Async thunk to create participants.
 *
 * Dispatches a POST request to the API endpoint for creating participants using the provided data.
 * Returns "Success" if the operation is successful, otherwise rejects with the error message.
 *
 * @function
 * @param {Object} data - The participant data to be sent in the request.
 * @returns {Promise<string|any>} Returns "Success" on success, or rejects with the error message.
 */
export const createParticipants = createAsyncThunk(
    "participants/createParticipants",
    async (data, { rejectWithValue, fulfillWithValue,  dispatch }) => {
        try {
            
            const response = await mastersAPICall({ endPoint: apiEndPoints.createParticipants, method: APIMethods.POST, params: data  })
            dispatch(getAllParticipants());
            return fulfillWithValue(response.data);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

/**
 * Async thunk to fetch all participants.
 *
 * Dispatches an API call to retrieve participant data from the backend.
 * On success, returns the response data.
 * On failure, returns a rejected value with the error message.
 *
 * @function
 * @name getAllParticipants
 * @async
 * @param {void} _ - No arguments are passed to this thunk.
 * @returns {Promise<object>} The response data containing participants, or a rejected value with an error message.
 */
export const getAllParticipants = createAsyncThunk(
    "participants/getAllParticipants",
    async (_, { rejectWithValue }) => {
        try {
            const response = await mastersAPICall({ endPoint: apiEndPoints.getParticipants, method: APIMethods.GET  })
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Async thunk to delete participants.
 *
 * Dispatches an API call to delete participants using the provided data.
 *
 * @function
 * @param {Object} data - The data required to identify participants to delete.
 * @returns {Promise<any>} The response data on success, or an error message on failure.
 */
export const deleteParticipants = createAsyncThunk(
    "participants/deleteParticipants",
    async (data, { rejectWithValue, dispatch, fulfillWithValue  }) => {
        try {
            const response = await mastersAPICall({ endPoint: apiEndPoints.deleteParticipants(data), method: APIMethods.DELETE  })

            dispatch(getAllParticipants());

            return fulfillWithValue(response.data);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * Async thunk to update participant details.
 *
 * Dispatches an API call to update a participant's information using the provided data.
 *
 * @function
 * @async
 * @param {Object} data - The data required to update the participant.
 * @param {number|string} data.id - The unique identifier of the participant to update.
 * @param {Object} data.participantData - The participant data to be updated.
 * @returns {Promise<Object>} The updated participant data on success, or an error message on failure.
 */
export const updateParticipants = createAsyncThunk(
    "participants/updateParticipants",
    async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
        try {
            const response = await mastersAPICall({ endPoint: apiEndPoints.updateParticipants(data.id), method: APIMethods.PUT, params: data.participantData  })

            dispatch(getAllParticipants());

            return fulfillWithValue(response.data);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const participantsSlice = createSlice({
    name: "participants",
    initialState: {
        isLoading: false,
        participantsList: [],
        deleteParticipantsModal: false,
        deleteInProgress: false,
        participantId: null
    },
    reducers: {
        setDeleteParticipantsModal: (state, action) => {
            state.deleteParticipantsModal = action.payload.open;
            state.participantId = action.payload.participantId || null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllParticipants.pending, (state) => {
                state.isLoading = true;
                state.participantsList = [...state.participantsList];
            })
            .addCase(getAllParticipants.fulfilled, (state, action) => {
                state.isLoading = false;
                state.participantsList = [...action.payload.data];
            })
            .addCase(getAllParticipants.rejected, (state, action) => {
                state.isLoading = false;
                state.participantsList = [...state.participantsList];
            })
            .addCase(createParticipants.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createParticipants.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(createParticipants.rejected, (state, action) => {
                state.isLoading = false;
            })
            .addCase(updateParticipants.pending, (state) => {
                state.isLoading = true;
            }
            )
            .addCase(updateParticipants.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(updateParticipants.rejected, (state, action) => {
                state.isLoading = false;
            })
            .addCase(deleteParticipants.pending, (state) => {
                state.deleteInProgress = true;
            })
            .addCase(deleteParticipants.fulfilled, (state, action) => {
                state.deleteInProgress = false;
            })
            .addCase(deleteParticipants.rejected, (state, action) => {
                state.deleteInProgress = false;
            });
    },
});

export const { setDeleteParticipantsModal } = participantsSlice.actions;

export default participantsSlice;
