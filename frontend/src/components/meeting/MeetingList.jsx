import { Link } from "react-router-dom";
import { NoMeetingIcon } from "../../assets/icon";

const MeetingList = ({ meetings, isStudentView }) => {
  const actionLabel = isStudentView ? "Book" : "Edit";
  const actionStyles = isStudentView
    ? "bg-[#FFD54F] text-[#8b5e34] hover:bg-[#FFCA28]"
    : "bg-[#E9967A] text-white hover:bg-[#e07a5f]";

  const fmt = (dt) =>
    new Date(dt).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (meetings.filter((m) => m.status === "scheduled").length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="w-16 h-16 bg-[#FFF8E1] rounded-full flex items-center justify-center mx-auto mb-4">
          {NoMeetingIcon}
        </div>
        <h3 className="text-xl font-medium text-[#8b5e34]">
          No scheduled meetings
        </h3>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#FFE082]">
            {["Start Time", "End Time", "Organizer", "Action"].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left font-medium text-[#8b5e34]"
              >
                {h}
              </th>
            ))}
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
                <td className="px-4 py-3 text-[#8b5e34]">{fmt(m.end_time)}</td>
                <td className="px-4 py-3 text-[#8b5e34]">{m.organizer_name}</td>
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
  );
};

export default MeetingList;
