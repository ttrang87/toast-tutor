const PAY_OPTIONS = [
    { label: "Less than 20$", value: "0-20$" },
    { label: "20-40$", value: "20-40$" },
    { label: "40-60$", value: "40-60$" },
    { label: "60-80$", value: "60-80$" },
    { label: "Best match at any cost", value: "0-1000$" }
];

const PayRangeSelection = ({ selectRange, setSelectRange }) => {
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
                {PAY_OPTIONS.map((option, index) => (
                    <option key={index} value={option.value}>{option.label}</option>
                ))}
            </select>
        </div>
    );
};

export default PayRangeSelection;
