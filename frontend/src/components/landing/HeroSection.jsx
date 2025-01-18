import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate()
  const handleClick = () => {
    const userId = localStorage.getItem("userId");

    // Clear all items in localStorage
    localStorage.clear();

    // Set userId back into localStorage
    if (userId) {
        localStorage.setItem("userId", userId);
    }

    // Navigate to the desired route
    navigate(`/booking/${userId}`)
  }
  return (
    <div className="max-w-4xl mx-auto pl-4 py-16">
      <div className="text-left space-y-8">
        <div className="text-yellow-800">
          <h1 className='text-5xl font-bold mb-3'>Fresh tutoring</h1>
          <h2 className='text-4xl font-weight: 500;'>no matter how you slice it!</h2>
        </div>

        <p className="text-xl text-yellow-700 max-w-xl">
          If it feels overwhelming, just take one tiny step at
          <br />
          a time. I'm here with you! 🍞
        </p>

        <div className="flex flex-col gap-4 max-w-md pt-4">
          <button
            className="w-full text-white px-6 py-4 rounded-xl font-semibold transform hover:scale-105 transition-transform duration-200 shadow-lg"
            style={{ backgroundColor: '#d46c47' }}
            onClick={handleClick}
          >
            Find Your Perfect Tutor
          </button>

          <button
            className="w-full text-yellow-900 px-6 py-4 rounded-xl font-semibold transform hover:scale-105 transition-transform duration-200 shadow-lg"
            style={{ backgroundColor: '#ffbb74' }}
          >
            Become A Tutor
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;