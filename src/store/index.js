import { configureStore } from '@reduxjs/toolkit';
import { participantsSlice } from './slices/participantsSlice';
import { appointmentsSlice } from './slices/appointmentsSlice';

export const store = configureStore({
	reducer: {
		participants: participantsSlice.reducer,
		appointments: appointmentsSlice.reducer,
	},
})