import { apiEndPoints, APIMethods, mastersAPICall } from "@/utils/apiUtilities"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const userLogin = createAsyncThunk(
    "login/userLogin",
    async (data, { rejectWithValue, fulfillWithValue }) => {
        try {
            const response = await mastersAPICall({
                endPoint: apiEndPoints.userLogin,
                method: APIMethods.POST,
                params: data
            })

            return fulfillWithValue(response.data)
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const loginSlice = createSlice({
    name: "login",
    initialState: {},
    reducers: {},
    extraReducers: (builder) => {}
})


export default loginSlice