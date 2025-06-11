import GoogleCalendarHeader from "../calendar/GoogleCalendarHeader";
import CalendarPicker from "../calendar/CalendarPicker";
import TimeRangePicker from "../calendar/TimeRangePicker";
import Button from "../ui/Button";
import LoadingSpinner from "../ui/LoadingSpinner";
import { CalendarCheck } from "../../assets/icon";

const MeetingForm = ({
  startDate,
  setStartDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  onSave,
  onDelete,
  onLogout,
  isLoading,
  isEdit = false,
}) => {
  return (
    <div className="p-10 space-y-10">
      <GoogleCalendarHeader onLogout={onLogout} />

      <CalendarPicker value={startDate} onChange={setStartDate} />

      <TimeRangePicker
        startTime={startTime}
        endTime={endTime}
        onStartChange={setStartTime}
        onEndChange={setEndTime}
      />

      <div
        className={`${
          isEdit ? "flex flex-col sm:flex-row" : "flex justify-center"
        } gap-4 pt-6`}
      >
        <Button
          variant={isEdit ? "primary" : "primary"}
          size="xl"
          fullWidth={isEdit}
          onClick={onSave}
          disabled={isLoading}
          className={isEdit ? "" : "w-full sm:w-auto sm:px-12"}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="small" light />
              {isEdit ? "Saving…" : "Creating…"}
            </>
          ) : (
            <>
              {isEdit ? (
                "Save Changes"
              ) : (
                <>{CalendarCheck} Create Calendar Event</>
              )}
            </>
          )}
        </Button>

        {isEdit && (
          <Button
            variant="danger"
            size="xl"
            fullWidth
            onClick={onDelete}
            disabled={isLoading}
          >
            Delete Meeting
          </Button>
        )}
      </div>
    </div>
  );
};

export default MeetingForm;
