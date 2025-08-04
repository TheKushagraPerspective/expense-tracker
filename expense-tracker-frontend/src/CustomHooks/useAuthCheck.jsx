import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode'
import {toast} from 'react-toastify'


const useAuthCheck = () => {
    const navigate = useNavigate();

    useEffect(() => {

        const interval = setInterval(() => {
            const token = localStorage.getItem("token");

            if(!token) {
                toast.warn("You are not logged in.");
                navigate("/");
                clearInterval(interval);
                return ;
            }


            try {
                const decode = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if(decode.exp < currentTime) {
                    toast.error("Session expired. Redirecting to login...");
                    localStorage.removeItem("token");
                    navigate('/');
                    clearInterval(interval);
                }
            } catch (error) {
                console.error("Token decode error:", err);
                toast.error("Invalid session. Redirecting...");
                localStorage.removeItem("token");
                clearInterval(interval);
                navigate("/");
            }
        } , 1000);    // Run every second

        return () => clearInterval(interval);

    } , [navigate]);
}

export default useAuthCheck;