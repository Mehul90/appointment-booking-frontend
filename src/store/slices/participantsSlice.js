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
            });
    },
});

export default participantsSlice;
