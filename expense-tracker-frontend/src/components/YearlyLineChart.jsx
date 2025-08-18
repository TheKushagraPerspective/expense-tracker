// components/YearlyLineChart.jsx
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import useCurrentDate from "../CustomHooks/useCurrentDate";


ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);


const YearlyLineChart = ({ filteredYearlyTransactions , currency }) => {


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

  let {lastdateOfMonth , month: currentMonth , year: currentYear} = useCurrentDate();  // currentMonth is having 1-12, 1- jan, ..., 12-dec


  const monthlyContribution = Array(12).fill(0);
  const monthlyExpense = Array(12).fill(0);
  const monthlyIncome = Array(12).fill(0);

  filteredYearlyTransactions.forEach((txn) => {
    const date = new Date(txn.date);
    const rate = conversionRate[currency];
    const amountInSelectedCurrency = txn.amount / rate;
    const month = date.getMonth(); // 0 = Jan, 11 = Dec

    if (txn.categoryType === "expense") {
      monthlyExpense[month] += amountInSelectedCurrency;
    } 
    else if (txn.categoryType === "income") {
      monthlyIncome[month] += amountInSelectedCurrency;
    } 
    else {
      monthlyContribution[month] += amountInSelectedCurrency;
    }
  });

  const chartData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    datasets: [
      {
        label: `Income ${currencySymbols[currency]}`,
        data: monthlyIncome,
        borderColor: "#34d399",
        backgroundColor: "#6ee7b7",
        tension: 0.3,
        fill: false,
      },
      {
        label: `Expense ${currencySymbols[currency]}`,
        data: monthlyExpense,
        borderColor: "#f87171",
        backgroundColor: "#fca5a5",
        tension: 0.3,
        fill: false,
      },
      {
        label: `Contribution ${currencySymbols[currency]}`,
        data: monthlyContribution,
        borderColor: "#60a5fa",
        backgroundColor: "#60a5fa",
        tension: 0.3,
        fill: false,
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
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
    <div className="bg-white rounded-xl p-4 shadow-md mt-10 h-full">
      <h2 className="text-lg font-semibold mb-4">Yearly Income vs Expense Trend ({currentYear})</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default YearlyLineChart;
