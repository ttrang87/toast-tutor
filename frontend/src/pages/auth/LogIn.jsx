import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toastpic from "../../assets/landingpic.jpg";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulate login logic
    if (email === "user@example.com" && password === "password") {
      localStorage.setItem("userId", 8);
      navigate(`/tutor/profile/8`);
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-yellow-50">
      <div className="relative w-full max-w-lg">
        {/* Toast Image */}
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

        {/* Toast "Bread" */}
        <div className="bg-white border-yellow-200 border rounded-[50px] shadow-2xl px-10 py-16 relative z-10">
          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-yellow-800 mb-4">
            Welcome Back!
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Log in to your account to continue.
          </p>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-full text-gray-700 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                placeholder="e.g., yourname@example.com"
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
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-full text-gray-700 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-600 text-sm font-medium text-center">
                {error}
              </p>
            )}

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
              onClick={handleSignup}
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
