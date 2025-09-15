import React from 'react'
import { X } from "lucide-react";

const ModalWrapper = ({children , onClose}) => {
  return (
    <>
        <div className='fixed inset-0 bg-black/50  flex justify-center items-center z-50'>
            <div className='relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-2xl shadow-2xl p-10 sm:w-[90%] w-[70%] max-w-md text-white animate-fadeIn'>
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
                    >
                        <X size={28} />
                    </button>

                    {children}
            </div>
        </div>
    </>
  )
}

export default ModalWrapper