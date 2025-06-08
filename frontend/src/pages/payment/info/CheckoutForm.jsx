import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { API_ROUTES } from '../../../constant/APIRoutes';

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

const CheckoutForm = ({ billingDetails, setBillingDetails, meetingId, cart }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
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
        const paymentMethodId = result.setupIntent.payment_method;
        sessionStorage.setItem('paymentMethodId', paymentMethodId);
        sessionStorage.setItem('billingDetails', JSON.stringify(billingDetails));
        localStorage.setItem('tutorCart', JSON.stringify(cart));
        navigate(`/confirmation/${meetingId}`);
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

export default CheckoutForm;