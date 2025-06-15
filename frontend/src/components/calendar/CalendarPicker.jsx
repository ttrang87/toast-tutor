import Calendar from "react-calendar";
import { CalendarIcon } from "../../assets/icon";

const CalendarPicker = ({ value, onChange }) => {
  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-xl font-medium text-[#8b5e34]">
        {CalendarIcon} Select Date
      </label>
      <div className="rounded-xl border-2 border-[#FFE082] p-4 bg-[#FFFBEC]">
        <Calendar
          value={value}
          onChange={onChange}
          locale="en-US"
          prev2Label={null}
          next2Label={null}
          prevLabel="‹"
          nextLabel="›"
          formatShortWeekday={(_, d) =>
            d.toLocaleDateString("en-US", { weekday: "short" })
          }
        />
      </div>
    </div>
  );
};

export default CalendarPicker;
