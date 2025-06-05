import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ROUTES } from "../../constant/APIRoutes";
import { toast } from "react-hot-toast";
import PageContainer from "../../components/layout/PageContainer";
import MeetingCard from "../../components/meeting/MeetingCard";
import MeetingActions from "../../components/meeting/MeetingActions";
import CountdownTimer from "../../components/meeting/CountdownTimer";
import CalendarFooter from "../../components/meeting/CalendarFooter";

const BookingMeetingPage = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef(null);
  const studentId = Number(localStorage.getItem("userId") || "0") || null;

  const fetchMeeting = async () => {
    const { data } = await axios.get(API_ROUTES.VIEW_MEETING(meetingId));
    setMeeting(data);
    if (data.status === "pending" && data.payment_expires_at) {
      const expiry = new Date(data.payment_expires_at).getTime();
      const secsLeft = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
      setCountdown(secsLeft);
    }
  };

  useEffect(() => {
    if (!meetingId) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        await fetchMeeting();
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [meetingId]);

  useEffect(() => {
    if (countdown <= 0) return;
    timerRef.current = setInterval(() => {
      setCountdown((s) => s - 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0 && meeting?.status === "pending") {
      (async () => {
        await axios.post(API_ROUTES.CANCEL_PAYMENT(meetingId));
        toast("Payment window expired. Slot released.", { icon: "⏲️" });
        await fetchMeeting();
      })();
    }
  }, [countdown]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (meeting?.status === "pending") {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [meeting]);

  async function handleBook() {
    if (studentId === meeting.organizer_id) {
      toast("You are the organizer — you can't book your own meeting.", {
        icon: "⚠️",
      });
      return;
    }
    const { data } = await axios.post(API_ROUTES.BOOK_MEETING(meetingId), {
      student: studentId,
    });
    setMeeting(data);
    const secsLeft = 300;
    setCountdown(secsLeft);
    toast("Slot reserved — complete payment within 5 min.", { icon: "💳" });
  }

  async function handlePayNow() {
    const { data } = await axios.post(API_ROUTES.CONFIRM_PAYMENT(meetingId));
    setMeeting(data);
    clearInterval(timerRef.current);
    toast.success("Payment accepted. Meeting booked!");
    navigate("/", { replace: true });
  }

  async function handleCancel() {
    await axios.post(API_ROUTES.CANCEL_PAYMENT(meetingId));
    clearInterval(timerRef.current);
    toast("Reservation canceled.", { icon: "🚫" });
    await fetchMeeting();
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FFFDE7]">
        <div className="text-4xl font-bold text-[#8b5e34] animate-pulse">
          Loading meeting details…
        </div>
      </div>
    );
  }

  return (
    <PageContainer className="py-12">
      <div className="max-w-2xl mx-auto bg-white border-2 border-[#FFE082] rounded-3xl shadow-xl p-8 space-y-8">
        {meeting.status === "pending" && <CountdownTimer seconds={countdown} />}
        <MeetingCard meeting={meeting} />
        <MeetingActions
          status={meeting.status}
          studentId={studentId}
          onBook={handleBook}
          onPayNow={handlePayNow}
          onCancel={handleCancel}
        />
        {meeting.status !== "pending" && (
          <CalendarFooter
            to={`/meetings/tutor/${meeting.organizer_id}/${studentId}`}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default BookingMeetingPage;
