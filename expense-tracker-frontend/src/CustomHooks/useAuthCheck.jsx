import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from 'jwt-decode'
import {toast} from 'react-toastify'


const useAuthCheck = () => {
    const navigate = useNavigate();

    useEffect(() => {

        const token = localStorage.getItem("token");
        if(token) {
            try {
                const decode = jwt_decode(token);
                const currentTime = Date.now() / 1000;   // in seconds

                if(decode.exp < currentTime) {
                    // Token expired
                    localStorage.removeItem("token");
                    toast.warn("Session expired. Please log in again.");
                    navigate("/");   // redirecting to login page
                }
            } catch (error) {
                console.log("Token decode error:", error);
                localStorage.removeItem("token");
                navigate("/");
            }
        }

    } , [navigate]);
}

export default useAuthCheck;