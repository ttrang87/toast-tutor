import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { API_ROUTES } from "../../constant/APIRoutes";

const MeetingsList = () => {
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const fetchMeetings = async () => {
    try {
      setIsLoading(true);
      const MEETINGS_ENDPOINT = API_ROUTES.GET_MEETINGS;
      const response = await axios.get(MEETINGS_ENDPOINT, {
        withCredentials: true,
        // headers: {
        //   "X-CSRFToken": getCookie("csrftoken"),
        //   "Content-Type": "application/json",
        // },
      });

      if (Array.isArray(response.data)) {
        setMeetings(response.data);
      } else if (response.data && typeof response.data === "object") {
        setMeetings(
          Array.isArray(response.data.results) ? response.data.results : []
        );
      } else {
        setMeetings([]);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching meetings:", err);
      setError("Failed to load meetings. Please try again later.");
      setMeetings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [location]);

  // Format date and time for display
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Ensure meetings is definitely an array before rendering
  const renderMeetings = () => {
    return meetings
      .filter((m) => m.status === "scheduled")
      .map((meeting) => (
        <tr
          key={meeting.id}
          className="border-b border-[#e2d5c3] hover:bg-[#fffdf7]"
        >
          <td className="px-4 py-3 text-[#8b5e34]">
            {formatDateTime(meeting.start_time)}
          </td>
          <td className="px-4 py-3 text-[#8b5e34]">
            {formatDateTime(meeting.end_time)}
          </td>
          <td className="px-4 py-3 text-[#8b5e34]">{meeting.organizer_name}</td>
          <td className="px-4 py-3">
            <Link
              to={`/meetings/${meeting.id}`} // ← one clean URL
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              Book
            </Link>
          </td>
        </tr>
      ));
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#fffbeb] p-4">
      <h1 className="text-2xl font-semibold mb-6 text-[#8b5e34]">
        My Meetings
      </h1>

      <Link
        to="/meetings/create"
        className="mb-6 px-4 py-2 bg-[#d4a373] text-white font-medium rounded-md hover:bg-[#c19a6b] focus:outline-none transition-colors"
      >
        Schedule New Meeting
      </Link>

      {/* Refresh button */}
      <button
        onClick={fetchMeetings}
        className="mb-6 ml-2 px-4 py-2 bg-[#a17c50] text-white font-medium rounded-md hover:bg-[#8b5e34] focus:outline-none transition-colors"
      >
        Refresh List
      </button>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#d4a373]"></div>
        </div>
      ) : error ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      ) : meetings.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl border border-[#e2d5c3] text-center">
          <p className="text-[#8b5e34]">
            No meetings found. Schedule your first meeting!
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl border border-[#e2d5c3]">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-[#e2d5c3]">
                  <th className="px-4 py-3 text-left text-[#8b5e34] font-medium">
                    Start Time
                  </th>
                  <th className="px-4 py-3 text-left text-[#8b5e34] font-medium">
                    End Time
                  </th>
                  <th className="px-4 py-3 text-left text-[#8b5e34] font-medium">
                    Organizer
                  </th>
                  <th className="px-4 py-3 text-left text-[#8b5e34] font-medium">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>{renderMeetings()}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingsList;
