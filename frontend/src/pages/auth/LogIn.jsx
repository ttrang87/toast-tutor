import React, { useState } from "react";
import { login } from "../../services/authService";
import toastpic from "../../assets/landingpic.jpg";
import { useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeOpenIcon } from "../../assets/icon";

const LogIn = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      navigate("/")
    } catch (err) {
      alert("Error: " + err.response.data.error);
    }
  };

  const navigate = useNavigate();

  // Create React elements from the imported JSX
  const renderEyeIcon = (isOpen) => {
    return React.cloneElement(isOpen ? EyeOpenIcon : EyeCloseIcon, {
      className: "w-5 h-5"
    });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-yellow-50">
      <div className="relative w-full max-w-lg">
        {/* Image Block */}
        <div
          className="absolute -top-14 left-1/2 transform -translate-x-1/2 z-50"
          style={{ zIndex: 50 }}
        >
          <img
            src={toastpic}
            alt="Toast"
            className="w-28 h-28 object-cover rounded-full ring-4 ring-yellow-400 shadow-xl"
          />
        </div>

        {/* Card Container */}
        <div className="bg-white border-yellow-200 border rounded-[50px] shadow-2xl px-10 py-16 relative z-10">
          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-yellow-800 mb-4">
            Welcome Back!
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Log in to your account to continue.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                name="username"
                id="username"
                placeholder="Enter your username"
                onChange={handleChange}
                className="w-full px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-full text-gray-700 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-full text-gray-700 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {renderEyeIcon(showPassword)}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-yellow-600 text-white font-semibold shadow-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              Log In
            </button>
          </form>

          {/* Sign Up Redirect */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <button
              className="text-yellow-600 font-medium hover:underline focus:outline-none"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </p>
          <div className="text-center">
            <button 
              className="text-yellow-600 text-sm hover:underline mt-2"
              onClick={() => navigate('/auth/enteremail')}
            >
              Forget Password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;