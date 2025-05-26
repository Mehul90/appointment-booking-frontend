import MainLayout from "@/components/layout";
import AppointmentForm from "@/pages/AppointmentForm";
import Calendar from "@/pages/Calendar";
import Login from "@/pages/Login";
import Participants from "@/pages/Participants";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import PublicRoutes from "./PublicRoutes";
import NotFound from "@/pages/NotFound";

/**
 * Defines the application's main route configuration using React Router's `createBrowserRouter`.
 *
 * Route protection is handled by `ProtectedRoutes` and `PublicRoutes` components.
 *
 * @constant
 * @type {import("react-router-dom").Router}
 */
export const AppRoutes = createBrowserRouter([
    {
        path: "/login",
        element: (
            <PublicRoutes>
                <Login />
            </PublicRoutes>
        ),
    },
    {
        path: "/",
        element: (
            <ProtectedRoutes>
                <MainLayout />
            </ProtectedRoutes>
        ),
        children: [
            {
                path: "/calendar",
                element: <Calendar />,
            },
            {
                path: "/participants",
                element: <Participants />,
            },
            {
                path: "/AppointmentForm",
                element: <AppointmentForm />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);
