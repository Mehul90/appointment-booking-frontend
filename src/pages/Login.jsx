import { userLogin } from "@/store/slices/loginSlice";
import { use, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        setIsLoading(true);
        dispatch(userLogin({ email, password }))
            .then((response) => {
                if (response.payload.token) {
                    localStorage.setItem("token", response.payload.token);
                    document.addEventListener("logoutUser", (e) => {
                        localStorage.clear();
                        navigate("/login");
                    });
                    navigate("/");
                    setIsLoading(false);
                } else {
                    // set toast error message
                    toast({
                        title: "Error",
                        description: "Failed to login. Please try again.",
                    });
                    setIsLoading(false);
                }
            })
            .catch((error) => {
                console.error("Error during login:", error);
                setIsLoading(false);
            });
    };

    return (
        <div className="bg-gray-50 flex items-center justify-center min-h-screen font-sans">
            <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Sign In</h2>
                <form>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-600 mb-1"
                        >
                            Email address
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-600 mb-1"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="w-full h-[40px] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {!isLoading ? "Login" : <div class="spinner"></div>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
