import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoutes = ({ children }) => {
    // Check if the user is authenticated
    const isAuthenticated = () => {
        // Replace with your authentication logic
        return localStorage.getItem("token") !== null;
    };

    return isAuthenticated() ? <Navigate to="/" replace={true} /> : children; // Redirect to dashboard if already authenticated
};

export default PublicRoutes;
