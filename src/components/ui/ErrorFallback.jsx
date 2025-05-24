import { Button } from "./button";

const ErrorFallback = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md w-full">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
                <p className="text-gray-500 mb-6">
                    We encountered an unexpected error. Please try again or go back to the homepage.
                </p>
                <Button
                    onClick={() => (window.location.href = "/")}
                    className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto"
                >
                    Go to Home
                </Button>
            </div>
        </div>
    );
};

export default ErrorFallback;
