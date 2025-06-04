import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Calendar from "react-calendar";
import axios from "axios";
import { toast } from "react-hot-toast";
import { confirmToast } from "../../assets/icon";
import { combineDateAndTime } from "../../components/meeting/MeetingUtils";
import { CalendarCheck, CalendarIcon, Clock, LogOut } from "../../assets/icon";
import { API_ROUTES } from "../../constant/APIRoutes";
import { googleLogout } from "../../components/meeting/Google";
import { updateGoogleEvent } from "../../components/meeting/MeetingUtils";

const CalendarEditForm = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const session = useSession();
  const supabase = useSupabaseClient();

  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [meeting, setMeeting] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(API_ROUTES.VIEW_MEETING(meetingId));
        setMeeting(data);
        const s = new Date(data.start_time);
        const e = new Date(data.end_time);
        setStartDate(s);
        setStartTime(
          s.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        );
        setEndTime(
          e.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        );
      } catch {
        toast.error("Unable to load meeting.");
        navigate(-1);
      }
    };
    load();
  }, [meetingId, navigate]);

  const logoutGoogle = async () => {
    await googleLogout(supabase);
  };

  const save = async () => {
    if (!meeting) return;
    if (!meeting.google_event_id) {
      toast.error("Google event ID is missing — cannot sync calendar.");
      return;
    }
    setLoading(true);
    try {
      const startISO = combineDateAndTime(startDate, startTime).toISOString();
      const endISO = combineDateAndTime(startDate, endTime).toISOString();
      await axios.patch(
        API_ROUTES.UPDATE_MEETING(meetingId),
        { start_time: startISO, end_time: endISO },
        { withCredentials: true }
      );
      await updateGoogleEvent({
        google_event_id: meeting.google_event_id,
        session,
        startISO,
        endISO,
      });
      toast.success("Meeting updated successfully.");
      navigate(`/meetings/tutor/${meeting.organizer}`);
    } catch {
      toast.error("Failed to update meeting.");
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    try {
      await axios.delete(API_ROUTES.DELETE_MEETING(meetingId));
      toast.success("Meeting deleted.");
      navigate(`/meetings/tutor/${meeting.organizer}`, { replace: true });
    } catch {
      toast.error("Failed to delete meeting.");
    }
  };

  const confirmRemove = () => {
    confirmToast("Delete this meeting?", remove);
  };

  return (
    <>
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
            <input
              type="time"
              value={val}
              onChange={(e) => set(e.target.value)}
              className="w-full px-6 py-5 text-lg border-2 border-[#FFE082] bg-[#FFFAEB] rounded-xl focus:ring-2 focus:ring-[#FFC46B] outline-none"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button
          onClick={save}
          disabled={isLoading}
          className="flex-1 px-8 py-5 text-lg font-semibold text-white bg-[#FF8A65] rounded-xl hover:bg-[#ff7043] shadow-lg disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <span className="h-6 w-6 rounded-full border-4 border-white border-t-transparent animate-spin" />
              Saving…
            </>
          ) : (
            <>Save Changes</>
          )}
        </button>

        <button
          onClick={confirmRemove}
          className="flex-1 px-8 py-5 text-lg font-semibold text-white bg-[#E57373] rounded-xl hover:bg-[#e53935] shadow-lg"
        >
          Delete Meeting
        </button>
      </div>
    </>
  );
};

export default CalendarEditForm;
