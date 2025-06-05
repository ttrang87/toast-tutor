import { useState, useEffect } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  googleSignIn,
  googleLogout,
  combineDateAndTime,
  createCalendarEvent,
  calendarStyles,
} from "./MeetingUtils";

const Meeting = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState("12:00");
  const [endTime, setEndTime] = useState("13:00");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  const handleGoogleSignIn = async () => {
    await googleSignIn(supabase);
  };

  const handleLogout = async () => {
    await googleLogout(supabase);
    setUserId(null);
  };

  const handleCreateCalendarEvent = async () => {
    try {
      setIsLoading(true);
      const startDateTime = combineDateAndTime(startDate, startTime);
      const endDateTime = combineDateAndTime(startDate, endTime);

      await createCalendarEvent({
        userId,
        session,
        startDateTime,
        endDateTime,
      });

      alert("Event created with Google Meet integration!");

      setStartDate(new Date());
      setStartTime("12:00");
      setEndTime("13:00");
      navigate("/meetings");

      navigate("/meetings");
    } catch (error) {
      console.error("Full error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fffbeb] p-4">
      <style>{calendarStyles}</style>
      <h1 className="text-2xl font-semibold mb-6 text-[#8b5e34]">
        Schedule a Meeting
      </h1>

      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md border border-[#e2d5c3]">
        {session ? (
          <>
            <div className="mb-4 flex justify-between items-center">
              <button
                onClick={handleLogout}
                className="text-[#d4a373] hover:text-[#c19a6b] font-medium"
              >
                Logout
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-[#8b5e34] font-medium mb-2">
                Start date
              </label>
              <Calendar
                onChange={setStartDate}
                value={startDate}
                className="mb-2"
              />
              <p className="text-[#a17c50] mt-2">
                Selected Date: {startDate.toDateString()}
              </p>

              <label
                htmlFor="startTime"
                className="block text-[#8b5e34] font-medium mt-4 mb-2"
              >
                Start time
              </label>
              <input
                type="time"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border border-[#e2d5c3] rounded-md px-3 py-2 focus:outline-none focus:border-[#d4a373] bg-[#fffdf7]"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="endTime"
                className="block text-[#8b5e34] font-medium mt-4 mb-2"
              >
                End time
              </label>
              <input
                type="time"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border border-[#e2d5c3] rounded-md px-3 py-2 focus:outline-none focus:border-[#d4a373] bg-[#fffdf7]"
              />
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="mb-4 text-[#8b5e34]">
              Connect your Google Calendar to schedule meetings
            </p>
          </div>
        )}
      </div>

      <button
        onClick={session ? handleCreateCalendarEvent : handleGoogleSignIn}
        disabled={session && (isLoading || !userId)}
        className="mt-6 px-6 py-2 bg-[#d4a373] text-white font-medium rounded-md hover:bg-[#c19a6b] focus:outline-none disabled:opacity-50 transition-colors"
      >
        {session
          ? isLoading
            ? "Creating..."
            : "Create Calendar Event"
          : "Connect Google Calendar"}
      </button>
    </div>
  );
};

export default Meeting;
