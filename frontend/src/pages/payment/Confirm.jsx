import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-hot-toast';
import { API_ROUTES } from "../../constant/APIRoutes";

import PaymentInfo from "./confirmation/PaymentInfo";
import OrderDetails from "./confirmation/OrderDetails";
import PurchaseSummary from "./confirmation/PurchaseSummary";

const Confirm = () => {
    const { meetingId } = useParams();
    const navigate = useNavigate();
    const [meeting, setMeeting] = useState(null);
    const timerRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const stripe = useStripe();
    const elements = useElements();

    const [billingDetails, setBillingDetails] = useState({
        firstName: '',
        lastName: '',
        country: '',
        address: '',
        city: '',
        state: '',
        email: '',
        phone: ''
    });

    const [cardInfo, setCardInfo] = useState({
        last4: '4242',
        exp_month: '12',
        exp_year: '2025'
    });

    const [orderData, setOrderData] = useState({
        avatar: 0,
        tutor: "",
        date: "",
        price: 0,
        subject: "",
        time: ""
    });

    const paymentMethodId = sessionStorage.getItem("paymentMethodId");

    // Load cart data
    useEffect(() => {
        const data = localStorage.getItem("tutorCart");
        if (data) {
            try {
                const parsedData = JSON.parse(data);
                setOrderData({
                    avatar: parsedData[0].avatar,
                    tutor: parsedData[0].tutor,
                    date: parsedData[0].date,
                    price: parsedData[0].price,
                    subject: parsedData[0].subject,
                    time: parsedData[0].time
                });
            } catch (error) {
                console.error('Error parsing cart data:', error);
            }
        }
    }, []);

    // Timer management
    useEffect(() => {
        const initializeTimer = async () => {
            const timerData = localStorage.getItem('paymentTimer');
            
            if (!timerData) {
                await axios.post(API_ROUTES.CANCEL_PAYMENT(meetingId));
                toast("No timer data found, exiting effect", { icon: "⏲️", duration: 10000 });
                navigate("/");
                return;
            }

            try {
                const { meetingId: storedMeetingId, expiresAt } = JSON.parse(timerData); 
                
                if (storedMeetingId !== meetingId) {
                    await axios.post(API_ROUTES.CANCEL_PAYMENT(meetingId));
                    localStorage.removeItem('paymentTimer');
                    toast("Mismatch Stored Meeting Id with those in Headers", { icon: "📅", duration: 10000 });
                    navigate("/");
                    return;
                }

                const checkTimer = async () => {
                    const now = Date.now();
                    const timeRemaining = expiresAt - now;
                    
                    console.log('Timer check:', {
                        timeRemainingMinutes: Math.floor(timeRemaining / 60000),
                        timeRemainingSeconds: Math.floor((timeRemaining % 60000) / 1000)
                    });
                    
                    if (now >= expiresAt) {
                        try {
                            await axios.post(API_ROUTES.CANCEL_PAYMENT(meetingId));
                            localStorage.removeItem('paymentTimer');
                            toast("Payment window expired. Slot released.", { icon: "⏲️", duration: 10000 });
                            navigate("/");
                        } catch (error) {
                            console.error('Failed to cancel payment:', error);
                        }
                    }
                };

                await checkTimer();
                timerRef.current = setInterval(checkTimer, 1000);

            } catch (error) {
                console.error('Error in timer initialization:', error);
                try {
                    await axios.post(API_ROUTES.CANCEL_PAYMENT(meetingId));
                    localStorage.removeItem('paymentTimer');
                } catch (cancelError) {
                    console.error('Error canceling payment:', cancelError);
                }
            }
        };

        initializeTimer();

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [meetingId, navigate]);

    // Fetch card info
    useEffect(() => {
        if (!paymentMethodId) return;

        const fetchCardInfo = async () => {
            try {
                const response = await axios.post(
                    API_ROUTES.GET_CARD_INFO,
                    { paymentMethodId },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.data) {
                    setCardInfo({
                        ...response.data,
                        exp_month: response.data.exp_month.toString().padStart(2, '0')
                    });
                }
            } catch (error) {
                console.error("Error fetching card info:", error.response?.data || error.message);
            }
        };

        fetchCardInfo();
    }, [paymentMethodId]);

    // Load billing details
    useEffect(() => {
        const storedDetails = sessionStorage.getItem('billingDetails');
        
        if (storedDetails) {
            try {
                const parsedDetails = JSON.parse(storedDetails);

                if (parsedDetails.billingDetails) {
                    setBillingDetails(parsedDetails.billingDetails);
                } else if (parsedDetails.billing_details) {
                    setBillingDetails(parsedDetails.billing_details);
                } else {
                    setBillingDetails(parsedDetails);
                }
            } catch (error) {
                console.error("Error parsing billing details:", error);
            }
        }
    }, []);

    const orders = [
        {
            tutorName: orderData.tutor,
            icon: orderData.avatar,
            subject: orderData.subject,
            timeslot: `${orderData.time} (${orderData.date})`,  
            price: orderData.price
        }
    ];

    const totalPrice = orders.reduce((sum, order) => sum + order.price, 0);

    const handlePayment = async () => {
        if (!stripe || !elements) {
            alert("Stripe has not been properly initialized");
            await axios.post(API_ROUTES.CANCEL_PAYMENT(meetingId));
            window.location.href = '/cancel';
            return;
        }

        setIsLoading(true);

        try {
            const paymentMethodId = sessionStorage.getItem("paymentMethodId");
            const billingDetails = JSON.parse(sessionStorage.getItem("billingDetails") || '{}');

            const response = await axios.post(API_ROUTES.CONFIRM_STRIPE_PAYMENT, {
                paymentMethodId,
                amount: totalPrice,
                billingDetails
            });

            const { status, clientSecret } = response.data;

            if (status === 'requires_confirmation' || status === 'requires_payment_method' || status === 'requires_action') {
                const confirmResult = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: paymentMethodId
                });

                if (confirmResult.error) {
                    alert(`Payment failed: ${confirmResult.error.message}`);
                    await axios.post(API_ROUTES.CANCEL_PAYMENT(meetingId));
                    window.location.href = '/cancel';
                    return;
                } 
                
                if (confirmResult.paymentIntent.status === 'succeeded') {
                    await axios.post(API_ROUTES.CONFIRM_PAYMENT(meetingId));

                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                    }
                    localStorage.removeItem('paymentTimer');
                    sessionStorage.removeItem('paymentMethodId');
                    sessionStorage.removeItem('billingDetails');
                    
                    window.location.href = '/success';
                    return;
                }
            } else if (status === 'succeeded') {
                const { data } = await axios.post(API_ROUTES.CONFIRM_PAYMENT(meetingId));
                    
                setMeeting(data);

                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
                localStorage.removeItem('paymentTimer');
                sessionStorage.removeItem('paymentMethodId');
                sessionStorage.removeItem('billingDetails');
                
                window.location.href = '/success';
                return;
            }

            alert("Payment status: " + status);
            
        } catch (err) {
            await axios.post(API_ROUTES.CANCEL_PAYMENT(meetingId));
            alert("Payment failed. Please check your card or try again.");
            window.location.href = '/cancel';
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-yellow-50 min-h-screen w-full pt-4 relative">
            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-8 shadow-xl">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-yellow-100 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600 text-lg">Processing your payment...</p>
                            <p className="text-gray-500 text-sm mt-2">Please don&apos;t close this window</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mx-10 rounded-t-2xl min-h-screen flex flex-row">
                {/* Left Panel */}
                <div className="flex-[1.75] bg-white py-5 px-7 rounded-t-2xl">
                    <p className="font-semibold text-gray-600">Step 2 of 2</p>
                    <h1 className="text-3xl font-black text-gray-500 pb-2">Confirmation</h1>

                    <PaymentInfo billingDetails={billingDetails} cardInfo={cardInfo} />
                    <OrderDetails orders={orders} avatar={orderData.avatar} />
                </div>

                <PurchaseSummary 
                    orders={orders} 
                    totalPrice={totalPrice} 
                    isLoading={isLoading} 
                    onPayment={handlePayment} 
                />
            </div>
        </div>
    );
}; 

export default Confirm;