import { useState } from "react";
import TimeService from "../../../components/booking_steps/TimeService";
import ClassScheduleBooking from "./ClassScheduleBooking";
import SOSBooking from "./SOSBooking";


const Booking = () => {
  const [selectOption, setSelectOption] = useState(null);

  if (selectOption === "sos") {
    return <SOSBooking />;
  } else if (selectOption === "class") {
    return <ClassScheduleBooking />;
  } else {
    return (
      <div className="flex items-center justify-center bg-yellow-50 min-h-screen">
        <div className="rounded-lg w-1/2 max-w-2xl min-h-[50vh] shadow-lg bg-white p-8 mb-20 space-y-5">
          <h1 className="text-yellow-700 text-3xl font-bold text-center">
            Tutor Match 🍞
          </h1>
          <div className="font-semibold text-yellow-700 text-xl !mb-4">
            Choose a Service
          </div>
          <TimeService
            selectOption={selectOption}
            setSelectOption={setSelectOption}
          />
        </div>
      </div>
    );
  }
};


export default Booking;