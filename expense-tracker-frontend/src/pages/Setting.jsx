import React, { useState , useEffect } from 'react'
import axios from "axios"
import {useNavigate} from 'react-router-dom'



const BASE_URL = "https://expense-tracker-backend-ge75.onrender.com";


const Setting = () => {

    const [currency , setCurrency] = useState("INR");

    const navigate = useNavigate();
    const [wantToChangePass , setWantToChangePass] = useState(false);


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




  return (
    <>
        {/* General Preference Section */}
        <div className='mx-auto max-w-5xl mt-5 mb-12 px-4'>
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
        <div className='mx-auto max-w-5xl mt-5 mb-12 px-4'>
            <div className="shadow-lg  py-10 rounded-lg px-6">
                <h1 className='text-xl md:text-2xl font-semibold text-gray-800 tracking-wide'>Account Setting</h1>
                <div className="flex flex-col gap-2 w-full mx-auto mt-6">
                    
                    <div className='items-center mb-4'>
                        <button
                            className='bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-200'
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
                                className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
                                placeholder="Enter your old password"
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label htmlFor="new-password" className='text-sm font-medium text-gray-700 mb-1'>New Password</label>
                            <input
                                id="new-password"
                                type="password"
                                className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
                                placeholder="Enter new password"
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label htmlFor="confirm-password" className='text-sm font-medium text-gray-700 mb-1'>Confirm Password</label>
                            <input
                                id="confirm-password"
                                type="password"
                                className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
                                placeholder="Confirm new password"
                            />
                        </div>

                        <button className='bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition duration-200 mt-4 self-start'>
                            Update Password
                        </button>
                    </div>
                    )}


                    <div className='items-center '>
                        <button
                            className='bg-red-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-red-700 transition duration-200'
                            onClick={handleOnDeleteAccount}
                        >
                            Delete Account
                        </button>
                    </div>
                </div> 
            </div>
        </div>


        
    </>
  )
}

export default Setting
