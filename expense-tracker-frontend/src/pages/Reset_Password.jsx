import React, { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import "../styles/auth.css";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import resetPass from "../assets/reset-pass.json";
import Modals_ResetPass from "../components/Modal_reset_pass";

const BASE_URL = "https://expense-tracker-backend-ge75.onrender.com";

const Reset_Password = () => {

    const [searchParams] = useSearchParams()
    const token = searchParams.get("token");

    const navigate = useNavigate();
    const [enteredEmail, setEnteredEmail] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState("");


    // If token is in URL → verify it with backend
    useEffect(() => {
        const verifyToken = async () => {
            if (token) {
                try {
                    const response = await axios.post(`${BASE_URL}/api/user/verify-token`, {
                        token
                    });

                    if (response.data.success) {
                        setIsVerified(true);
                    }
                    else {
                        setError("Invalid or expired reset link.");
                    }
                } catch (error) {
                    setError("Invalid or expired reset link in catch block.");
                }
            }
        };

        verifyToken();
    }, [token]);

    const handleOnVerifyEmail = async (e) => {
        e.preventDefault();

        if (!enteredEmail.trim()) {
            setError("Email is required");
            return;
        }

        // Simple email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(enteredEmail)) {
            setError("Enter a valid email address");
            return;
        }
        setError("");

        try {
            const response = await axios.post(`${BASE_URL}/api/user/request-reset`, {
                email: enteredEmail,
            });

            if (response.data.success) {
                toast.success("Verification email sent! Check your inbox.");
            } else {
                setError(response.data.msg || "Verification failed");
            }
        } catch (error) {
            if (error.response?.data?.msg) {
                setError(error.response.data.msg);
            } else {
                setError("Something went wrong. Please try again later.");
            }
        }
    };

    return (
        <>
            <div className="auth-page container w-full h-screen flex justify-center items-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
                <div className="w-full max-w-md flex flex-col justify-center rounded-2xl p-8 bg-gradient-to-br from-white via-gray-700 to-gray-800 shadow-2xl">
                    {/* Heading */}
                    <h2 className="text-2xl font-bold text-center mb-2 text-indigo-700">
                        Reset Your Password
                    </h2>
                    <p className="text-center text-gray-900 mb-6 text-sm">
                        Enter your registered email and we’ll send you a link or OTP to
                        reset your password.
                    </p>

                    {/* Illustration */}
                    <div className="flex justify-center mb-6">
                        <Lottie
                            animationData={resetPass}
                            loop={true}
                            style={{ width: 140, height: 140 }}
                        />
                    </div>

                    {error && <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>}

                    {/* Form */}
                    <form onSubmit={handleOnVerifyEmail} className="space-y-5">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="user_email"
                                className="block text-sm font-medium text-gray-800 mb-1"
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="user_email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={enteredEmail}
                                onChange={(event) => setEnteredEmail(event.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-2 px-4 rounded-md font-medium shadow hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition duration-200"
                        >
                            Verify Email
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-sm text-center mt-6 text-gray-600">
                        Remember your password?{" "}
                        <Link
                            to="/"
                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            Back to Login
                        </Link>
                    </p>
                </div>
            </div>

            {/* Modal opens if verified */}
            {isVerified && <Modals_ResetPass token={token} onClose={() => setIsVerified(false)} />}
        </>
    );
};

export default Reset_Password;
