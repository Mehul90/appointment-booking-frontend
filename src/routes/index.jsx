import MainLayout from "@/components/layout";
import AppointmentForm from "@/pages/AppointmentForm";
import Calendar from "@/pages/Calendar";
import Login from "@/pages/Login";
import Participants from "@/pages/Participants";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";

export const AppRoutes = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
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
                path: "/Calendar",
                element: (
                    <ProtectedRoutes>
                        <Calendar />
                    </ProtectedRoutes>
                ),
            },
            {
                path: "/participants",
                element: (
                    <ProtectedRoutes>
                        <Participants />
                    </ProtectedRoutes>
                ),
            },
            {
                path: "/AppointmentForm",
                element: (
                    <ProtectedRoutes>
                        <AppointmentForm />
                    </ProtectedRoutes>
                ),
            },
        ],
    },
]);
