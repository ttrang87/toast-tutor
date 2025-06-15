import { useState, useEffect } from "react";
import resetBg from '../../../assets/resetBg.jpg';
import { EnvelopeIcon } from "../../../assets/icon";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {API_ROUTES} from '../../../constant/APIRoutes';

const Waiting = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        // Get email from localStorage on component mount
        const email = localStorage.getItem('resetEmail');
        
        if (email) {
            setUserEmail(email);
        }
    }, []);

    const showToast = (message, type = 'error') => {
        const toastConfig = {
            position: "top-center",
            autoClose: type === 'success' ? 3000 : 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: {
                borderRadius: '8px', // Optional styling
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            },
            progressStyle: {
                background: type === 'success' ? 'green' : 'red', // Progress bar color
            },
        };
        
        if (type === 'success') {
            toast.success(message, toastConfig);
        } else {
            toast.error(message, toastConfig);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Get fresh copy of email from localStorage
        const currentEmail = localStorage.getItem('resetEmail');

        if (!currentEmail) {
            showToast('No email found. Please try again.');
            return;
        }

        setIsSubmitting(true);

        try {
            
            const response = await axios.post(API_ROUTES.FORGOT_PASSWORD(), 
                { email: currentEmail },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                showToast("Password reset link resent successfully!", 'success');
            }
        } catch (error) {          
            if (error.response?.status === 400) {
                showToast('Invalid email address.');
            } else if (error.response?.status === 404) {
                showToast('Email not found.');
            } else {
                showToast('Error connecting to the server.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    console.log('Current user email state:', userEmail); 

    return (
        <div
            className="flex items-center justify-center h-screen"
            style={{
                backgroundImage: `url(${resetBg})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <ToastContainer
                newestOnTop={true}
                closeOnClick
                limit={1}
            />
            <div className="rounded-2xl flex items-center justify-center flex-col w-1/2 p-10 gap-3 mb-20 max-w-lg shadow" style={{ backgroundColor: '#fff5c9' }}>
                <div className="rounded-full p-3" style={{ backgroundColor: '#fffdfa' }}>{EnvelopeIcon}</div>
                <div>
                    <div className="text-2xl font-bold text-yellow-700">Check Your Email!</div>
                </div>
                <div>
                    <p className="text-yellow-800 mb-1 text-center">
                        We have sent the password reset instruction to your email. <br /> 
                        You might need to <span className="font-semibold">check your spam email</span>.
                    </p>
                </div>
                <div className="text-s text-gray-700 px-20 py-4 rounded-lg bg-white font-semibold">
                    {userEmail ? `${userEmail}` : 'No email stored'}
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-1">
                    <button 
                        type="submit" 
                        className="py-3 px-36 mt-3 rounded-xl text-yellow-700 font-semibold bg-[#ffcd87] hover:bg-[#fcc06d]"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Sending...' : 'Resend Email'}
                    </button>
                    <Link to="/auth/enteremail" className="mt-4 text-yellow-700 text-center hover:underline flex justify-center">
                        <p>← Back to previous step</p>
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default Waiting;