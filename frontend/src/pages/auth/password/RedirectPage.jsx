import React from "react";
import resetBg from '../../../assets/resetBg.jpg';
import { CheckerIcon } from "../../../assets/icon";
import { Link } from 'react-router-dom';

const RedirectPage = () => {
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
                <div className="rounded-full p-3" style={{ backgroundColor: '#fffdfa' }} >{CheckerIcon}</div>
                <div>
                    <div className="text-2xl font-bold text-yellow-700">Password Changed!</div>
                </div>
                <div>
                    <p className="text-yellow-800 mb-1">Your password has been changed successfully.</p>
                </div>
                <div>
                    <div className="flex items-center justify-center">
                        <Link to="/login" className="text-white bg-yellow-700 px-4 py-2 rounded-lg hover:bg-yellow-800">
                        Go to Login
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default RedirectPage

