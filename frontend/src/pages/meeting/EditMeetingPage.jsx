import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { confirmToast } from "../../assets/icon";
import { API_ROUTES } from "../../constant/APIRoutes";
import { googleSignIn, googleLogout } from "../../components/meeting/Google";
import CalendarStyle from "../../components/calendar/CalendarStyle";
import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import BackButton from "../../components/layout/BackButton";
import GoogleCalendarConnect from "../../components/calendar/GoogleCalendarConnect";
import MeetingForm from "../../components/meeting/MeetingForm";
import {
  combineDateAndTime,
  updateGoogleEvent,
} from "../../components/meeting/MeetingUtils";

const EditMeetingPage = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const session = useSession();
  const supabase = useSupabaseClient();

  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [meeting, setMeeting] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    toast.success("Redirecting to connect Google Calendar...");
  };

  const handleLogout = async () => {
    await googleLogout(supabase);
  };

  const handleSave = async () => {
    if (!meeting) return;

    setIsLoading(true);
    try {
      const startISO = combineDateAndTime(startDate, startTime).toISOString();
      const endISO = combineDateAndTime(startDate, endTime).toISOString();

      await axios.patch(
        API_ROUTES.UPDATE_MEETING(meetingId),
        { start_time: startISO, end_time: endISO },
        { withCredentials: true }
      );

      if (meeting.google_event_id && session?.provider_token) {
        await updateGoogleEvent({
          google_event_id: meeting.google_event_id,
          session,
          startISO,
          endISO,
        });
        toast.success("Meeting and Google Calendar updated successfully.");
      } else {
        toast.success("Meeting updated successfully.");
      }

      navigate(`/meetings/tutor/${meeting.organizer_id ?? meeting.organizer}`);
    } catch (error) {
      toast.error("Failed to update meeting. Please try again.");
      console.error("Update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (meeting?.google_event_id && session?.provider_token) {
        try {
          await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events/${meeting.google_event_id}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${session.provider_token}` },
            }
          );
        } catch (googleError) {
          console.warn("Failed to delete Google Calendar event:", googleError);
        }
      }

      await axios.delete(API_ROUTES.DELETE_MEETING(meetingId));
      toast.success("Meeting deleted.");
      navigate(`/meetings/tutor/${meeting.organizer}`, { replace: true });
    } catch {
      toast.error("Failed to delete meeting.");
    }
  };

  const confirmDelete = () =>
    confirmToast("Delete this meeting?", handleDelete);

  const loggedIn = Boolean(session);

  return (
    <PageContainer>
      <CalendarStyle />
      <PageHeader
        title="Edit Meeting"
        subtitle="Adjust date / time or delete the slot"
      />

      <section className="bg-white rounded-3xl border-2 border-[#FFE082] shadow-xl overflow-hidden">
        <div className="p-10 space-y-10">
          {loggedIn ? (
            <MeetingForm
              startDate={startDate}
              setStartDate={setStartDate}
              startTime={startTime}
              setStartTime={setStartTime}
              endTime={endTime}
              setEndTime={setEndTime}
              onSave={handleSave}
              onDelete={confirmDelete}
              onLogout={handleLogout}
              isLoading={isLoading}
              isEdit={true}
            />
          ) : (
            <GoogleCalendarConnect onConnect={connectGoogle} />
          )}
        </div>
      </section>

      <footer className="mt-10 text-center">
        <BackButton
          to={`/meetings/tutor/${meeting?.organizer}`}
          label="Back to Tutor Meetings"
        />
      </footer>
    </PageContainer>
  );
};

export default EditMeetingPage;
