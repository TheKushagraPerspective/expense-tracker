import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };


  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };


  const handleLinkClick = () => {
    if(window.innerWidth < 640) {
        setIsMenuOpen(false);
    }
  }

  return (
    <>
      {/* Hamburger Icon for Small Screens */}
      <div className="sm:hidden w-full bg-[#0f2c53] p-4 flex justify-between items-center">
        <h1 className="text-white text-xl font-semibold tracking-wide">MyApp</h1>
        <button
            className="text-white text-3xl focus:outline-none"
            onClick={toggleMenu}
        >
            &#9776;
        </button>
    </div>


      {/* Sidebar Navigation */}
      <div className={`sm:fixed sm:top-0 sm:left-0 w-full sm:w-64 md:w-72 lg:w-[275px] sm:h-screen text-white p-5 bg-[#0f2c53] flex flex-col ${isMenuOpen ? '' : 'hidden sm:flex'}`}>
        
        <div className="text-center mb-20 text-5xl">
          <NavLink to="/profile">👤</NavLink>
        </div>

        <div className="mb-20 text-center sm:text-left">
          <div className="text-sm font-semibold uppercase mb-7 pb-[5px] border-b border-white/20">
            General
          </div>
          <nav className="flex flex-col gap-3 mt-5">
            <NavLink to="/home" onClick={handleLinkClick} className={({ isActive }) => isActive ? "text-[#86beed]" : "text-white"}>Home</NavLink>
            <NavLink to="/dashboard" onClick={handleLinkClick} className={({ isActive }) => isActive ? "text-[#86beed]" : "text-white"}>Dashboard</NavLink>
            <NavLink to="/category" onClick={handleLinkClick} className={({ isActive }) => isActive ? "text-[#86beed]" : "text-white"}>Category</NavLink>
            <NavLink to="/transaction" onClick={handleLinkClick} className={({ isActive }) => isActive ? "text-[#86beed]" : "text-white"}>Transactions</NavLink>
          </nav>
        </div>

        <div className="mb-20 text-center sm:text-left">
          <div className="text-sm font-semibold uppercase mb-7 pb-[5px] border-b border-white/20">
            Extra Links
          </div>
          <nav className="flex flex-col gap-3 mt-5">
            <NavLink to="/report" onClick={handleLinkClick} className={({ isActive }) => isActive ? "text-[#86beed]" : "text-white"}>Report</NavLink>
            <NavLink to="/setting" onClick={handleLinkClick} className={({ isActive }) => isActive ? "text-[#86beed]" : "text-white"}>Setting</NavLink>
          </nav>
        </div>

        <div className="flex justify-center mt-auto">
          <button className="bg-gradient-to-r from-red-500 to-pink-600 text-white sm:px-6 sm:py-2 px-4 py-2 rounded-xl shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300" onClick={handleLogOut}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
