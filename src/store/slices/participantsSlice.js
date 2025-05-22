import { apiEndPoints, APIMethods, mastersAPICall } from "@/utils/apiUtilities";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    participantsList: [],
};

export const createParticipants = createAsyncThunk(
    "participants/createParticipants",
    async (data, { rejectWithValue }) => {
        try {
            
            const response = await mastersAPICall({ endPoint: apiEndPoints.createParticipants, method: APIMethods.POST, params: data  })
            return "Success";
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

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

export const deleteParticipants = createAsyncThunk(
    "participants/deleteParticipants",
    async (data, { rejectWithValue, dispatch, fulfillWithValue  }) => {
        try {
            const response = await mastersAPICall({ endPoint: apiEndPoints.deleteParticipants(data), method: APIMethods.DELETE  })

            return fulfillWithValue(response.data);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateParticipants = createAsyncThunk(
    "participants/updateParticipants",
    async (data, { rejectWithValue, fulfillWithValue }) => {
        try {
            const response = await mastersAPICall({ endPoint: apiEndPoints.updateParticipants(data.id), method: APIMethods.PUT, params: data.participantData  })

            return fulfillWithValue(response.data);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const participantsSlice = createSlice({
    name: "participants",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createParticipants.fulfilled, (state, action) => {
                state.todos = action.payload;
                console.log("Fulfiled");
                // set the state with the response data
                state.participantsList = [...state.participantsList, action.payload];
            })
            .addCase(createParticipants.rejected, (state, action) => {
                console.log("Rejected");
                state.participantsList = action.payload;
            })
            .addCase(createParticipants.pending, (state, action) => {
                console.log("Pending");
            })
            .addCase(getAllParticipants.fulfilled, (state, action) => {
                state.participantsList = [...state.participantsList, ...action.payload];
                console.log("Fulfiled");
                // set the state with the response data
            })
            .addCase(getAllParticipants.rejected, (state, action) => {
                state.participantsList = [...state.participantsList];
                state.participantsList = action.payload;
            })
            .addCase(getAllParticipants.pending, (state, action) => {
                state.participantsList = [...state.participantsList];
            });
    },
});

export default participantsSlice;
