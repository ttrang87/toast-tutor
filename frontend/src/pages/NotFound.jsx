import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-yellow-50 text-yellow-700">
      {/* Content */}
      <div className="bg-white shadow-2xl rounded-lg px-10 py-8 text-center -mt-32">
        <h1 className="text-4xl font-bold text-yellow-800">404</h1>
        <p className="mt-4 text-xl font-medium">Oops! Page Not Found</p>
        <p className="mt-2 text-sm text-gray-600">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <button
          className="mt-6 py-2 px-6 rounded-lg bg-yellow-700 text-white font-semibold shadow-md hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          onClick={() => navigate("/")}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;