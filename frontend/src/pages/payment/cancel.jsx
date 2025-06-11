import { Link } from "react-router-dom";
import { closeIcon } from "../../assets/icon"; 
import "./SuccessPayment.css";

const Cancel = () => {
  return (
    <div className="bg-yellow-50 w-full min-h-screen pb-10 pt-4">
      <div className="bg-white mx-10 rounded-t-xl min-h-screen flex flex-col items-center justify-center">
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full bg-[#ffebee] flex items-center justify-center animate-circle-pop">
            <div className="relative w-34 h-34">
              <div className="animate-[draw-x_0.8s_ease-out_forwards]">
                {closeIcon}
              </div>
            </div>
          </div>
        </div>
        <p className="text-4xl font-bold mb-3 text-gray-600 animate-[fade-up_0.6s_ease-out_0.6s_both]">
          Payment Canceled
        </p>
        <p className="text-gray-600 text-md mb-6 animate-[fade-up_0.6s_ease-out_0.7s_both]">
          Your payment has been canceled.
        </p>
        <Link
          to="/"
          className="text-center py-2 px-16 py-3 rounded-xl text-lg font-bold text-red-700 bg-red-100 hover:bg-red-200 transition-colors animate-[fade-up_0.6s_ease-out_0.7s_both]"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default Cancel;