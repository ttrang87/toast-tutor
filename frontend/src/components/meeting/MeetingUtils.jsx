import axios from "axios";
import { API_ROUTES } from "../../constant/APIRoutes";
import { toast } from "react-hot-toast";

const combineDateAndTime = (date, timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};

const createCalendarEvent = async ({
  userId,
  session,
  startDateTime,
  endDateTime,
}) => {
  try {
    // First create the Google Calendar event
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const gRes = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.provider_token}`,
        },
        body: JSON.stringify({
          summary: "Tutoring Session",
          start: { dateTime: startDateTime.toISOString(), timeZone: tz },
          end: { dateTime: endDateTime.toISOString(), timeZone: tz },
          conferenceData: {
            createRequest: {
              requestId: `meeting-${Date.now()}`,
              conferenceSolutionKey: { type: "hangoutsMeet" },
            },
          },
        }),
      }
    );

    const gData = await gRes.json();
    if (gData.error) {
      toast.error(`Google API Error: ${gData.error.message}`);
      throw new Error(gData.error.message);
    }

    // Then create the meeting with Google Calendar data
    const meetingData = {
      status: "scheduled",
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      organizer: Number(userId),
      google_event_id: gData.id,
      google_meet_link:
        gData.conferenceData?.entryPoints?.find(
          (e) => e.entryPointType === "video"
        )?.uri || "",
    };

    const meetingResponse = await axios.post(
      API_ROUTES.CREATE_MEETING,
      meetingData
    );

    return { meetingId: meetingResponse.data.id, gData };
  } catch (error) {
    toast.error(`Failed to create calendar event: ${error.message}`);
    throw error;
  }
};

const updateGoogleEvent = async ({
  google_event_id,
  session,
  startISO,
  endISO,
}) => {
  if (!google_event_id) {
    throw new Error("Google event ID is required for calendar sync");
  }

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${google_event_id}?conferenceDataVersion=1`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.provider_token}`,
        },
        body: JSON.stringify({
          start: { dateTime: startISO, timeZone: tz },
          end: { dateTime: endISO, timeZone: tz },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message || "Failed to update Google Calendar event"
      );
    }

    return await response.json();
  } catch (error) {
    toast.error(`Failed to update Google Calendar event: ${error.message}`);
    throw error;
  }
};

export { combineDateAndTime, createCalendarEvent, updateGoogleEvent };
