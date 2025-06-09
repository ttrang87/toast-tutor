import { CalendarCheck, LogOut } from "../../assets/icon";

const GoogleCalendarHeader = ({ onLogout }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b-2 border-[#FFE082]">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-[#FFF8E1] rounded-full grid place-items-center">
          {CalendarCheck}
        </div>
        <span className="text-xl font-medium text-[#8b5e34]">
          Google Calendar Connected
        </span>
      </div>
      <button
        onClick={onLogout}
        className="inline-flex items-center gap-2 text-[#FF8A65] hover:text-[#ff7043] text-lg"
      >
        {LogOut} Disconnect
      </button>
    </div>
  );
};

export default GoogleCalendarHeader;
