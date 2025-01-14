import React, { useState } from "react";
import { login } from "../../services/authService";
import toastpic from "../../assets/landingpic.jpg";

const LogIn = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      alert("Login successful!");
    } catch (err) {
      alert("Error: " + err.response.data.error);
    }
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
              <input
                name="password"
                type="password"
                id="password"
                placeholder="Enter your password"
                onChange={handleChange}
                className="w-full px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-full text-gray-700 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                required
              />
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
            Don’t have an account?{" "}
            <button
              className="text-yellow-600 font-medium hover:underline focus:outline-none"
              onClick={() => alert("Redirect to Sign Up!")}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
