import React from "react";
import { FaRegSmile, FaChartLine, FaRegLightbulb } from "react-icons/fa";

const Home = () => {
  return (
    <>
        {/* Welcome Section */}
        <div className="mx-auto max-w-6xl mt-10 mb-16 px-4">
            <div className="shadow-xl min-h-[280px] py-12 rounded-2xl bg-gradient-to-r from-green-300 via-lime-200 to-green-100 text-center px-6 animate-fade-in">
            <div className="flex flex-col justify-center items-center gap-4">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-wide uppercase">
                    Welcome To
                </h3>
                <h1 className="text-4xl md:text-6xl text-blue-800 font-extrabold tracking-widest drop-shadow-lg">
                    Expense Tracker
                </h1>
                <p className="text-gray-800 max-w-2xl mt-2 text-lg leading-relaxed">
                    Your all-in-one financial companion to track income, monitor
                    spending, and master budgeting — beautifully and effortlessly.
                </p>
            </div>
            </div>
        </div>

      {/* Why Section */}
      <div className="bg-gradient-to-r from-sky-200 via-indigo-100 to-purple-200 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-12 text-gray-800 uppercase tracking-wide">
                Why Use This Expense Tracker?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 transition hover:shadow-2xl hover:scale-[1.03] duration-300">
              <div className="text-green-600 text-4xl mb-4 mx-auto">
                <FaRegSmile />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Easy to Use
              </h3>
              <p className="text-gray-600">
                Clean, intuitive design that makes tracking your finances a
                breeze.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 transition hover:shadow-2xl hover:scale-[1.03] duration-300">
              <div className="text-green-600 text-4xl mb-4 mx-auto">
                <FaChartLine />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Real-Time Tracking
              </h3>
              <p className="text-gray-600">
                Get instant insights into your income and expenses.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 transition hover:shadow-2xl hover:scale-[1.03] duration-300">
              <div className="text-green-600 text-4xl mb-4 mx-auto">
                <FaRegLightbulb />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Insightful Reports
              </h3>
              <p className="text-gray-600">
                Visual dashboards that help you understand and improve your
                spending habits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
