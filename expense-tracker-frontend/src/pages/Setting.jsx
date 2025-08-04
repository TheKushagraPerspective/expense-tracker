import React, { useState , useEffect } from 'react'
import axios from "axios"
import {useNavigate} from 'react-router-dom'



const BASE_URL = "https://expense-tracker-backend-ge75.onrender.com";


const Setting = () => {

    const [currency , setCurrency] = useState("INR");

    const navigate = useNavigate();
    const [wantToChangePass , setWantToChangePass] = useState(false);
    const [formData , setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    })
    
    const [wantToGiveFeedback , setWantToGiveFeedback] = useState(false);
    const [feedbackFormData , setFeedbackFormData] = useState({
        fullName: "",
        email: "",
        category: "",
        message: "",
        rating: "",
    })


    useEffect(() => {
        const fetchCurrency = async() => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.warn("No token found in localStorage");
                return;
            }
            
            try {
                const res = await axios.get(`${BASE_URL}/api/user/profile`, {
                    headers: { 
                        Authorization: `Bearer ${token}` 
                    }
                });

                if (res.data.success) {
                    setCurrency(res.data.data.currency || 'INR');
                } else {
                    console.warn("Currency not found in response");
                }
            } catch (error) {
                console.error("Could not fetch currency", error);
            }
        };

        fetchCurrency();
    } , []);


    const handleOnCurrencyChange = async(e) => {
        const selectedCurrency = e.target.value;
        setCurrency(selectedCurrency);
        const token = localStorage.getItem("token");

        try {
            const res = await axios.put(`${BASE_URL}/api/user/currency` , 
                { currency : selectedCurrency },
                { headers : {
                    Authorization : `Bearer ${token}`
                }}
            );

            if(res.data.success) {
                alert("Currency Changed Successfully");
            }

        } catch (error) {
            console.error("Error updating currency:", error);
        }
    }



    const handleOnDeleteAccount = async(e) => {
        const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.")
        if(!confirmed) {
            return ;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await axios.delete(`${BASE_URL}/api/user/delete-account` , {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            })

            alert(res.data.message || "Account Deleted Successfully");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/");   // redirect to login page

        } catch (err) {
            alert(err.response.data.message || "Account deletion failed");
        }
    }



    const handleOnInputChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    const handleOnUpdatePassword = async(e) => {
        e.preventDefault();
        const {oldPassword , newPassword , confirmPassword} = formData;
        
        if(!oldPassword || !newPassword || !confirmPassword) {
            return alert("All fields are required to fill");
        }

        try {
            const token = localStorage.getItem("token");


            const res = await axios.put(`${BASE_URL}/api/user/update-password` , 
                { oldPassword , newPassword , confirmPassword } ,
                {
                    headers : {
                        Authorization : `Bearer ${token}`
                    }
                }
            )

            alert("Password has been successfully changed. Redirecting you to login...");
            setFormData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: ""
            })
            setWantToChangePass(prev => !prev);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/");

        } catch (error) {
            console.error(error);
            alert(
                error?.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        }
    }


    const handleOnFeedbackInput = (e) => {
        setFeedbackFormData((prev) => ({
            ...prev,
            [e.target.name] : e.target.value,
        }))
    }

    const handleOnFeedback = async(e) => {
        e.preventDefault();
        const {fullName , email , category , message , rating} = feedbackFormData;

        if(!category || !rating) {
            return alert("Some Mandatory fields is/are empty...");
        }

        try {
            const token = localStorage.getItem("token");

            const res = await axios.post(`${BASE_URL}/api/feedback` , 
                {fullName , email , category , message , rating},
                {
                    headers : {
                        Authorization : `Bearer ${token}`
                    }
                }
            );

            alert("Feedback has been successfully Submitted");
            setFeedbackFormData({
                fullName: "",
                email: "",
                category: "",
                message: "",
                rating: "",
            })
            setWantToGiveFeedback(prev => !prev);
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            alert(
                error?.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        }
    }

  return (
    <>
        {/* General Preference Section */}
        <div className='mx-auto max-w-5xl mb-10 px-4'>
            <div className="shadow-lg  py-10 rounded-lg px-6">
                <h1 className='text-xl md:text-2xl font-semibold text-gray-800 tracking-wide'>General Preferences</h1>
                <div className="flex flex-col gap-4 w-full mx-auto mt-6">
                    <div className='flex justify-between items-center'>
                        <label htmlFor="theme">
                              Theme
                        </label>
                        <select name="theme" id="theme" className='shadow-md p-1 rounded-lg'>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </div> 

                    <div className='flex justify-between items-center '>
                        <label htmlFor="currency">Currency</label>   
                        <select name="currency" id="currency" className='shadow-md p-1 rounded-lg' value={currency} onChange={handleOnCurrencyChange}>
                            <option value="INR">₹ INR</option>
                            <option value="USD">$ USD</option>
                            <option value="EUR">€ EUR</option>
                            <option value="GBP">£ GBP</option>
                            <option value="JPY">¥ JPY</option>
                        </select>
                    </div>
                </div> 
            </div>
        </div>




        {/* Account Setting Section */}
        <div className='mx-auto max-w-5xl mb-10 px-4'>
            <div className="shadow-lg  py-10 rounded-lg px-6">
                <h1 className='text-xl md:text-2xl font-semibold text-gray-800 tracking-wide'>Account Settings</h1>
                <div className="flex flex-col gap-2 w-full mx-auto mt-6">
                    
                    <div className='flex justify-between items-center mb-4'>

                        <h1 className='text-blue-800 text-lg mt-2'>Change Password</h1>
                        <button
                            className='bg-blue-600 text-white px-4 py-1.5 rounded-lg shadow-lg hover:bg-blue-700 transition duration-200'
                            onClick={() => setWantToChangePass(prev => !prev)}
                        >
                            {wantToChangePass ? "Cancel" : "Change Password"}
                        </button>
                    </div>

                    {wantToChangePass && (
                    <div className='bg-gray-100 p-6 rounded-lg shadow-inner space-y-4'>
                        <div className='flex flex-col'>
                            <label htmlFor="old-password" className='text-sm font-medium text-gray-700 mb-1'>Old Password</label>
                            <input
                                id="old-password"
                                type="password"
                                name="oldPassword"
                                className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
                                placeholder="Enter your old password"
                                value={formData.oldPassword}
                                onChange={(e) => handleOnInputChange(e)}
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label htmlFor="new-password" className='text-sm font-medium text-gray-700 mb-1'>New Password</label>
                            <input
                                id="new-password"
                                type="password"
                                name="newPassword"
                                className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
                                placeholder="Enter new password"
                                value={formData.newPassword}
                                onChange={(e) => handleOnInputChange(e)}
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label htmlFor="confirm-password" className='text-sm font-medium text-gray-700 mb-1'>Confirm Password</label>
                            <input
                                id="confirm-password"
                                type="password"
                                name="confirmPassword"
                                className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
                                placeholder="Confirm new password"
                                value={formData.confirmPassword}
                                onChange={(e) => handleOnInputChange(e)}
                            />
                        </div>

                        <button 
                        className='bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition duration-200 mt-4 self-start'
                        onClick={handleOnUpdatePassword}
                        >
                            Update Password
                        </button>
                    </div>
                    )}


                    <div className='flex justify-between items-center '>

                        <h1 className='text-red-800 text-lg mb-2'>Change Password</h1>
                        <button
                            className='bg-red-600 text-white px-6 py-1.5 rounded-lg shadow-lg hover:bg-red-700 transition duration-200'
                            onClick={handleOnDeleteAccount}
                        >
                            Delete Account
                        </button>
                    </div>
                </div> 
            </div>
        </div>




        {/* Feedback and Support Section */}
        <div className='mx-auto max-w-5xl  mb-10 px-4'>
            <div className="shadow-lg  py-10 rounded-lg px-6">
                <h1 className='text-xl md:text-2xl font-semibold text-gray-800 tracking-wide'>Feedback & Support</h1>
                <div className="flex flex-col gap-2 w-full mx-auto mt-6">
                    
                    <div className='flex justify-between items-center mb-4'>

                        <h1 className='text-gray-800 text-lg mt-2'>Feedback</h1>
                        <button
                            className='bg-blue-600 text-white px-4 py-1.5 rounded-lg shadow-lg hover:bg-blue-700 transition duration-200'
                            onClick={() => setWantToGiveFeedback(prev => !prev)}
                        >
                            {wantToGiveFeedback ? "Cancel" : "Show"}
                        </button>
                    </div>

                    {wantToGiveFeedback && (
                    <div className='bg-gray-100 p-6 rounded-lg shadow-inner space-y-4'>
                        <div className='flex flex-col'>
                            <label htmlFor="name" className='text-sm font-medium text-gray-700 mb-1'>Full Name</label>
                            <input
                                id="name"
                                type="text"
                                name="fullName"
                                className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
                                placeholder="Your name (optional)"
                                value={feedbackFormData.fullName}
                                onChange={handleOnFeedbackInput}
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label htmlFor="email" className='text-sm font-medium text-gray-700 mb-1'>New Password</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
                                placeholder="Your email (optional)"
                                value={feedbackFormData.email}
                                onChange={handleOnFeedbackInput}
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label htmlFor="category" className='text-sm font-medium text-gray-700 mb-1'>Select Category</label>
                            <select 
                            name="category" 
                            id="category" 
                            className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
                            value={feedbackFormData.category}
                            onChange={handleOnFeedbackInput}>
                                <option value="">Select Feedback type</option>
                                <option value="bug">Bug Report</option>
                                <option value="feature">Feature Request</option>
                                <option value="uiux">UI/UX Feedback</option>
                                <option value="general">General Suggestion</option>
                            </select>
                        </div>

                        <div className='flex flex-col'>
                            <label htmlFor="message" className='text-sm font-medium text-gray-700 mb-1'>Feedback Message</label>
                            <textarea 
                            name="message" 
                            id="message" 
                            className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400' 
                            placeholder='Write your Feedback... (Optional)' 
                            rows={5}
                            value={feedbackFormData.message}
                            onChange={handleOnFeedbackInput}>

                            </textarea>
                        </div>

                        <div className='flex flex-col'>
                            <label htmlFor="rating" className='text-sm font-medium text-gray-700 mb-1'>Ratings</label>
                            <div className="flex gap-4">
                                {[1,2,3,4,5].map((value) => (
                                    <label key={value} className='flex items-center gap-1'>
                                        <span className="text-gray-700">{value}</span>
                                        <input 
                                        type="radio"
                                        name='rating'
                                        value={value}
                                        checked={feedbackFormData.rating === value.toString()}
                                        className='accent-blue-600'
                                        onChange={handleOnFeedbackInput} />
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button 
                        className='bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition duration-200 mt-4 self-start'
                        onClick={handleOnFeedback}
                        >
                            Send Feedback
                        </button>
                    </div>
                    )}

                </div> 
            </div>
        </div>

        
    </>
  )
}

export default Setting
