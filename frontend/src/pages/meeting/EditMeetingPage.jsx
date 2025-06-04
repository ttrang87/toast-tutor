import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { CalendarIcon, GoogleCalendarIcon } from "../../assets/icon";
import { API_ROUTES } from "../../constant/APIRoutes";
import { googleSignIn } from "../../components/meeting/Google";
import { CalendarStyle } from "../../components/meeting/Calendar";
import CalendarEditForm from "../../components/meeting/CalendarEdit";

const EditMeetingPage = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const session = useSession();
  const supabase = useSupabaseClient();

  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
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

  const connectGoogle = () => {
    googleSignIn(supabase, `/meetings/${meetingId}/edit`);
    toast.success("Redirecting to connect Google Calendar.");
  };

  const loggedIn = Boolean(session);

  return (
    <div className="min-h-screen bg-[#FFFDE7] py-16 px-5">
      {/* <Toaster position="top-right" reverseOrder={false} /> */}
      <CalendarStyle />
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#8b5e34]">Edit Meeting</h1>
          <p className="mt-3 text-xl text-[#b78846]">
            Adjust date / time or delete the slot
          </p>
        </header>

        <section className="bg-white rounded-3xl border-2 border-[#FFE082] shadow-xl overflow-hidden">
          <div className="p-10 space-y-10">
            {loggedIn ? (
              <CalendarEditForm />
            ) : (
              <div className="p-12 text-center space-y-8">
                <div className="w-28 h-28 bg-[#FFF8E1] rounded-full grid place-items-center mx-auto">
                  {CalendarIcon}
                </div>
                <h2 className="text-2xl font-semibold text-[#8b5e34]">
                  Connect Your Calendar
                </h2>
                <p className="text-lg text-[#b78846]">
                  Connect Google Calendar to schedule meetings with integrated
                  Google Meet
                </p>
                <button
                  onClick={connectGoogle}
                  className="inline-flex items-center gap-3 px-10 py-4 text-xl font-medium text-white bg-[#FF8A65] rounded-xl shadow-lg hover:bg-[#ff7043]"
                >
                  {GoogleCalendarIcon}
                  Connect Google Calendar
                </button>
              </div>
            )}
          </div>
        </section>

        <footer className="mt-10 text-center">
          <button
            onClick={() => navigate(`/meetings/tutor/${meeting?.organizer}`)}
            className="inline-flex items-center gap-2 text-lg text-[#FF8A65] hover:text-[#ff7043]"
          >
            ← Back to Tutor Meetings
          </button>
        </footer>
      </div>
    </div>
  );
};

export default EditMeetingPage;
