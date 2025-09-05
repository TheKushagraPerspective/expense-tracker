import React, { useEffect, useState } from "react";
import { X, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const BASE_URL = "https://expense-tracker-backend-ge75.onrender.com";

const Modals = ({ onClose , email , handleResendOtp }) => {

  const navigate = useNavigate();
  const [enteredOtp , setEnteredOtp] = useState("");
  const [resendCoolDown , setResendCoolDown] = useState(0);

  useEffect(() => {
    if(resendCoolDown > 0) {
      const timer = setTimeout(() => {
        setResendCoolDown(resendCoolDown - 1);
      } , 1000);

      return () => clearInterval(timer);
    }
  } , [resendCoolDown]);


  const handleOnResendClick = (e) => {
    if(resendCoolDown > 0) return;  // Prevent click if cooldown active

    if(handleResendOtp) {
      handleResendOtp(e);
      setResendCoolDown(60);
      toast.success("Successfully resend the otp");
    }
  }

  const handleOnVerify = async(e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BASE_URL}/api/user/verify-otp` , {
          email: email,   // <-- comes from props
          enteredOtp: enteredOtp,     // <-- user entered
      })

      if(response.data.success) {
          toast.success("OTP Verified Successfully!");
          localStorage.setItem("token" , response.data.token);
          localStorage.setItem("user" , JSON.stringify(response.data.userData));
          onClose();

          const timer = setTimeout(() => {
              navigate("/home");
              toast.success(<div><strong>Welcome!</strong> Thanks for logging in.</div>);
          } , 3000);
      }
      else {
          toast.error(response.data.msg || "Invalid OTP | Expired OTP")
      }
    } catch (error) {
      if(error.response && error.response.data && error.response.data.msg) {
          toast.error(error.response.data.msg);
        }
        else {
          toast.error("Error verifying OTP");
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
                🔐 Verify OTP
              </h1>
              <p className="text-center text-gray-200 text-sm mb-4">
                Enter the 6-digit OTP sent to your registered email.
              </p>

              {/* Form */}
              <form className="flex flex-col gap-4">
                <input
                  type="text"
                  name="otp"
                  id="otp"
                  maxLength="6"
                  placeholder="Enter 6-digit OTP"
                  className="bg-white/90 w-full px-4 py-3 text-black border border-gray-300 rounded-lg text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-violet-400"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold bg-black/80 hover:bg-black transition duration-200"
                  onClick={handleOnVerify}
                >
                  <ShieldCheck size={22} />
                  Verify OTP
                </button>
              </form>

              {/* Footer */}
              <p className="text-center text-xs text-gray-300 mt-6">
                Didn’t receive the code?{" "}
                <span className="text-yellow-300 cursor-pointer hover:underline" onClick={handleOnResendClick}>
                  {resendCoolDown > 0 ? `Resend in ${resendCoolDown}s` : "Resend OTP"}
                </span>
              </p>
          </div>
      </div>
    </>
  );
};

export default Modals;
