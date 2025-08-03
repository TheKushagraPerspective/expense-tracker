import React, { useState , useEffect } from 'react'
import axios from "axios"


const BASE_URL = "https://expense-tracker-backend-ge75.onrender.com";


const Setting = () => {

    const [currency , setCurrency] = useState("INR");


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




  return (
    <>
        {/* Welcome Section */}
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


        <div className="border-t border-gray-300 my-8"></div>


        
    </>
  )
}

export default Setting
