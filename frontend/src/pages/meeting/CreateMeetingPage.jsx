import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";
import CalendarStyle from "../../components/calendar/CalendarStyle";
import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import BackButton from "../../components/layout/BackButton";
import GoogleCalendarConnect from "../../components/calendar/GoogleCalendarConnect";
import MeetingForm from "../../components/meeting/MeetingForm";
import { googleSignIn, googleLogout } from "../../components/meeting/Google";
import {
  combineDateAndTime,
  createCalendarEvent,
} from "../../components/meeting/MeetingUtils";

const CreateMeetingPage = () => {
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

  const handleConnect = async () => {
    try {
      await googleSignIn(supabase, "/meetings/create");
      toast.success("Redirecting to Google Calendar…");
    } catch {
      toast.error("Failed to connect to Google Calendar");
    }
  };

  const handleLogout = async () => {
    await googleLogout(supabase);
    localStorage.removeItem("userId");
    setUserId(null);
  };

  const handleSave = async () => {
    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }
    if (!session?.provider_token) {
      toast.error("Google Calendar session expired. Please reconnect.");
      return;
    }

    setIsLoading(true);
    try {
      await createCalendarEvent({
        userId,
        session,
        startDateTime: combineDateAndTime(startDate, startTime),
        endDateTime: combineDateAndTime(startDate, endTime),
      });

      toast.success("Meeting created and added to Google Calendar.");
      navigate(`/meetings/tutor/${userId}`);
      setStartDate(new Date());
      setStartTime("12:00");
      setEndTime("13:00");
    } catch (err) {
      console.error("Create meeting error:", err);
      toast.error("Failed to create meeting. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <CalendarStyle />
      <PageHeader
        title="Schedule a Meeting"
        subtitle="Create a new meeting and connect with your students"
      />

      <section className="bg-white rounded-3xl border-2 border-[#FFE082] shadow-xl overflow-hidden">
        {session ? (
          <MeetingForm
            startDate={startDate}
            setStartDate={setStartDate}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            onSave={handleSave}
            onLogout={handleLogout}
            isLoading={isLoading}
            isEdit={false}
          />
        ) : (
          <GoogleCalendarConnect onConnect={handleConnect} />
        )}
      </section>

      <footer className="mt-10 text-center">
        <BackButton to="/" label="Back to Home" />
      </footer>
    </PageContainer>
  );
};

export default CreateMeetingPage;
