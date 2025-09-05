import React, { useRef } from "react";
import { X, ShieldCheck } from "lucide-react";

const Modals = ({ onClose }) => {
  const modalRef = useRef();

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay (outer div) */}
      <div
        ref={modalRef}
        onClick={closeModal}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
      >
          {/* Modal Container */}
          <div className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-white animate-fadeIn">
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
                <span className="text-yellow-300 cursor-pointer hover:underline">
                  Resend OTP
                </span>
              </p>
          </div>
      </div>
    </>
  );
};

export default Modals;
