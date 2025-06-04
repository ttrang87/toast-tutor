import { useState, useEffect } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import { toast } from "react-hot-toast";
import { googleLogout } from "./Google";
import {
  createCalendarEvent,
  combineDateAndTime,
} from "../../components/meeting/MeetingUtils";
import { CalendarCheck, CalendarIcon, LogOut, Clock } from "../../assets/icon";

export const CalendarStyle = () => {
  return (
    <style>{`
            .react-calendar { width:100%; border:none; font-family:inherit; }
            .react-calendar__navigation { display:flex; justify-content:center; gap:1rem; margin-bottom:.75rem; }
            .react-calendar__navigation__label { font-size:1.25rem; font-weight:600; color:#8b5e34; }
            .react-calendar__navigation button { font-size:1.6rem; color:#8b5e34; padding:0 .25rem; }
            .react-calendar__month-view__weekdays { text-transform:uppercase; font-weight:600; color:#8b5e34; }
            .react-calendar__month-view__weekdays__weekday { padding:.6rem 0; padding-left:2.5rem;}
            .react-calendar__month-view__weekdays__weekday abbr { text-decoration:none; }
            .react-calendar__tile { padding:.8rem 0; border-radius:.5rem; font-weight:500; }
            .react-calendar__tile--now:not(.react-calendar__tile--active) { background:#FFE0824D; color:#8b5e34; }
            .react-calendar__tile--active,
            .react-calendar__tile--active:hover,
            .react-calendar__tile--active:focus { background:#FF8A65!important; color:#fff!important; }
            .react-calendar__month-view__days__day--weekend:not(.react-calendar__tile--active) { color:#FF8A00; }
            .react-calendar__month-view__days__day:not(.react-calendar__month-view__days__day--weekend):not(.react-calendar__tile--active) { color:#4c3b28; }
          `}</style>
  );
};

export const CalendarForm = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState("12:00");
  const [endTime, setEndTime] = useState("13:00");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, []);

  const logoutGoogle = async () => {
    await googleLogout(supabase);
    localStorage.removeItem("userId");
    setUserId(null);
  };

  const createEvent = async () => {
    setIsLoading(true);
    try {
      await createCalendarEvent({
        userId,
        session,
        startDateTime: combineDateAndTime(startDate, startTime),
        endDateTime: combineDateAndTime(startDate, endTime),
      });
      toast.success("Meeting created and added to Google Calendar."); // ✅ added toast
      navigate("/");
      setStartDate(new Date());
      setStartTime("12:00");
      setEndTime("13:00");
    } catch (err) {
      toast.error("Failed to create meeting.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="p-10 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b-2 border-[#FFE082]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#FFF8E1] rounded-full grid place-items-center">
            {CalendarCheck}
          </div>
          <span className="text-xl font-medium text-[#8b5e34]">
            Google Calendar Connected
          </span>
        </div>

        <button
          onClick={logoutGoogle}
          className="inline-flex items-center gap-2 text-[#FF8A65] hover:text-[#ff7043] text-lg"
        >
          {LogOut} Disconnect
        </button>
      </div>

      <div className="space-y-4">
        <label className="flex items-center gap-2 text-xl font-medium text-[#8b5e34]">
          {CalendarIcon} Select Date
        </label>

        <div className="rounded-xl border-2 border-[#FFE082] p-4 bg-[#FFFBEC]">
          <Calendar
            value={startDate}
            onChange={setStartDate}
            locale="en-US"
            prev2Label={null}
            next2Label={null}
            prevLabel="‹"
            nextLabel="›"
            formatShortWeekday={(_, d) =>
              d.toLocaleDateString("en-US", { weekday: "short" })
            }
          />
        </div>
      </div>

      {/* time range */}
      <div className="grid gap-8 sm:grid-cols-2">
        {[
          {
            id: "start",
            label: "Start Time",
            val: startTime,
            set: setStartTime,
          },
          {
            id: "end",
            label: "End Time",
            val: endTime,
            set: setEndTime,
          },
        ].map(({ id, label, val, set }) => (
          <div key={id} className="space-y-3">
            <label className="flex items-center gap-2 text-xl font-medium text-[#8b5e34]">
              {Clock} {label}
            </label>
            <div className="relative">
              <input
                type="time"
                value={val}
                onChange={(e) => set(e.target.value)}
                className="peer w-full px-6 pr-12 py-5 text-lg border-2 border-[#FFE082] bg-[#FFFAEB] rounded-xl focus:ring-2 focus:ring-[#FFC46B] outline-none"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 flex justify-center">
        <button
          onClick={createEvent}
          disabled={isLoading || !userId}
          className="w-full sm:w-auto sm:px-12 px-8 py-5 text-xl font-semibold text-white bg-[#FF8A65] rounded-xl hover:bg-[#ff7043] shadow-lg disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <span className="h-6 w-6 rounded-full border-4 border-white border-t-transparent animate-spin" />
              Creating…
            </>
          ) : (
            <>{CalendarCheck} Create Calendar Event</>
          )}
        </button>
      </div>
    </div>
  );
};

export const CalendarFooter = () => {
  const navigate = useNavigate();
  return (
    <div>
      <footer className="mt-10 text-center">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-lg text-[#FF8A65] hover:text-[#ff7043]"
        >
          ← Back to Home
        </button>
      </footer>
    </div>
  );
};
