
import React, { useState } from "react";
import resetBg from '../../../assets/resetBg.jpg';
import { LockIcon } from "../../../assets/icon";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {API_ROUTES} from '../../../constant/APIRoutes';

const EnterEmail = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                borderRadius: '8px', 
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            },
            progressStyle: {
                background: type === 'success' ? 'green' : 'red', 
            },
        };
        
        if (type === 'success') {
            toast.success(message, toastConfig);
        } else {
            toast.error(message, toastConfig);
        }
    };

    const handleInputChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate email format
        if (!/\S+@\S+\.\S+/.test(email)) {
            showToast("Please enter a valid email address.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(API_ROUTES.FORGOT_PASSWORD(), {
                email: email.trim(),
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                localStorage.setItem('resetEmail', email.trim());
                showToast("Password reset link sent to your email!", 'success');
                navigate("/auth/waiting");
            } else {
                showToast('An error occurred. Please try again later.');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                showToast('Invalid email address.');
            } else if (error.response && error.response.status === 404) {
                showToast('Email not found.');
            } 
        } finally {
            setIsSubmitting(false);
        }
    };

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
                <div className="rounded-full p-3" style={{ backgroundColor: '#fffdfa' }}>{LockIcon}</div>
                <div>
                    <div className="text-2xl font-bold text-yellow-700 text-center">Forgot Password?</div>
                </div>
                <div>
                    <p className="text-yellow-800 mb-1 text-center">No worries, we'll send you the reset instructions through your email.</p>
                </div>
                <div>
                    <div className="flex items-center justify-center">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-1 ">
                            <textarea
                                className="rounded-lg resize-none h-10 pt-2 items-center justify-center text-center"
                                name="email"
                                id="email"
                                placeholder="Enter your email"
                                cols="38"
                                value={email}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            ></textarea>
                            <button
                                type="submit"
                                className="py-3 mt-3 rounded-xl text-yellow-700 font-semibold bg-[#ffcd87] hover:bg-[#fcc06d]"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Request'}
                            </button>
                            <Link to="/login" className="mt-4 text-yellow-700 text-center hover:underline flex justify-center">
                                <p>← Back to log in</p>
                            </Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnterEmail;