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
                const decode = jwtDecode(token);    // it will decode the token as userId , email , expirytime, etc
                const currentTime = Date.now() / 1000;   // in seconds

                if(decode.exp < currentTime) {
                    toast.error("Session expired. Redirecting to login...");
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    clearInterval(interval);
                    navigate('/');
                }
            } catch (error) {
                console.error("Token decode error:", err);
                toast.error("Invalid session. Redirecting...");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                clearInterval(interval);
                navigate("/");
            }
        } , 1000);    // Run every second

        return () => clearInterval(interval);

    } , [navigate]);
}

export default useAuthCheck;