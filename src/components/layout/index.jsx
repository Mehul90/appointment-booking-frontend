import { createPageUrl, userLogout } from "@/utils";
import { Calendar, CalendarDays, LogOut, Menu, PlusCircle, Users, X } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";

const MainLayout = () => {
    const { pathname } = useLocation();

    if (pathname === "/") {
        return <Navigate to={"/calendar"} />;
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const isActive = (pageName) => {
        return pathname === createPageUrl(pageName);
    };

    const menuItems = [
        { name: "Calendar", icon: Calendar, path: "Calendar" },
        { name: "Participants", icon: Users, path: "Participants" },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Mobile sidebar backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-sm transform transition-transform duration-200 ease-in-out ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                }`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between px-6 h-16 border-b">
                        <Link
                            to={createPageUrl("Calendar")}
                            className="flex items-center space-x-2"
                        >
                            <CalendarDays className="h-6 w-6 text-indigo-600" />
                            <span className="text-[17px] font-semibold text-gray-900">
                                Appointment Builder
                            </span>
                        </Link>
                        <button
                            className="md:hidden text-gray-500 hover:text-gray-700"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="px-4 py-6">
                        <Link
                            to={createPageUrl("AppointmentForm")}
                            className="flex items-center justify-center w-full px-4 py-2 mb-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <PlusCircle className="w-5 h-5 mr-2" />
                            <span>New Appointment</span>
                        </Link>

                        <nav className="space-y-1">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={createPageUrl(item.path)}
                                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                                        isActive(item.path)
                                            ? "bg-indigo-50 text-indigo-700"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <item.icon
                                        className={`h-5 w-5 mr-3 ${
                                            isActive(item.path)
                                                ? "text-indigo-600"
                                                : "text-gray-500"
                                        }`}
                                    />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-auto border-t">
                        <div className="px-4 py-4">
                            <div className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 cursor-pointer">
                                <Link
                                    type=""
                                    // to={createPageUrl(item.path)}
                                    className="w-full flex items-center px-4 py-3 rounded-lg transition-colors bg-indigo-50 text-indigo-700"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        userLogout()
                                    }}
                                >
                                    <LogOut/>
                                    <span className="font-medium">Logout</span>
                                </Link>
                            </div>
                            {/* <div className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 cursor-pointer"></div> */}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Mobile header */}
                <header className="flex items-center h-16 px-4 bg-white border-b md:hidden">
                    <button className="text-gray-600" onClick={() => setIsSidebarOpen(true)}>
                        <Menu className="h-6 w-6" />
                    </button>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
