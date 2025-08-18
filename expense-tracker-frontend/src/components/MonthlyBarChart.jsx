// components/MonthlyBarChart.jsx
import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import useCurrentDate from "../CustomHooks/useCurrentDate";


ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MonthlyBarChart = ({ filteredMonthlyTransactions , currency }) => {

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


  let {lastdateOfMonth , month: currentMonth , year: currentYear} = useCurrentDate();
  currentMonth = monthNames[currentMonth-1];


  // Group expenses by date
  const dailyTotalExpense = {};
  const dailyTotalContribution = {};
  const dailyTotalIncome = {};

  filteredMonthlyTransactions.forEach((txn) => {
    const date = new Date(txn.date).getDate(); // Get day of month (1-31)
    const rate = conversionRate[currency];
    const amountInSelectedCurrency = txn.amount / rate;

    if (txn.categoryType === "expense") {  
      dailyTotalExpense[date] = (dailyTotalExpense[date] || 0) + amountInSelectedCurrency;
    }
    else if(txn.categoryType === "contribution") {
      dailyTotalContribution[date] = (dailyTotalContribution[date] || 0) + amountInSelectedCurrency;
    }
    else {
      dailyTotalIncome[date] = (dailyTotalIncome[date] || 0) + amountInSelectedCurrency;
    }
  });


   // Labels for each day of the month
  const labels = Array.from({ length: 31 }, (_, i) => i + 1); // Days 1–31

  // Map both expense & contribution
  const incomeData = labels.map((day) => dailyTotalIncome[day] || 0);
  const expenseData  = labels.map((day) => dailyTotalExpense[day] || 0); // If no data, default to 0
  const contributionData = labels.map((day) => dailyTotalContribution[day] || 0);

  const chartData = {
    labels: labels.map((d) => `Day ${d}`),
    datasets: [
      {
        label: `Income ${currencySymbols[currency]}`,
        data: incomeData,
        backgroundColor: "#4ade80", // red-400
        borderRadius: 6,
      },
      {
        label: `Expenses ${currencySymbols[currency]}`,
        data: expenseData,
        backgroundColor: "#f87171", // red-400
        borderRadius: 6,
      },
      {
        label: `Contributions ${currencySymbols[currency]}`,
        data: contributionData,
        backgroundColor: "#60a5fa", // blue-400
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${currencySymbols[currency]}${value}`,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-md h-full flex flex-col justify-between aspect-[4/3]">
      <h2 className="text-center text-xl font-bold text-gray-700">Daily Income/Expense Trend ({currentMonth}, {currentYear})</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default MonthlyBarChart;
