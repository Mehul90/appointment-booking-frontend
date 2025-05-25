import React from 'react'
import { Navigate } from 'react-router-dom';

/**
 * A higher-order component that protects routes by checking user authentication.
 * If the user is authenticated, renders the child components; otherwise, redirects to the login page.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render if authenticated.
 * @returns {React.ReactNode} The protected route or a redirect to the login page.
 */
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
