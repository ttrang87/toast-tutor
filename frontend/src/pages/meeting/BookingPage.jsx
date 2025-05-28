import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_ROUTES } from "../../constant/APIRoutes";
import { CalendarCheck, Clock } from "../../assets/icon"; // Adjust icons as needed

const BookingMeetingPage = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const studentId = Number(localStorage.getItem("userId") || "0") || null;

  useEffect(() => {
    const fetchMeetingData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(API_ROUTES.VIEW_MEETING(meetingId));
        setMeeting(data);
      } catch (err) {
        console.error("Failed to fetch meeting:", err);
      } finally {
        setLoading(false);
      }
    };

    if (meetingId) fetchMeetingData();
    else setLoading(false);
  }, [meetingId]);

  async function handleBook() {
    if (studentId === meeting.organizer_id) {
      alert("You are the organizer — you can't book your own meeting.");
      return;
    }

    try {
      await axios.post(API_ROUTES.BOOK_MEETING(meetingId), {
        student: studentId,
      });
      alert("Booked successfully!");
      navigate("/meetings", { replace: true });
    } catch (err) {
      console.error("Failed to book meeting:", err);
    }
  }

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

  return (
    <div className="min-h-screen bg-[#FFFDE7] py-12 px-5">
      <div className="max-w-2xl mx-auto bg-white border-2 border-[#FFE082] rounded-3xl shadow-xl p-8 space-y-8">
        {/* Title */}
        <div className="flex items-center gap-3 text-[#8b5e34]">
          <div className="w-12 h-12 bg-[#FFF8E1] rounded-full flex items-center justify-center">
            {CalendarCheck}
          </div>
          <h1 className="text-2xl font-bold">{meeting.title}</h1>
        </div>

        {/* Organizer Info */}
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

        {/* Action */}
        {meeting.status === "scheduled" ? (
          <button
            onClick={handleBook}
            className="w-full px-8 py-4 text-lg font-semibold text-white bg-[#E9967A] rounded-xl hover:bg-[#e07a5f] transition shadow-lg focus:outline-none focus:ring-2 focus:ring-[#e07a5f] focus:ring-opacity-50"
          >
            Book this slot
          </button>
        ) : (
          <div className="text-center py-4 px-6 bg-[#FFF8E1] text-[#8b5e34] rounded-xl border border-[#FFE082] font-medium">
            This meeting is already{" "}
            <span className="font-bold">{meeting.status}</span>.
          </div>
        )}

        {/* Back Navigation */}
        <div className="text-center">
          <Link
            to="/meetings"
            className="text-sm text-[#d4a373] hover:text-[#b78846] hover:underline"
          >
            ← Back to Meetings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingMeetingPage;
