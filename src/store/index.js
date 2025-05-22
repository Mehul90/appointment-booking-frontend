import { configureStore } from '@reduxjs/toolkit';
import { participantsSlice } from './slices/participantsSlice';

export const store = configureStore({
	reducer: {
		participantsSlice: participantsSlice
	},
})