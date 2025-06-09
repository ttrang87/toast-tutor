import { useEffect, useState, useRef, useCallback } from "react";
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
  const [isNavigatingToPayment, setIsNavigatingToPayment] = useState(false);
  const timerRef = useRef(null);
  const studentId = Number(localStorage.getItem("userId") || "0") || null;

  // Wrap fetchMeeting in useCallback to make it stable for useEffect dependencies
  const fetchMeeting = useCallback(async () => {
    if (!meetingId) return;
    
    const { data } = await axios.get(API_ROUTES.VIEW_MEETING(meetingId));
    setMeeting(data);
    if (data.status === "pending" && data.payment_expires_at) {
      const expiry = new Date(data.payment_expires_at).getTime();
      const secsLeft = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
      setCountdown(secsLeft);
    }
  }, [meetingId]);

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
  }, [meetingId, fetchMeeting]);

  useEffect(() => {
    if (countdown <= 0) return;
    timerRef.current = setInterval(() => {
      setCountdown((s) => s - 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0 && meeting?.status === "pending" && !isNavigatingToPayment) {
      (async () => {
        await axios.post(API_ROUTES.CANCEL_PAYMENT(meetingId));
        toast("Payment window expired. Slot released.", { icon: "⏲️" });
        localStorage.removeItem('paymentTimer'); // Clean up
        await fetchMeeting();
      })();
    }
  }, [countdown, isNavigatingToPayment, meeting?.status, meetingId, fetchMeeting]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Don't prevent navigation if going to payment page
      if (meeting?.status === "pending" && !isNavigatingToPayment) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [meeting, isNavigatingToPayment]);

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

    localStorage.setItem("MeetingTiming",JSON.stringify(meeting))

    const secsLeft = 300;
    setCountdown(secsLeft);
    toast("Slot reserved — complete payment within 5 min.", { icon: "💳" });
  }

  async function handlePayNow() {
    setIsNavigatingToPayment(true);
    
    // Store timer data with more precise timing
    localStorage.setItem('paymentTimer', JSON.stringify({
      meetingId: meetingId,
      expiresAt: Date.now() + (countdown * 1000),
      originalExpiry: meeting.payment_expires_at
    }));
    
    // Clear the current timer
    clearInterval(timerRef.current);
    
    navigate(`/payment/${meetingId}`);
  }

  async function handleCancel() {
    await axios.post(API_ROUTES.CANCEL_PAYMENT(meetingId));
    clearInterval(timerRef.current);
    localStorage.removeItem('paymentTimer'); // Clean up
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