import { useState } from "react";
import { login } from "../../services/authService";
import toastpic from "../../assets/landingpic.jpg";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { EyeCloseIcon, EyeOpenIcon } from "../../assets/icon";

const LogIn = (props) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const renderEyeIcon = (isOpen) => {
    return React.cloneElement(isOpen ? EyeOpenIcon : EyeCloseIcon);
  };


  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData); // Replace with your API logic
      props.setIsLoggedIn(true);

      // Show success toast
      toast.success("Logged in successfully!", {
        duration: 2000, // Optional: duration for the toast
      });

      navigate(`/tutor/profile/${localStorage.getItem("userId")}`);
    } catch (err) {
      // Show error toast
      toast.error(
        `Login failed: ${err.response?.data?.error || "Unknown error"}`,
        {
          duration: 2000,
        }
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-yellow-50 -mt-6">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="relative w-full max-w-md">
        {/* Image Block */}
        <div
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-50"
          style={{ zIndex: 50 }}
        >
          <img
            src={toastpic}
            alt="Toast"
            className="w-24 h-24 object-cover rounded-full ring-4 ring-yellow-400 shadow-xl"
          />
        </div>

        {/* Card Container */}
        <div className="bg-white border-yellow-200 border rounded-3xl shadow-lg px-8 py-12 relative z-10">
          <h2 className="text-2xl font-bold text-center text-yellow-800 mb-3">
            Welcome Back!
          </h2>
          <p className="text-center text-sm text-gray-600 mb-4">
            Log in to your account to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full px-3 py-2 bg-yellow-100 border border-yellow-300 rounded-md text-gray-700 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                required
              />
            </div>

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
                  className="w-full px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-md text-gray-700 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
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

            <button
              type="submit"
              className="w-full py-2 rounded-md bg-yellow-600 text-white font-semibold shadow hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              Log In
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-4">
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
              className="text-yellow-600 text-xs hover:underline mt-2"
              onClick={() => navigate("/auth/enteremail")}
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
