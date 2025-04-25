import React from "react";
import { Link } from "react-router-dom";
import { tickIcon } from "../../assets/icon";

const SuccessPayment = () => {
    return (
        <div className="bg-yellow-50 w-full min-h-screen pb-10 pt-4">
            <div className="bg-white mx-10 rounded-t-xl min-h-screen flex flex-col items-center justify-center">
                <div className="relative mb-8">
                    <div className="w-32 h-32 rounded-full bg-[#e8f5e9] flex items-center justify-center animate-[circle-pop_0.3s_ease-out]">
                        <div className="relative w-32 h-44">
                            <div className="animate-[draw-check_0.8s_ease-out_forwards]">
                                {tickIcon}
                            </div>
                        </div>
                    </div>
                </div>
                
                <p className="text-4xl font-bold mb-3 text-gray-600 animate-[fade-up_0.6s_ease-out_0.6s_both]">
                    Payment Successful!
                </p>
                <p className="text-gray-600 text-md mb-6 animate-[fade-up_0.6s_ease-out_0.7s_both]">
                    Your payment has been completed.
                </p>
                <Link 
                    to="/" 
                   className="text-center py-2 px-16 py-3 rounded-xl text-lg font-bold text-yellow-700 bg-orange-200 hover:bg-orange-300 transition-colors animate-[fade-up_0.6s_ease-out_0.7s_both]"
                >
                    Back to Homepage
                </Link>

                <style jsx>{`
                    @keyframes circle-pop {
                        0% {
                            transform: scale(0.8);
                            opacity: 0;
                        }
                        100% {
                            transform: scale(1);
                            opacity: 1;
                        }
                    }

                    @keyframes draw-check {
                        0% {
                            stroke-dasharray: 100;
                            stroke-dashoffset: 100;
                        }
                        100% {
                            stroke-dasharray: 100;
                            stroke-dashoffset: 0;
                        }
                    }

                    @keyframes fade-up {
                        0% {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        100% {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default SuccessPayment;

