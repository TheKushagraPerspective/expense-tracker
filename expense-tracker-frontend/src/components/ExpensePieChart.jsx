import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import useCurrentDate from '../CustomHooks/useCurrentDate';



ChartJS.register(ArcElement, Tooltip, Legend);


const ExpensePieChart = ({ filteredMonthlyTransactions , currency }) => {
  
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
  

  // Grouping by category name
  const categoryWiseExpenses = {};

  filteredMonthlyTransactions.forEach((txn) => {
    if (txn.categoryType === "expense") {
      const catName = txn.categoryId.name;
      const rate = conversionRate[currency];
      const amountInSelectedCurrency = (txn.amount / rate);
      categoryWiseExpenses[catName] = (categoryWiseExpenses[catName] || 0) + amountInSelectedCurrency;
    }
  });

  const labels = Object.keys(categoryWiseExpenses);
  const values = Object.values(categoryWiseExpenses);

  const colors = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4CAF50",
    "#FF9800", "#9C27B0", "#00BCD4", "#E91E63",
    "#3F51B5", "#8BC34A", "#CDDC39", "#795548"
  ];

  const data = {
    labels,
    datasets: [
      {
        label: `Expense ${currencySymbols[currency]}`,
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };


  const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
              boxWidth: 15,
          },
        },
      },
  };



  return (
    <div className="bg-white p-5 rounded-xl shadow-md h-full flex flex-col justify-center items-center aspect-[4/3]">
      <h2 className="text-center text-xl font-bold text-gray-700 mb-4">
        Expenses by Category ({currentMonth}, {currentYear})
      </h2>
      {labels.length > 0 ? (
        <div className="flex-1 relative">
        <Pie data={data} options={options} />
      </div>
      ) : (
        <p className="text-center text-gray-500">No expense data available</p>
      )}
    </div>
  );
};

export default ExpensePieChart;
