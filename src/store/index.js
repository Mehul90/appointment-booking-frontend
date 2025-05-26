import { configureStore } from '@reduxjs/toolkit';
import { participantsSlice } from './slices/participantsSlice';
import { appointmentsSlice } from './slices/appointmentsSlice';
import { loginSlice } from './slices/loginSlice';

/**
 * Configures and exports the Redux store for the application.
 * 
 * The store combines the following reducers:
 * - participants: Handles state related to participants.
 * - appointments: Handles state related to appointments.
 * - login: Handles state related to user authentication.
 * 
 * @type {import('@reduxjs/toolkit').EnhancedStore}
 */
export const store = configureStore({
	reducer: {
		participants: participantsSlice.reducer,
		appointments: appointmentsSlice.reducer,
		login: loginSlice.reducer,
	},
})