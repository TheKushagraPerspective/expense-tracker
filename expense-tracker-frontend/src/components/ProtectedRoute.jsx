import React , {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from './MainLayout';
import useAuthCheck from '../CustomHooks/useAuthCheck';

const ProtectedRoute = ({ children }) => {
  
    useAuthCheck();    // Check token validity on every protected route
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if(!token) {
            const timer = setTimeout(() => {
                navigate("/");
            } , 5000);

            return () => clearInterval(timer);
        }

    } , [token , navigate]);


    if(!token) {
        return (
            <>
                <div className="w-full h-screen flex items-center justify-center text-center text-xl">
                    <p>Access denied. Redirecting to login page in 5 seconds...</p>
                </div>
            </>
        )
    }

    return (
        <>
            <MainLayout>
                {children}
            </MainLayout>
        </>
    )
};

export default ProtectedRoute;
