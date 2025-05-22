import React from 'react'
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({ children }) => {

    // Check if the user is authenticated
    const isAuthenticated = () => {
        // Replace with your authentication logic
        return localStorage.getItem('token') !== null;
    }

    return (
        isAuthenticated() ? children : <Navigate to="/login" replace={true} /> // Redirect to login if not authenticated
    );
}

export default ProtectedRoutes
