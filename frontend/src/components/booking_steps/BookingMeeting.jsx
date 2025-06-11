import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_ROUTES } from "../../constant/APIRoutes";

const BookingMeeting = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);

  const studentId = Number(localStorage.getItem("userId") || "0") || null;

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(API_ROUTES.VIEW_MEETING(meetingId));
      setMeeting(data);
      setLoading(false);
    })();
  }, [meetingId]);

  async function handleBook() {
    if (!studentId) {
      alert("You must be logged in to book.");
      return;
    }

    if (studentId === meeting.organizer_id) {
      alert("You are the organizer — you can’t book your own meeting.");
      return;
    }

    await axios.post(API_ROUTES.BOOK_MEETING(meetingId), {
      student: studentId,
    });
    alert("Booked successfully!");
    navigate("/meetings", { replace: true });
  }

  if (loading) return <p className="p-8">Loading…</p>;
  if (!meeting) return <p className="p-8 text-red-600">Meeting not found</p>;


  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-[#8b5e34]">
        {meeting.title}
      </h2>

      <div className="border rounded-lg p-4 mb-6 bg-[#fffdf7]">
        <p className="text-sm text-gray-600 mb-1">Organizer</p>
        <Link
          to={`/tutor/profile/${meeting.organizer_id}`}
          className="font-medium text-[#d4a373] hover:underline"
        >
          {meeting.organizer_name}
        </Link>
      </div>

      <p className="mb-2 text-sm text-gray-700">
        {new Date(meeting.start_time).toLocaleString()} &rarr;{" "}
        {new Date(meeting.end_time).toLocaleString()}
      </p>

      {meeting.status === "scheduled" ? (
        <button
          onClick={handleBook}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Book this slot
        </button>
      ) : (
        <span className="px-3 py-1 bg-gray-200 rounded-full">
          Already {meeting.status}
        </span>
      )}

      <div className="mt-6">
        <Link
          to="/meetings"
          className="text-sm text-gray-500 hover:underline inline-block"
        >
          &larr;&nbsp;Back to list
        </Link>
      </div>
    </div>
  );
};

export default BookingMeeting;
