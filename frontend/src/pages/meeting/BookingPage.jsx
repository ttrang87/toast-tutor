import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_ROUTES } from "../../constant/APIRoutes";
import { toast } from "react-hot-toast";
import { CalendarCheck, Clock } from "../../assets/icon";
import { CalendarFooter } from "../../components/meeting/Calendar";

export default function BookingMeetingPage() {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(0); // seconds
  const timerRef = useRef(null);
  const studentId = Number(localStorage.getItem("userId") || "0") || null;

  /* ------------------ helpers ------------------ */
  const fetchMeeting = async () => {
    const { data } = await axios.get(API_ROUTES.VIEW_MEETING(meetingId));
    setMeeting(data);
    if (data.status === "pending" && data.payment_expires_at) {
      const expiry = new Date(data.payment_expires_at).getTime();
      const secsLeft = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
      setCountdown(secsLeft);
    }
  };

  /* ------------------ initial load ------------------ */
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingId]);

  /* ------------------ countdown ticker ------------------ */
  useEffect(() => {
    if (countdown <= 0) return;
    timerRef.current = setInterval(() => {
      setCountdown((s) => s - 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [countdown]);

  /* when timer hits 0, auto-cancel */
  useEffect(() => {
    if (countdown === 0 && meeting?.status === "pending") {
      (async () => {
        await axios.post(API_ROUTES.CANCEL_PAYMENT(meetingId));
        toast("Payment window expired. Slot released.", { icon: "⏲️" });
        await fetchMeeting(); // refresh to scheduled
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  /* ------------------ actions ------------------ */
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
    const secsLeft = 300; // 5 min
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

  /* ------------------ render ------------------ */
  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#FFFDE7]">
        <div className="text-4xl font-bold text-[#8b5e34] animate-pulse">
          Loading meeting details…
        </div>
      </div>
    );

  const formattedStart = new Date(meeting.start_time).toLocaleString();
  const formattedEnd = new Date(meeting.end_time).toLocaleString();

  /* countdown label */
  const mm = String(Math.floor(countdown / 60)).padStart(2, "0");
  const ss = String(countdown % 60).padStart(2, "0");
  const countdownLabel = `${mm}:${ss}`;

  return (
    <div className="min-h-screen bg-[#FFFDE7] py-12 px-5">
      {/* <Toaster position="top-middle" /> */}
      <div className="max-w-2xl mx-auto bg-white border-2 border-[#FFE082] rounded-3xl shadow-xl p-8 space-y-8">
        {/* Countdown banner */}
        {meeting.status === "pending" && (
          <div className="text-center text-lg font-semibold text-red-600">
            Complete payment within&nbsp;
            <span className="font-mono">{countdownLabel}</span>
          </div>
        )}

        {/* Title */}
        <div className="flex items-center gap-3 text-[#8b5e34]">
          <div className="w-12 h-12 bg-[#FFF8E1] rounded-full flex items-center justify-center">
            {CalendarCheck}
          </div>
          <h1 className="text-2xl font-bold">{meeting.title}</h1>
        </div>

        {/* Organizer */}
        <div className="border-l-4 border-[#FFE082] pl-4 bg-[#FFFBEC] py-2">
          <p className="text-xs font-semibold text-[#B78846]">Organizer</p>
          <Link
            to={`/tutor/profile/${meeting.organizer_id}`}
            className="text-lg font-medium text-[#d4a373] hover:text-[#b78846] hover:underline"
          >
            {meeting.organizer_name}
          </Link>
        </div>

        {/* Time Info */}
        <div className="bg-[#FFF8E1] rounded-xl p-5 border border-[#FFE082] space-y-3">
          <div className="flex items-center gap-2 text-[#8b5e34]">
            {Clock}
            <span className="font-semibold">Start:</span> {formattedStart}
          </div>
          <div className="flex items-center gap-2 text-[#8b5e34]">
            {Clock}
            <span className="font-semibold">End:</span> {formattedEnd}
          </div>
        </div>

        {/* Actions */}
        {meeting.status === "scheduled" && (
          <button
            onClick={handleBook}
            className="w-full px-8 py-4 text-lg font-semibold text-white bg-[#E9967A] rounded-xl hover:bg-[#e07a5f] transition shadow-lg"
          >
            Book this slot
          </button>
        )}

        {meeting.status === "pending" && meeting.student === studentId && (
          <div className="flex flex-col gap-4">
            <button
              onClick={handlePayNow}
              className="w-full px-8 py-4 text-lg font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition shadow-lg"
            >
              Pay now (stub)
            </button>
            <button
              onClick={handleCancel}
              className="w-full px-8 py-3 text-lg font-semibold text-[#8b5e34] bg-[#FFF8E1] border border-[#FFE082] rounded-xl hover:bg-[#FFECB3] transition"
            >
              Cancel reservation
            </button>
          </div>
        )}

        {meeting.status === "booked" && (
          <div className="text-center py-4 px-6 bg-[#FFF8E1] text-[#8b5e34] rounded-xl border border-[#FFE082] font-medium">
            This meeting is <span className="font-bold">booked</span>.
          </div>
        )}

        <CalendarFooter />
      </div>
    </div>
  );
}
