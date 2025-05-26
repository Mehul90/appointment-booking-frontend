import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "@/components/ui/loader";
import { useToast } from "@/components/ui/use-toast";
import { userLogin } from "@/store/slices/loginSlice";
import { use, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
/**
 * Login component for user authentication.
 *
 * Renders a login form with email and password fields, handles form validation,
 * manages loading state, dispatches the login action, displays toast notifications,
 * and navigates to the home page upon successful login.
 *
 * @component
 * @returns {JSX.Element} The rendered Login component.
 */


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({ email: "", password: "" });
    const { toast } = useToast()

    const dispatch = useDispatch();
    const navigate = useNavigate();

    /**
     * Validates the login form fields for email and password.
     * Checks if both fields are filled and if the email has a valid format.
     * Updates the error state with appropriate messages if validation fails.
     *
     * @returns {boolean} Returns true if the form is valid, otherwise false.
     */
    const validateForm = () => {
        let isValid = true;
        const newErrors = { email: "", password: "" };

        if (!email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Please enter a valid email address";
            isValid = false;
        }

        if (!password.trim()) {
            newErrors.password = "Password is required";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    /**
     * Handles the login process for the user.
     * 
     * Validates the login form, dispatches the login action, manages loading state,
     * handles success and error responses, displays toast notifications, and navigates
     * to the home page upon successful login.
     *
     * @async
     * @function
     * @returns {Promise<void>} Resolves when the login process is complete.
     */
    const handleLogin = async () => {

        if (!validateForm()) return;

        setIsLoading(true);
        dispatch(userLogin({ email, password }))
            .then((response) => {

                if(response.payload.error){
                    
                    // set toast error message
                    toast({
                        title: "Error",
                        description: response.payload.message,
                        variant: 'destructive',
                    });
                    setIsLoading(false);
                    return;
                    
                }


                if (response.payload.token) {
                    localStorage.setItem("token", response.payload.token);
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
                        <Label className="required" htmlFor='email'>Email address</Label>
                        <Input
                            id='email'
                            className={errors.email ? 'border-red-500' : ''}
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={validateForm}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>
                    <div className="mb-6">
                        <Label className="required" htmlFor='email'>Password</Label>
                        <Input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            required
                            className={errors.password ? 'border-red-500' : ''}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={validateForm}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="w-full h-[40px] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {!isLoading ? "Login" : <Loader />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
