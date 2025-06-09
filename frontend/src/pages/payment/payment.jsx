import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_ROUTES } from '../../constant/APIRoutes';

import CheckoutForm from './info/CheckoutForm';
import CartSummary from './info/CartSummary';

const stripePromise = loadStripe(import.meta.env.VITE_PUBLIC_KEY);

const Payment = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const timerRef = useRef(null);
  
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

  const [tutorData, setTutorData] = useState({
    username: '',
    hourlyRate: 0,
    avatar: 0
  });

  const [meetingData, setMeetingData] = useState({
    date: null,
    startTime: null,
    endTime: null,
    duration: null,
    price: null
  });

  const subject = localStorage.getItem("selectedSubject");

  const parseDuration = (str) => {
    const hourMatch = str.match(/(\d+)h/);
    const minuteMatch = str.match(/(\d+)m/);
    const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
    const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
    return hours + minutes / 60;
  };

  // Load tutor data
  useEffect(() => {
    const data = localStorage.getItem('matchedTutorsResponse'); 
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        setTutorData({
          username: parsedData[0].username,
          hourlyRate: parsedData[0].hourlyRate,
          avatar: parsedData[0].avatar
        });
      } catch (error) {
        console.error('Error parsing tutor data:', error);
      }
    }
  }, []);

  // Load meeting timing data
  useEffect(() => {
    const timing = localStorage.getItem("MeetingTiming");
    if (timing) {
      try {
        const parseData = JSON.parse(timing);
        
        const formatted = new Date(parseData.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        
        const startTime = new Date(parseData.start_time).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        const endTime = new Date(parseData.end_time).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        setMeetingData({
          date: formatted,
          startTime: startTime,
          endTime: endTime,
          duration: parseData.duration,
          price: null
        });
      } catch (error) {
        console.error('Error parsing meeting data:', error);
      }
    }
  }, []);

  // Calculate price when both hourlyRate and duration are available
  useEffect(() => {
    if (tutorData.hourlyRate > 0 && meetingData.duration) {
      const hour = parseDuration(meetingData.duration);
      const pay = tutorData.hourlyRate * 100 * hour;
      setMeetingData(prev => ({ ...prev, price: pay }));
    }
  }, [tutorData.hourlyRate, meetingData.duration]);

  // Payment timer logic
  useEffect(() => {
    const timerData = localStorage.getItem('paymentTimer');
    if (!timerData) return;

    try {
      const { meetingId: storedMeetingId, expiresAt } = JSON.parse(timerData);
      if (storedMeetingId !== meetingId) return;

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

      checkTimer();
      timerRef.current = setInterval(checkTimer, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    } catch (error) {
      console.error('Error parsing timer data:', error);
      localStorage.removeItem('paymentTimer');
    }
  }, [meetingId, navigate]);

  const cartItems = [
    {
      id: meetingId,
      tutor: tutorData.username,
      subject: subject,
      date: meetingData.date,
      time: `${meetingData.startTime} - ${meetingData.endTime}`,
      price: meetingData.price,
      avatar: tutorData.avatar
    }
  ];

  return (
    <div className="bg-yellow-50 min-h-screen w-full pt-4">
      <div className="bg-white mx-10 rounded-t-2xl min-h-screen flex flex-row">
        <div className="flex-[1.75] bg-white py-5 px-7 rounded-tl-2xl">
          <p className="font-semibold text-gray-600">Step 1 of 2</p>
          <h1 className="text-3xl font-black text-gray-500 pb-2">Check Out</h1>
          
          <Elements stripe={stripePromise}>
            <CheckoutForm 
              billingDetails={billingDetails} 
              setBillingDetails={setBillingDetails}
              meetingId={meetingId}
              cart={cartItems}
            />
          </Elements>
        </div>

        <CartSummary cartItems={cartItems} />
      </div>
    </div>
  );
};

export default Payment;