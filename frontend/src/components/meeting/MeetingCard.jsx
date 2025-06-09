import { Link } from "react-router-dom";
import { CalendarCheck, Clock } from "../../assets/icon";

const MeetingCard = ({
  meeting,
  showMeetLink = false,
  currentUserId = null,
}) => {
  const formattedStart = new Date(meeting.start_time).toLocaleString();
  const formattedEnd = new Date(meeting.end_time).toLocaleString();

  // Show meet link only if meeting is booked and user is organizer or student
  const canShowMeetLink =
    showMeetLink &&
    meeting.status === "booked" &&
    meeting.google_meet_link &&
    currentUserId &&
    (meeting.organizer_id === Number.parseInt(currentUserId) ||
      meeting.student === Number.parseInt(currentUserId));

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex items-center gap-3 text-[#8b5e34]">
        <div className="w-12 h-12 bg-[#FFF8E1] rounded-full flex items-center justify-center">
          {CalendarCheck}
        </div>
        <h1 className="text-2xl font-bold">{meeting.title || "Meeting"}</h1>
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

      {/* Google Meet Link - Only shown when meeting is booked and user is participant */}
      {canShowMeetLink && (
        <div className="bg-green-50 rounded-xl p-5 border border-green-200">
          <div className="flex items-center gap-2 text-green-800">
            <span className="font-semibold">Google Meet:</span>
            <a
              href={meeting.google_meet_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-800 hover:underline"
            >
              Join Meeting
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingCard;
