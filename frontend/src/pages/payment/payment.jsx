import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { API_ROUTES } from '../../constant/APIRoutes';

// Import your assets
import icon from '../../assets/avatar/avatar18.jpg';
import icon2 from '../../assets/avatar/avatar19.jpg';

// You need to get your publishable key from your Stripe dashboard
const stripePromise = loadStripe(import.meta.env.VITE_PUBLIC_KEY);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

// Cart items - could be passed as props or fetched from context/Redux
const cartItems = [
  {
    id: 1,
    tutor: "HanNotSoCute",
    subject: "Biology",
    date: "Mar 14, 2024",
    time: "3:15 - 5:00",
    price: 2000, // in cents
    avatar: icon
  },
  {
    id: 2,
    tutor: "HeoLeuLeu",
    subject: "Mathematics",
    date: "Mar 19, 2024",
    time: "5:15 - 7:00",
    price: 3000, // in cents
    avatar: icon2
  }
];

const CheckoutForm = ({ billingDetails, setBillingDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate order total
  const orderTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      setLoading(false);
      return;
    }

    try {
        const response = await axios.post(API_ROUTES.CONFIRM_CARD_SETUP);
        const { clientSecret } = response.data;

        const result = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
            name: `${billingDetails.firstName} ${billingDetails.lastName}`,
            email: billingDetails.email,
            phone: billingDetails.phone,
            address: {
                line1: billingDetails.address,
                city: billingDetails.city,
                state: billingDetails.state,
                country: billingDetails.country,
            }
            }
        }
        });

        if (result.error) {
        setError(result.error.message);
        } else {
        // Save the payment method ID for later use
        const paymentMethodId = result.setupIntent.payment_method;

        sessionStorage.setItem('paymentMethodId', paymentMethodId);
        sessionStorage.setItem('billingDetails', JSON.stringify(billingDetails));

        navigate('/confirmation');
        }
    } catch (err) {
      setError(err.message || 'An error occurred while processing payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col pt-5 gap-4 mx-1">
        <div className="flex flex-row gap-2 mt-2">
          <div className="flex text-center justify-center font-bold text-yellow-700 py-2 flex-1 rounded-lg bg-orange-200">
            Payment Information
          </div>
        </div>

        <div className="border p-4 rounded">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>

        <div className="flex flex-row gap-3">
          <input 
            type="text" 
            placeholder="First Name" 
            className="border p-2 rounded flex-1" 
            value={billingDetails.firstName}
            onChange={e => setBillingDetails({...billingDetails, firstName: e.target.value})}
            required
          />
          <input 
            type="text" 
            placeholder="Last Name" 
            className="border p-2 rounded flex-1" 
            value={billingDetails.lastName}
            onChange={e => setBillingDetails({...billingDetails, lastName: e.target.value})}
            required
          />
        </div>

        <div className="flex flex-row gap-2 mt-2">
          <div className="flex text-center justify-center font-bold text-yellow-700 py-2 flex-1 rounded-lg bg-orange-200">
            Billing address
          </div>
        </div>
        
        <input 
          type="text" 
          placeholder="Country / Region (fill in by code)" 
          className="border p-2 rounded" 
          value={billingDetails.country}
          onChange={e => setBillingDetails({...billingDetails, country: e.target.value})}
          required
        />
        <input 
          type="text" 
          placeholder="Billing Address" 
          className="border p-2 rounded" 
          value={billingDetails.address}
          onChange={e => setBillingDetails({...billingDetails, address: e.target.value})}
          required
        />

        <div className="flex flex-row gap-2">
          <input 
            type="text" 
            placeholder="City" 
            className="border p-2 rounded flex-1" 
            value={billingDetails.city}
            onChange={e => setBillingDetails({...billingDetails, city: e.target.value})}
            required
          />
          <input 
            type="text" 
            placeholder="State" 
            className="border p-2 rounded flex-1" 
            value={billingDetails.state}
            onChange={e => setBillingDetails({...billingDetails, state: e.target.value})}
            required
          />
        </div>

        <input 
          type="email" 
          placeholder="Email" 
          className="border p-2 rounded" 
          value={billingDetails.email}
          onChange={e => setBillingDetails({...billingDetails, email: e.target.value})}
          required
        />
        <input 
          type="tel" 
          placeholder="Phone Number" 
          className="border p-2 rounded" 
          value={billingDetails.phone}
          onChange={e => setBillingDetails({...billingDetails, phone: e.target.value})}
          required
        />
        
        {error && <div className="text-red-500">{error}</div>}
        
        <div className="flex flex-row gap-3 pb-10">
          <Link to="/" className="px-5 py-2 rounded-lg bg-yellow-100 font-bold text-yellow-600 hover:bg-yellow-200 transition-colors">
            Back
          </Link>
          <button 
            type="submit" 
            disabled={!stripe || loading} 
            className="px-5 py-2 rounded-lg bg-yellow-100 font-bold text-yellow-600 hover:bg-yellow-200 transition-colors disabled:opacity-70"
          >
            {loading ? 'Processing...' : 'Continue'}
          </button>
        </div>
      </div>
    </form>
  );
};

const Payment = () => {
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

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price, 0) / 100; // Convert cents to dollars
  };

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
            />
          </Elements>
        </div>

        <div className="flex-1 p-5 rounded-tr-2xl bg-[#FCFCFC]">
          <h2 className="text-2xl font-bold text-gray-500 pb-2 pt-8">Your Cart</h2>

          {cartItems.map((item) => (
            <div key={item.id} className="flex flex-col bg-white shadow-sm rounded-xl mb-3">
              <div className="flex flex-row">
                <div className="flex-1 pl-5 pt-4 pb-3">
                  <img src={item.avatar} alt="Tutor avatar" className="w-20"/>
                </div>
                <div className="flex-[3] py-4 pl-2">
                  <p className="text-gray-700"><strong className="text-gray-600">Tutor: </strong>{item.tutor}</p>
                  <p className="text-gray-700"><strong className="text-gray-600">Subject: </strong>{item.subject}</p>
                  <p><strong className="text-gray-600">Timeslot: </strong></p>
                  <div className="font-semibold text-gray-700 mr-4 text-center rounded-lg bg-orange-100 py-1 my-1">{item.date}</div>
                  <div className="font-semibold text-yellow-800 mr-4 text-center rounded-lg bg-yellow-100 py-1">{item.time}</div> 
                </div>
              </div>
              <div className="px-5 flex flex-col gap-1 pb-3">
                <hr />
                <p className="px-2 text-gray-700">
                  <strong className="text-gray-600">Price: </strong> ${item.price / 100}
                </p>
              </div>
            </div>
          ))}

          <div className="flex flex-col px-3 text-gray-500">
            <div className="flex justify-between pb-2">
              <p className="pl-1"><strong>Subtotal</strong></p>
              <p>${calculateSubtotal()}</p>
            </div>
            <hr className="pb-2"/>
            <div className="flex justify-between pb-2 text-gray-600">
              <p className="pl-1 text-2xl"><strong>Total</strong></p>
              <p className="text-2xl"><strong>${calculateSubtotal()}</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;