import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { API_ROUTES } from "../../constant/APIRoutes";
import { RefreshIcon, NoMeetingIcon, ScheduleIcon } from "../../assets/icon";

const TutorMeetingPage = () => {
  const { tutorId, studentId } = useParams();
  const isStudentView = studentId && studentId !== tutorId;
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API_ROUTES.GET_TUTOR_MEETINGS(tutorId), {
        withCredentials: true,
      });
      const list = Array.isArray(data) ? data : data?.results ?? [];
      setMeetings(list);
    } catch (err) {
      toast.error("Failed to load meetings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [tutorId]);

  const fmt = (dt) =>
    new Date(dt).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const actionLabel = isStudentView ? "Book" : "Edit";
  const actionStyles = isStudentView
    ? "bg-[#FFD54F] text-[#8b5e34] hover:bg-[#FFCA28]"
    : "bg-[#E9967A] text-white hover:bg-[#e07a5f]";

  return (
    <div className="min-h-screen bg-[#FFFDE7] py-12 px-4">
      {/* <Toaster position="top-right" reverseOrder={false} /> */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-[#8b5e34]">
            Tutor’s Meetings
          </h1>
          <p className="text-[#b78846]">Live availability for this tutor</p>
        </div>

        <div className="mb-8 flex flex-wrap gap-3 justify-center">
          <Link
            to="/meetings/create"
            className="rounded-lg bg-[#E9967A] px-5 py-2.5 font-medium text-white transition-colors hover:bg-[#e07a5f] shadow-sm flex items-center"
          >
            {ScheduleIcon}
            Schedule New Meeting
          </Link>
          <button
            onClick={fetchMeetings}
            className="rounded-lg bg-[#FFD54F] px-5 py-2.5 font-medium text-[#8b5e34] transition-colors hover:bg-[#FFCA28] shadow-sm flex items-center"
          >
            {RefreshIcon}
            Refresh List
          </button>
        </div>

        {isLoading ? (
          <div className="flex h-60 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#FFE082] border-t-[#E9967A]" />
          </div>
        ) : (
          <div className="rounded-xl border border-[#FFE082] bg-white p-6 shadow-md">
            {meetings.filter((m) => m.status === "scheduled").length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-[#FFF8E1] rounded-full flex items-center justify-center mx-auto mb-4">
                  {NoMeetingIcon}
                </div>
                <h3 className="text-xl font-medium text-[#8b5e34]">
                  No scheduled meetings
                </h3>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#FFE082]">
                      {["Start Time", "End Time", "Organizer", "Action"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-left font-medium text-[#8b5e34]"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {meetings
                      .filter((m) => m.status === "scheduled")
                      .map((m) => (
                        <tr
                          key={m.id}
                          className="border-b border-[#FFE082] hover:bg-[#FFF8E1] transition-colors"
                        >
                          <td className="px-4 py-3 text-[#8b5e34]">
                            {fmt(m.start_time)}
                          </td>
                          <td className="px-4 py-3 text-[#8b5e34]">
                            {fmt(m.end_time)}
                          </td>
                          <td className="px-4 py-3 text-[#8b5e34]">
                            {m.organizer_name}
                          </td>
                          <td className="px-4 py-3">
                            <Link
                              to={
                                isStudentView
                                  ? `/meetings/${m.id}/book`
                                  : `/meetings/${m.id}/edit`
                              }
                              className={`inline-block rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${actionStyles}`}
                            >
                              {actionLabel}
                            </Link>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {isStudentView && (
          <div className="mt-10 flex justify-center">
            <Link
              to={`/matched_tutors/${studentId}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-[#d4a373] hover:text-[#b78846] hover:underline"
            >
              ← Back to Matched Tutors
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorMeetingPage;
