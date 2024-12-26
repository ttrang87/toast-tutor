import React from 'react';
import logo from '../../assets/logo.png';

const Header = () => {
  return (
    <div className="flex items-center px-8 bg-yellow-50 text-yellow-700 py-4">
      {/* Left - Logo */}
      <div className="w-1/3">
        <img 
          src={logo} 
          alt="Logo" 
          className="w-48 h-auto object-cover"
        />
      </div>
      
      {/* Center - Navigation */}
      <div className='flex justify-center w-1/3 gap-3 font-semibold'>
        <button className='py-2 w-20 rounded-full bg-transparent hover:bg-gray-400/20 transition-all duration-200'>Home</button>
        <button className='py-2 w-20 rounded-full bg-transparent hover:bg-gray-400/20 transition-all duration-200'>Tutors</button>
        <button className='py-2 w-20 rounded-full bg-transparent hover:bg-gray-400/20 transition-all duration-200'>Log In</button>
        <button className='py-2 w-20 rounded-full bg-transparent hover:bg-gray-400/20 transition-all duration-200'>Contact</button>
      </div>

      {/* Right - Empty space to balance layout */}
      <div className="w-1/3"></div>
    </div>
  );
};

export default Header;