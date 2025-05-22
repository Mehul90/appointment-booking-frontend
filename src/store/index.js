import { configureStore } from '@reduxjs/toolkit';
import { participantsSlice } from './slices/participantsSlice';
import { appointmentsSlice } from './slices/appointmentsSlice';
import { loginSlice } from './slices/loginSlice';

export const store = configureStore({
	reducer: {
		participants: participantsSlice.reducer,
		appointments: appointmentsSlice.reducer,
		login: loginSlice.reducer,
	},
})