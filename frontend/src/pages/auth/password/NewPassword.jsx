import React, { useState } from "react";
import resetBg from '../../../assets/resetBg.jpg';
import { UnlockIcon, EyeCloseIcon, EyeOpenIcon } from "../../../assets/icon";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {API_ROUTES} from '../../../constant/APIRoutes';

const NewPassword = () => {
    const navigate = useNavigate();
    const { token } = useParams(); 
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

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

    const handlePasswordChange = (e) => {
        setPassword1(e.target.value);
        if (password2 && e.target.value !== password2) {
            setErrorMessage("The passwords you entered do not match.");
        } else {
            setErrorMessage("");
        }
    };

    const handleConfirmPasswordChange = (e) => {
        setPassword2(e.target.value);
        if (password1 && e.target.value !== password1) {
            setErrorMessage("The passwords you entered do not match.");
        } else {
            setErrorMessage("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!token) {
            showToast("Invalid reset token");
            return;
        }
    
        if (password1 !== password2) {
            setErrorMessage("The passwords you entered do not match.");
            showToast("The passwords you entered do not match.");
            return;
        }
    
        try {
            const response = await axios.post(API_ROUTES.RESET_PASSWORD(), {
                password: password1,
                token: token
            });
    
            showToast("Your password has been changed successfully!", 'success');
            navigate("/auth/redirect");
        } catch (error) {
            console.error('Reset password error:', error.response?.data);
            showToast(error.response?.data?.message || "An error occurred. Please try again.");
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
            <div className="rounded-2xl flex items-center justify-center flex-col w-1/2 p-10 gap-3 mb-20 max-w-lg shadow" style={{ backgroundColor: '#fff5c9' }}>
                <div className="rounded-full p-3" style={{ backgroundColor: '#fffdfa' }}>{UnlockIcon}</div>
                <div>
                    <div className="text-2xl font-bold text-yellow-700">Set new password</div>
                </div>
                <div>
                    <p className="text-yellow-800 mb-1 text-center">Enter your new password below. Make sure <br /> it is strong and secure.</p>
                </div>
                <div>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                        <label htmlFor="password1" className="text-yellow-700 font-semibold">New Password <span className="text-red-600">*</span></label>
                        <div className="relative">
                            <input
                                type={showPassword1 ? "text" : "password"}
                                className={`rounded-lg w-96 h-10 px-3 pr-10 placeholder-gray-400 text-left ${errorMessage && password1 !== password2 ? 'border-red-500' : ''}`}
                                name="password1"
                                id="password1"
                                placeholder="Password"
                                value={password1}
                                onChange={handlePasswordChange}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowPassword1(!showPassword1)}
                            >
                                {showPassword1 ? EyeCloseIcon : EyeOpenIcon}
                            </button>
                        </div>
                        <label htmlFor="password_again2" className="text-yellow-700 font-semibold">Confirm Password <span className="text-red-600">*</span></label>
                        <div className="relative">
                            <input
                                type={showPassword2 ? "text" : "password"}
                                className={`rounded-lg w-96 h-10 px-3 pr-10 placeholder-gray-400 text-left ${errorMessage && password1 !== password2 ? 'border-red-800' : ''}`}
                                name="password_again2"
                                id="password_again2"
                                placeholder="Password"
                                value={password2}
                                onChange={handleConfirmPasswordChange}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowPassword2(!showPassword2)}
                            >
                                {showPassword2 ? EyeCloseIcon : EyeOpenIcon}
                            </button>
                        </div>
                        {errorMessage && <p className="text-red-600 font-semibold text-center text-md mt-1">{errorMessage}</p>}
                        <button type="submit" className="py-3 mt-3 rounded-xl text-yellow-700 font-semibold bg-[#ffcd87] hover:bg-amber-400 hover:bg-[#fcc06d]">Reset Password</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewPassword;