import React from "react";
import { Navigate } from "react-router-dom";

/**
 * A route guard component that restricts access to public routes for authenticated users.
 *
 * If the user is authenticated (i.e., a token exists in localStorage), they are redirected to the dashboard ("/").
 * Otherwise, the child components are rendered, allowing access to public routes such as login or signup.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render if the user is not authenticated.
 * @returns {React.ReactNode} The rendered children or a redirect to the dashboard.
 */
const PublicRoutes = ({ children }) => {
    // Check if the user is authenticated
    const isAuthenticated = () => {
        // Replace with your authentication logic
        return localStorage.getItem("token") !== null;
    };

    return isAuthenticated() ? <Navigate to="/" replace={true} /> : children; // Redirect to dashboard if already authenticated
};

export default PublicRoutes;
