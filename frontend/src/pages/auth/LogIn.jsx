import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toastpic from "../../assets/landingpic.jpg";
import Form from "./Form";

const LogIn = () => {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [error, setError] = useState("");
  const navigate = useNavigate();

  // const handleLogin = (e) => {
  //   e.preventDefault();

  //   // Simulate login logic
  //   if (email === "user@example.com" && password === "password") {
  //     localStorage.setItem("userId", 8);
  //     navigate(`/tutor/profile/8`);
  //   } else {
  //     setError("Invalid email or password. Please try again.");
  //   }
  // };

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
          <Form route="/api/token/" method="login"/>

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
