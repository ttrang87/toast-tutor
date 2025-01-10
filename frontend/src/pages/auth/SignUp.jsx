import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "./Form";

const SignUp = () => {
  // const [username, setUsername] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  // const [error, setError] = useState("");
  const navigate = useNavigate();

  // const handleSignUp = (e) => {
  //   e.preventDefault();

  //   // Simulate sign-up logic
  //   if (password !== confirmPassword) {
  //     setError("Passwords do not match. Please try again.");
  //   } else {
  //     localStorage.setItem("userId", 8); // Set some user ID for the session
  //     navigate(`/tutor/profile/8`);
  //   }
  // };

  return (
    <div className="flex items-center justify-center h-screen bg-yellow-50">
      <div className="relative w-full max-w-lg">
        <div className="bg-white border-yellow-200 border rounded-[50px] shadow-2xl px-10 py-16 relative">
          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-yellow-800 mb-4">
            Create Your Account
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Sign up to start using our platform.
          </p>

          {/* Form */}
          <Form route="/api/user/register/" method="signup"/>

          {/* Login Redirect */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <button
              className="text-yellow-600 font-medium hover:underline focus:outline-none"
              onClick={() => navigate("/login")}
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
