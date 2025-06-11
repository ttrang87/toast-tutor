import { CalendarIcon, GoogleCalendarIcon } from "../../assets/icon";
import Button from "../ui/Button";

const GoogleCalendarConnect = ({ onConnect }) => {
  return (
    <div className="p-12 text-center space-y-8 flex flex-col items-center">
      <div className="w-28 h-28 bg-[#FFF8E1] rounded-full grid place-items-center mx-auto">
        {CalendarIcon}
      </div>
      <h2 className="text-2xl font-semibold text-[#8b5e34]">
        Connect Your Calendar
      </h2>
      <p className="text-lg text-[#b78846] max-w-md">
        Connect Google Calendar to schedule meetings with integrated Google Meet
      </p>
      <Button
        variant="primary"
        size="xl"
        onClick={onConnect}
        className="bg-[#FF8A65] hover:bg-[#ff7043] mx-auto"
      >
        {GoogleCalendarIcon}
        Connect Google Calendar
      </Button>
    </div>
  );
};

export default GoogleCalendarConnect;
