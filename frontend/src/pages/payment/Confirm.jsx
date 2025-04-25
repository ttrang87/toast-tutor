import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { angledownIcon, anglerightIcon } from '../../assets/icon';
import tutorIcon1 from '../../assets/avatar/avatar18.jpg';
import tutorIcon2 from '../../assets/avatar/avatar19.jpg';

const Confirmation = () => {
    const [isInfoVisible, setIsInfoVisible] = useState(true);

    const toggleInfo = () => {
        setIsInfoVisible(!isInfoVisible);
    };

    const orders = [
        {
            tutorName: "HanNotSoCute",
            icon: tutorIcon1,
            subject: "Biology",
            timeslot: "3:15PM - 5:00PM (Mar 14, 2024)",  
            price: 20
        },
        {
            tutorName: "HeoLeuLeu",
            icon: tutorIcon2,
            subject: "Mathematics",
            timeslot: "5:15PM - 7:00PM (Mar 19, 2024)",
            price: 30
        }
    ];

    const totalPrice = orders.reduce((sum, order) => sum + order.price, 0);

    return (
        <div className="bg-yellow-50 min-h-screen w-full pt-4">
            <div className="mx-10 rounded-t-2xl min-h-screen flex flex-row">
                {/* Left Panel */}
                <div className="flex-[1.75] bg-white py-5 px-7 rounded-t-2xl">
                    <p className="font-semibold text-gray-600">Step 2 of 2</p>
                    <h1 className="text-3xl font-black text-gray-500 pb-2">Confirmation</h1>

                    <div className="flex flex-row gap-2 my-2">
                        <button className="flex text-center justify-center font-bold text-yellow-700 py-2 flex-1 rounded-lg bg-orange-200">
                            Payment Information
                        </button>
                    </div>   

                    {/* User Information */}
                    <div className="rounded-md p-3 flex flex-row gap-2">
                        <div className="pt-1 pl-2 flex-1">
                            <button 
                                onClick={toggleInfo} 
                                className="cursor-pointer hover:bg-gray-100 p-1 rounded-full transition-colors"
                                aria-label={isInfoVisible ? "Hide details" : "Show details"}
                            >
                                {isInfoVisible ? angledownIcon : anglerightIcon}
                            </button>
                        </div>
                        <div className="flex-[12] text-gray-600">
                            <p className="text-lg text-gray-500"><strong>Xuan Gia Han, Nguyen</strong></p>
                            <p className="text-md">4111 Cedar Circle USF, Tampa, Fl, USA</p>
                            <p className="text-md">xuangiahannguyen@gmail.com</p>
                        </div>
                    </div>

                    {isInfoVisible && (
                        <div className="bg-gray-50 ml-16 p-3 animate-fadeIn mb-5">
                            <h3 className="font-bold mb-2 text-gray-500">Additional Payment Details</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <p className="text-sm text-gray-500">Payment Method</p>
                                    <p className="font-medium text-gray-600">Visa ending in 4242</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone Number</p>
                                    <p className="font-medium text-gray-600">+1 234 4533451</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Expiration</p>
                                    <p className="font-medium text-gray-600">04/2025</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Contact Preference</p>
                                    <p className="font-medium text-gray-600">Email</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-row gap-2 mt-2">
                        <button className="flex text-center justify-center font-bold text-yellow-700 py-2 flex-1 rounded-lg bg-orange-200">
                            Order Details
                        </button>
                    </div> 

                    {orders.map((order, index) => (
                        <React.Fragment key={index}>
                            <div className="my-2 mx-2 flex flex-row p-2 rounded-md">
                                <div>
                                    <img src={order.icon} alt={`${order.tutorName} icon`} className="w-28" />
                                </div>
                                <div className="mx-2 w-full">
                                    <p className="text-gray-600"><strong className="text-gray-600">Tutor: </strong>{order.tutorName}</p>
                                    <p className="text-gray-600"><strong className="text-gray-600">Subject: </strong>{order.subject}</p>
                                    <p className="text-gray-600"><strong className="text-gray-600">Timeslot: </strong>{order.timeslot}</p>
                                    <p className="text-gray-600"><strong className="text-gray-600">Price: </strong>${order.price}</p>
                                </div>
                            </div>
                            {index < orders.length - 1 && <hr className="mx-2" />}
                        </React.Fragment>
                    ))}
                    <hr className="mx-2 mb-4" />

                    <Link to="/payment" className="text-center w-full py-2 px-8 ml-3 rounded-lg bg-yellow-100 font-bold text-yellow-600 hover:bg-yellow-200 transition-colors">
                        Back
                    </Link>
                </div>

                {/* Right Panel - Purchase Summary */}
                <div className="flex-1 rounded-tr-2xl">
                    <div className="mx-3 px-2 pb-8 pt-6 rounded-lg bg-white">
                        <h2 className="text-2xl font-bold text-gray-500 pb-2 pl-3">Purchase Details</h2>
       
                        <div className="flex flex-col px-3 text-gray-600">
                            {orders.map((order, index) => (
                                <div key={index} className="flex justify-between pb-2">
                                    <p className="pl-1">{order.tutorName}</p>
                                    <p>${order.price}</p>
                                </div>
                            ))}
                            <div className="flex justify-between pb-2 text-orange-800 font-semibold">
                                <p className="pl-1">Voucher</p>
                                <p>- $0</p>
                            </div>
                            <hr className="pb-2"/>
                            <div className="flex justify-between pb-2 text-gray-500">
                                <p className="pl-1 text-2xl"><strong>Total</strong></p>
                                <p className="text-2xl"><strong>${totalPrice}</strong></p>
                            </div>
                            <div className="flex mt-1">
                                <Link to="/success" className="text-center w-full py-2 rounded-lg bg-yellow-100 font-bold text-yellow-600 hover:bg-yellow-200 transition-colors">
                                    Continue
                                </Link>
                            </div>
                        </div>   
                    </div>    
                </div>
            </div>
        </div>
    );
}; 

export default Confirmation;
