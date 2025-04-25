import React from "react";
import { Link } from 'react-router-dom';
import {creditcardIcon} from '../../assets/icon';

import icon from '../../assets/avatar/avatar18.jpg';
import icon2 from '../../assets/avatar/avatar19.jpg';

const Payment = () => {
    return (
        <div className="bg-yellow-50 min-h-screen w-full pt-4">
            <div className="bg-white mx-10 rounded-t-2xl min-h-screen flex flex-row">
                <div className="flex-[1.75] bg-white py-5 px-7 rounded-tl-2xl">
                    <p className="font-semibold text-gray-600">Step 1 of 2</p>
                    <h1 className="text-3xl font-black text-gray-500 pb-2">Check Out</h1>
                    
                    <div className="flex flex-row gap-2 mt-2">
                        <button className="flex text-center justify-center font-bold text-yellow-700 py-2 flex-1 rounded-lg bg-orange-200">
                            Payment Information
                        </button>
                    </div>         

                    <form action="submit" className="flex flex-col pt-5 gap-4 mx-1">
                        <div className="flex flex-row gap-3 items-center">
                            <div className="relative flex items-center flex-[2]">
                                <input
                                    type="text"
                                    placeholder="Card Number"
                                    className="border p-3 pl-10 rounded w-full"
                                />
                                <div className="absolute left-3">
                                    {creditcardIcon}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row gap-3">
                            <input type="text" placeholder="First Name" className="border p-2 rounded flex-1" />
                            <input type="text" placeholder="Last Name" className="border p-2 rounded flex-1" />
                        </div>
                        <div className="flex flex-row gap-3">
                            <input
                                type="month"
                                className="border p-2 rounded flex-1 text-gray-700"
                            />
                            <input type="number" placeholder="CVV" className="border p-2 rounded flex-1" />
                        </div>

                        <div className="flex flex-row gap-2 mt-2">
                            <button className="flex text-center justify-center font-bold text-yellow-700 py-2 flex-1 rounded-lg bg-orange-200">
                                Billing address
                            </button>
                        </div>  
                        
                        <input type="text" placeholder="Country / Region" className="border p-2 rounded" />
                        <input type="text" placeholder="Billing Address" className="border p-2 rounded" />

                        <div className="flex flex-row gap-2">
                            <input type="text" placeholder="City" className="border p-2 rounded flex-1" />
                            <input type="text" placeholder="State" className="border p-2 rounded flex-1" />
                        </div>

                        <input type="text" placeholder="Email" className="border p-2 rounded" />
                        <input type="number" placeholder="Phone Number" className="border p-2 rounded" />
                        
                        <div className="flex flex-row gap-3 pb-10">
                            <Link to="/" className="px-5 py-2 rounded-lg bg-yellow-100 font-bold text-yellow-600 hover:bg-yellow-200 transition-colors">
                                Back
                            </Link>
                            <Link to="/confirmation" className="px-5 py-2 rounded-lg bg-yellow-100 font-bold text-yellow-600 hover:bg-yellow-200 transition-colors">
                                Continue
                            </Link>
                        </div>
                    </form>
                </div>

                <div className="flex-1 p-5 rounded-tr-2xl bg-[#FCFCFC]">
                    <h2 className="text-2xl font-bold text-gray-500 pb-2 pt-8">Your Cart</h2>

                    <div className="flex flex-col bg-white shadow-sm rounded-xl mb-3">
                        <div className="flex flex-row">
                            <div className="flex-1 pl-5 pt-4 pb-3">
                                <img src={icon} alt="icon" className="w-20"/>
                            </div>
                            <div className="flex-[3] py-4 pl-2">
                                <p className="text-gray-700"><strong className="text-gray-600">Tutor: </strong>HanNotSoCute</p>
                                <p className="text-gray-700"><strong className="text-gray-600">Subject: </strong>Biology</p>
                                <p><strong className="text-gray-600">Timeslot: </strong></p>
                               <div className="font-semibold text-gray-700 mr-4 text-center rounded-lg bg-orange-100  py-1 my-1">Mar 14, 2024</div>
                                <div className="font-semibold text-yellow-800  mr-4 text-center rounded-lg bg-yellow-100 py-1">3:15 - 5:00</div> 
                            </div>
                        </div>
                        <div className="px-5 flex flex-col gap-1 pb-3">
                            <hr />
                            <p className="px-2 text-gray-700"><strong className="text-gray-600">Price: </strong> $20</p>
                        </div>
                    </div>

                    <div className="flex flex-col bg-white shadow-sm rounded-xl mb-3">
                        <div className="flex flex-row">
                            <div className="flex-1 pl-5 pt-4 pb-3">
                                <img src={icon2} alt="icon" className="w-20"/>
                            </div>
                            <div className="flex-[3] py-4 pl-2">
                                <p className="text-gray-700"><strong className="text-gray-600">Tutor: </strong>HeoLeuLeu</p>
                                <p className="text-gray-700"><strong className="text-gray-600">Subject: </strong>Mathematics</p>
                                <p><strong className="text-gray-600">Timeslot: </strong></p>
                                <div className="font-semibold text-gray-700 mr-4 text-center rounded-lg bg-orange-100 py-1 my-1">Mar 19, 2024</div>
                                <div className="font-semibold text-yellow-800 mr-4 text-center rounded-lg bg-yellow-100 py-1">5:15 - 7:00</div>
                            </div>
                        </div>
                        <div className="px-5 flex flex-col gap-1 pb-3">
                            <hr />
                            <p className="px-2 text-gray-700"><strong className="text-gray-600">Price: </strong> $30</p>
                        </div>
                    </div>

                    <div className="flex flex-col px-3 text-gray-500">
                        <div className="flex justify-between pb-2">
                            <p className="pl-1"><strong>Subtotal</strong></p>
                            <p>$50</p>
                        </div>
                        <hr className="pb-2"/>
                        <div className="flex justify-between pb-2 text-gray-600">
                            <p className="pl-1 text-2xl"><strong>Total</strong></p>
                            <p className="text-2xl"><strong>$50</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 

export default Payment;
