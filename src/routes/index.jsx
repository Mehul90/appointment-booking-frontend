import MainLayout from "@/components/layout";
import AppointmentForm from "@/pages/AppointmentForm";
import Calendar from "@/pages/Calendar";
import Login from "@/pages/Login";
import Participants from "@/pages/Participants";
import { createBrowserRouter } from "react-router-dom";

export const AppRoutes = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "/Calendar",
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
]);
