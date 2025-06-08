
const PurchaseSummary = ({ orders, totalPrice, isLoading, onPayment }) => {
    return (
        <div className="flex-1 rounded-tr-2xl">
            <div className="mx-3 px-2 pb-8 pt-6 rounded-lg bg-white">
                <h2 className="text-2xl font-bold text-gray-500 pb-2 pl-3">Purchase Details</h2>

                <div className="flex flex-col px-3 text-gray-600">
                    {orders.map((order, index) => (
                        <div key={index} className="flex justify-between pb-2">
                            <p className="pl-1">{order.tutorName}</p>
                            <p>{order.price ? `$${order.price / 100}` : 'Calculating...'}</p>
                        </div>
                    ))}
                    <div className="flex justify-between pb-2 text-orange-800 font-semibold">
                        <p className="pl-1">Voucher</p>
                        <p>- $0</p>
                    </div>
                    <hr className="pb-2"/>
                    <div className="flex justify-between pb-2 text-gray-500">
                        <p className="pl-1 text-2xl"><strong>Total</strong></p>
                        <p className="text-2xl"><strong>{totalPrice ? `$${totalPrice / 100}` : 'Calculating...'}</strong></p>
                    </div>
                    <div className="flex mt-1">
                        <button
                            onClick={onPayment}
                            disabled={isLoading}
                            className={`text-center w-full py-2 rounded-lg font-bold transition-colors ${
                                isLoading 
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                    : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                            }`}
                        >
                            {isLoading ? 'Processing...' : 'Continue'}
                        </button>
                    </div>
                </div>   
            </div>    
        </div>
    );
};

export default PurchaseSummary;