import React, { useEffect, useState } from 'react'
import useCurrentDate from '../CustomHooks/useCurrentDate';

const DashboardTop = ({income = 0 , expense = 0 , currency = "INR"}) => {

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const currencySymbols = {
      INR: '₹',
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
    };

    const conversionRate = {
      INR: 1,
      USD: 85,
      EUR: 90,
      GBP: 100,
      JPY: 0.6,
    }

    const getConvertedValue = (amountInINR) => {
      const rate = conversionRate[currency] || 1;
      const finalAmount = (amountInINR / rate).toFixed(2);
      return finalAmount;
    }

    const balance = income - expense;
    let {lastDate: lastdateOfMonth , month: currentMonth , year: currentYear} = useCurrentDate();
    currentMonth = monthNames[currentMonth-1];
    const symbol = currencySymbols[currency];


  return (
    <>

        <div className='mb-3 text-center text-xl font-bold text-gray-700'>
            Summary for {currentMonth}, {currentYear}
        </div>
        <div className='flex flex-wrap gap-5 mb-5'>
            <div className="flex-1 bg-green-100 text-green-800 opacity-80 p-5 rounded-lg font-semibold shadow-sm text-center min-w-[200px]">
                    Total Income<br />
                    {symbol}{getConvertedValue(income)}
            </div>

            <div className="flex-1 bg-red-100 text-red-700 opacity-80 p-5 rounded-lg font-semibold shadow-sm text-center min-w-[200px]">
                    Total Expense<br />
                    {symbol}{getConvertedValue(expense)}
            </div>

            <div className="flex-1 bg-blue-100 text-blue-700 opacity-80 p-5 rounded-lg font-semibold shadow-sm text-center min-w-[200px]">
                    Savings<br />
                    {symbol}{getConvertedValue(balance)} 
            </div>
        </div>
    </>
  )
}

export default DashboardTop
