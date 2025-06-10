import { useState } from 'react';
import { angledownIcon, anglerightIcon } from '../../../assets/icon';


const PaymentInfo = ({ billingDetails, cardInfo }) => {
    const [isInfoVisible, setIsInfoVisible] = useState(true);

    const toggleInfo = () => {
        setIsInfoVisible(!isInfoVisible);
    };

    const fullName = `${billingDetails?.firstName || ''} ${billingDetails?.lastName || ''}`.trim();
    const fullAddress = billingDetails ? 
        `${billingDetails.address || ''}, ${billingDetails.city || ''}, ${billingDetails.state || ''}, ${billingDetails.country || ''}`.replace(/^,\s*|,\s*(?=,)|,\s*$/g, '') : 
        '';

    return (
        <>
            <div className="flex flex-row gap-2 my-2">
                <button className="flex text-center justify-center font-bold text-yellow-700 py-2 flex-1 rounded-lg bg-orange-200">
                    Payment Information
                </button>
            </div>   

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
                    <p className="text-lg text-gray-500"><strong>{fullName || "Xuan Gia Han, Nguyen"}</strong></p>
                    <p className="text-md">{fullAddress || "4111 Cedar Circle USF, Tampa, Fl, USA"}</p>
                    <p className="text-md">{billingDetails.email || "xuangiahannguyen@gmail.com"}</p>
                </div>
            </div>

            {isInfoVisible && (
                <div className="bg-gray-50 ml-20 p-3 animate-fadeIn mb-5">
                    <h3 className="font-bold mb-2 text-gray-500">Additional Payment Details</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <p className="text-sm text-gray-500">Payment Method</p>
                            <p className="font-medium text-gray-600">
                                Visa ending in {cardInfo.last4}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Phone Number</p>
                            <p className="font-medium text-gray-600">
                                {(billingDetails && billingDetails.phone) || '+1 234 4533451'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Expiration</p>
                            <p className="font-medium text-gray-600">
                                {cardInfo.exp_month}/{cardInfo.exp_year}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Contact Preference</p>
                            <p className="font-medium text-gray-600">Email</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PaymentInfo;