import { React, useState, useEffect } from 'react';
import logo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  localStorage.setItem('userId', 8);

  const [isLog, setIsLog] = useState(false);
  const navigate = useNavigate();

  // Check login status
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLog(!!userId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setIsLog(false);
    navigate("/");
  };

  return (
    <div className="flex items-center px-8 bg-yellow-50 text-yellow-700 py-2">
      {/* Left - Logo */}
      <div className="w-1/3">
        <img
          src={logo}
          alt="Logo"
          className="w-48 h-auto object-cover"
        />
      </div>

      {/* Center - Navigation */}
      <div className="flex justify-center w-1/3 gap-4 font-semibold">
        <button
          className="py-2 w-20 rounded-full bg-transparent hover:bg-gray-400/20 transition-all duration-200"
          onClick={() => navigate("/")}
        >
          Home
        </button>
        {isLog && (
          <button
            className="py-2 w-20 rounded-full bg-transparent hover:bg-gray-400/20 transition-all duration-200"
            onClick={() => navigate(`/tutor/profile/${localStorage.getItem("userId")}`)}
          >
            Profile
          </button>
        )}
        <button
          className="py-2 w-20 rounded-full bg-transparent hover:bg-gray-400/20 transition-all duration-200"
        >
          Tutors
        </button>
        <button
          className="py-2 w-20 rounded-full bg-transparent hover:bg-gray-400/20 transition-all duration-200"
        >
          Contact
        </button>
      </div>

      {/* Right - Log In/Log Out */}
      <div className="flex justify-end w-1/3">
        {isLog ? (
          <button
            className="py-1 px-4 text-sm font-semibold rounded-full bg-yellow-800 text-white hover:bg-yellow-900 transition-color duration-200"
            onClick={handleLogout}
          >
            Log Out
          </button>
        ) : (
          <button
            className="py-1 px-4 rounded-full bg-yellow-800 text-white hover:bg-yellow-900 transition-color duration-200"
            onClick={() => navigate("/login")}
          >
            Log In
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;