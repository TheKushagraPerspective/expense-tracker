import React, { useEffect, useState } from "react";
import { X, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const BASE_URL = "https://expense-tracker-backend-ge75.onrender.com";

const Modals_ResetPass = ({token , onClose}) => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmNewPassword: "",
    })


    const handleOnChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }


    const handleOnUpdatePassword = async (e) => {
        e.preventDefault();

        if (!formData.newPassword || !formData.confirmNewPassword) {
            toast.error("All fields are required");
            return;
        }

        if (formData.newPassword !== formData.confirmNewPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}/api/user/reset-password`, {
                token , newPassword: formData.newPassword
            })

            if (response.data.success) {
                toast.success("Password updated successfully!");
                onClose();
                navigate("/");
            }
            else {
                toast.error(response.data.msg || "Password update failed");
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.msg) {
                toast.error(error.response.data.msg);
            }
            else {
                toast.error("Error updating password. Try again later.");
            }
        }
    }

    return (
        <>
            {/* Overlay (outer div) */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
            >
                {/* Modal Container */}
                <div className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-2xl shadow-2xl p-8 sm:w-[90%] w-[70%] max-w-md text-white animate-fadeIn">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
                    >
                        <X size={28} />
                    </button>

                    {/* Content */}
                    <h1 className="text-3xl font-bold text-center mb-6">
                        🔐 Change Password
                    </h1>
                    <p className="text-center text-gray-200 text-sm mb-4">
                        Enter your new password to login with your registered email.
                    </p>

                    {/* Form */}
                    <form className="flex flex-col gap-4">
                        <div className="mb-4">
                            <label
                                htmlFor="newPassword"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                New Password
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                placeholder="Enter New Password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.newPassword}
                                onChange={handleOnChange}
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="confirmNewPassword"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmNewPassword"
                                placeholder="Confirm New Password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.confirmNewPassword}
                                onChange={handleOnChange}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold bg-black/80 hover:bg-black transition duration-200"
                            onClick={handleOnUpdatePassword}
                        >
                            <ShieldCheck size={22} />
                            Update Password
                        </button>
                    </form>

                </div>
            </div>
        </>
    );
};

export default Modals_ResetPass;
