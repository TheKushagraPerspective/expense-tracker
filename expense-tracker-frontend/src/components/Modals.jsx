import React, { useEffect, useState } from "react";
import { X, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import ModalWrapper from "./ModalWrapper";

const BASE_URL = "https://expense-tracker-backend-ge75.onrender.com";

const Modals = ({ type , onClose , email , handleResendOtp , token }) => {

  // when case is otp
  const navigate = useNavigate();
  const [enteredOtp , setEnteredOtp] = useState("");
  const [resendCoolDown , setResendCoolDown] = useState(0);

  useEffect(() => {
    if(resendCoolDown > 0) {
      const timer = setTimeout(() => {
        setResendCoolDown(resendCoolDown - 1);
      } , 1000);

      return () => clearTimeout(timer);
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
          toast.success("OTP Verified Successfully!, redirecting you to Home page");
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




  // when case is reset-password
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmNewPassword: "",
    })


    const handleOnChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }


    const handleOnUpdatePassword = async (e) => {
        e.preventDefault();

        if (!formData.newPassword || !formData.confirmNewPassword) {
            toast.error("All fields are required");
            return;
        }

        if (formData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        if (formData.newPassword !== formData.confirmNewPassword) {
            toast.error("newPasswords do not match with confirmNewPassword");
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}/api/user/reset-password`, {
                token , newPassword: formData.newPassword , email
            })

            if (response.data.success) {
                toast.success("Password updated successfully!, redirecting you to Login page");
                onClose();
                navigate("/");
            }
            else {
                toast.error(response.data.msg || "Password update failed");
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.msg) {
                toast.error(error.response.data.msg);
            }
            else {
                toast.error("Error updating password. Try again later.");
            }
        }
    }

  

    switch(type) {
        case "otp" : 
            return (
                <>
                  {/* Content */}
                  <h1 className="text-3xl font-bold text-center mb-6">
                    🔐 Verify OTP
                  </h1>
                  <p className="text-center text-gray-200 text-sm mb-4">
                    Enter the 6-digit OTP sent to your registered email.
                  </p>

                  {/* Form */}
                  <form className="flex flex-col gap-4" onSubmit={handleOnVerify}>
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
                </>
            )

        case "reset-password" : 
            return (
              <>
                <ModalWrapper onClose={onClose}>
                    
                    {/* Content */}
                      <h1 className="text-3xl font-bold text-center mb-6">
                          🔐 Change Password
                      </h1>
                      <p className="text-center text-gray-200 text-sm mb-4">
                          Enter your new password to login with your registered email.
                      </p>

                      {/* Form */}
                      <form className="flex flex-col gap-4" onSubmit={handleOnUpdatePassword}>
                          <div className="mb-4">
                              <label
                                  htmlFor="newPassword"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                  New Password
                              </label>
                              <input
                                  type="password"
                                  id="newPassword"
                                  placeholder="Enter New Password"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={formData.newPassword}
                                  onChange={handleOnChange}
                              />
                          </div>

                          <div className="mb-4">
                              <label
                                  htmlFor="confirmNewPassword"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                  Confirm Password
                              </label>
                              <input
                                  type="password"
                                  id="confirmNewPassword"
                                  placeholder="Confirm New Password"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={formData.confirmNewPassword}
                                  onChange={handleOnChange}
                              />
                          </div>

                          <button
                              type="submit"
                              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold bg-black/80 hover:bg-black transition duration-200"
                          >
                              <ShieldCheck size={22} />
                              Update Password
                          </button>
                      </form>
                </ModalWrapper>
              </>
            )    
    }
};

export default Modals;
