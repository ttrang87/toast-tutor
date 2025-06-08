import { Clock } from "../../assets/icon";

const TimeRangePicker = ({
  startTime,
  endTime,
  onStartChange,
  onEndChange,
}) => {
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-xl font-medium text-[#8b5e34]">
          {Clock} Start Time
        </label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => onStartChange(e.target.value)}
          className="w-full px-6 py-5 text-lg border-2 border-[#FFE082] bg-[#FFFAEB] rounded-xl focus:ring-2 focus:ring-[#FFC46B] outline-none"
        />
      </div>
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-xl font-medium text-[#8b5e34]">
          {Clock} End Time
        </label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => onEndChange(e.target.value)}
          className="w-full px-6 py-5 text-lg border-2 border-[#FFE082] bg-[#FFFAEB] rounded-xl focus:ring-2 focus:ring-[#FFC46B] outline-none"
        />
      </div>
    </div>
  );
};

export default TimeRangePicker;
