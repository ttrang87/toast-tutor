import React, { useState } from "react";
import { register } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "email") {
      setEmail(e.target.value);
    } else if (e.target.name === "username") {
      setUsername(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (confirmPassword != formData.password) {
      alert("Confirm password does not match.");
      return;
    }

    const dataToSend = {
      ...formData,
      profile: {
        email: email,
        username: username,
        bio: "Short bio", // Get these from form inputs
        hourly_rate: 30,
        teaching_style: "Friendly",
        avatar: 1,
        cover: 1,
      },
      education: [
        {
          school_name: "University of XYZ",
          degree: "Bachelor's",
          start_year: 2020,
          end_year: "2024",
        },
      ],
      course: [
        {
          name: "Math 101",
          grade: "A",
          level: "Undergraduate",
          experience: "Completed",
        },
      ],
      exam: [
        {
          name: "GRE",
          score: "320",
          date: "2023-12-01",
          experience: "Good",
        },
      ],
      award: [
        {
          name: "Best Student",
          year: 2022,
        },
      ],
    };

    try {
      const response = await register(dataToSend);
      alert(response.message);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        const errors = err.response.data.errors;
        if (errors.username) {
          alert(`Username: ${errors.username.join(", ")}`);
        }
        if (errors.email) {
          alert(`Email: ${errors.email.join(", ")}`);
        }
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
    // try {
    //   const response = await register(formData);
    //   alert(response.message);
    // } catch (err) {
    //   alert("Error: " + err.message);
    // }
  };

  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-yellow-50 -mt-10">
      <div className="relative w-full max-w-lg">
        {/* Card Container */}
        <div className="bg-white border-yellow-200 border rounded-[50px] shadow-2xl px-10 py-10 relative z-10">
          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-yellow-800 mb-4">
            Create Your Account
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Sign up to start using our platform.
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

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                name="email"
                id="email"
                placeholder="Enter your email"
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

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                name="password2"
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-full text-gray-700 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-yellow-600 text-white font-semibold shadow-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              Sign Up
            </button>
          </form>

          {/* Log In Redirect */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <button
              className="text-yellow-600 font-medium hover:underline focus:outline-none"
              onClick={() => {
                navigate("/login");
              }}
            >
              Log In
            </button>
          </p>
        </div>
      </div>
      {/* <div className="w-full max-w-md">
        <div className="bg-white border border-yellow-200 rounded-[50px] shadow-2xl px-8 py-12">
          <h2 className="text-3xl font-bold text-center text-yellow-800 mb-4">
            Create Your Account
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Sign up to start using our platform.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="username"
              placeholder="Username"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
            <input
              name="password2"
              type="password"
              placeholder="Confirm Password"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full bg-yellow-500 text-white font-medium py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              Sign Up
            </button>
          </form>

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
      </div> */}
    </div>
  );
};

export default SignUp;
