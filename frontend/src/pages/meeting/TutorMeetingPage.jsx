import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API_ROUTES } from "../../constant/APIRoutes";
import { RefreshIcon, ScheduleIcon } from "../../assets/icon";
import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import MeetingList from "../../components/meeting/MeetingList";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const TutorMeetingPage = () => {
  const { tutorId, studentId } = useParams();
  const isStudentView = studentId && studentId !== tutorId; // ➜ true when student is viewing
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API_ROUTES.GET_TUTOR_MEETINGS(tutorId), {
        withCredentials: true,
      });
      const list = Array.isArray(data) ? data : data?.results ?? [];
      setMeetings(list);
    } catch {
      toast.error("Failed to load meetings");
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    fetchMeetings();
  }, [tutorId]);

  return (
    <PageContainer>
      <PageHeader
        title="Tutor's Meetings"
        subtitle="Live availability for this tutor"
      />

      <div className="mb-8 flex flex-wrap gap-3 justify-center">
        {!isStudentView && (
          <Link
            to="/meetings/create"
            className="rounded-lg bg-[#E9967A] px-5 py-2.5 font-medium text-white transition-colors hover:bg-[#e07a5f] shadow-sm flex items-center"
          >
            {ScheduleIcon}
            Schedule New Meeting
          </Link>
        )}
        <Button variant="secondary" onClick={fetchMeetings}>
          {RefreshIcon}
          Refresh List
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-60 items-center justify-center">
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <div className="rounded-xl border border-[#FFE082] bg-white p-6 shadow-md">
          <MeetingList meetings={meetings} isStudentView={isStudentView} />
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
    </PageContainer>
  );
};

export default TutorMeetingPage;
