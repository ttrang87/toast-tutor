import React from 'react';

const PAY_OPTIONS = ["Less than 20$", "20-40$", "40-60$", "60-80$", "Best match at any cost"];

const PayRangeSelection = ({ selectRange, setSelectRange }) => {
    const options = PAY_OPTIONS
    return (
        <div className='relative mb-32'>
            <select
                value={selectRange}
                onChange={(e) => setSelectRange(e.target.value)}
                className="w-full text-yellow-800 py-2 px-4 rounded-lg appearance-none bg-no-repeat focus:outline-none focus:ring-0 focus:border-yellow-400 border border-gray-300"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4L6 7.5L9.5 4' stroke='brown' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                    backgroundPosition: "right 0.5rem center"
                }}
                required
            >
                <option value="" disabled>Select a price</option>
                {options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
};

export default PayRangeSelection;