import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    participantsList: [],
};

export const getParticipants = createAsyncThunk(
    "participants/getParticipants",
    async ({ length }, { rejectWithValue }) => {}
);

export const participantsSlice = createSlice({
    name: "participants",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getParticipants.fulfilled, (state, action) => {
                state.todos = action.payload;
                console.log("Fulfiled");
            })
            .addCase(getParticipants.rejected, (state, action) => {
                console.log("Rejected");
            })
            .addCase(getParticipants.pending, (state, action) => {
                console.log("Pending");
            });
    },
});

export default participantsSlice.reducer;
