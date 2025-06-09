import axios from "axios";
import { API_ROUTES } from "../../constant/APIRoutes";

export const calendarStyles = `
  .react-calendar {
    border: 1px solid #e2d5c3;
    border-radius: 8px;
    background-color: #fff;
    font-family: inherit;
  }
  .react-calendar__tile--active {
    background: #d4a373 !important;
    color: white;
  }
  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background: #c19a6b !important;
  }
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: #f8edd0;
  }
  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background-color: #f8edd0;
  }
`;

// Google Sign In function
export const googleSignIn = async (supabase) => {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/meetings/create`,
      scopes:
        "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events",
    },
  });
};

export const googleLogout = async (supabase) => {
  await supabase.auth.signOut();
  localStorage.removeItem("supabase.auth.token");
};

// Helper function to combine date and time
export const combineDateAndTime = (date, timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};

// Create calendar event function
export const createCalendarEvent = async ({
  userId,
  session,
  startDateTime,
  endDateTime,
}) => {
  try {
    // Create meeting in the database
    const meetingData = {
      status: "scheduled",
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      organizer: Number(userId),
    };

    const meetingResponse = await axios.post(
      API_ROUTES.CREATE_MEETING,
      meetingData
    );

    const meetingId = meetingResponse.data.id;

    // Create Google Calendar event with Meet integration
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
          start: { dateTime: startDateTime.toISOString(), timeZone: tz },
          end: { dateTime: endDateTime.toISOString(), timeZone: tz },
          conferenceData: {
            createRequest: {
              requestId: meetingId.toString(),
              conferenceSolutionKey: { type: "hangoutsMeet" },
            },
          },
        }),
      }
    );
    const gData = await gRes.json();
    if (gData.error) throw new Error(gData.error.message);
    const updateUrl = API_ROUTES.UPDATE_MEETING(meetingId);
    await axios.patch(updateUrl, {
      google_event_id: gData.id,
      google_meet_link:
        gData.conferenceData?.entryPoints?.find(
          (e) => e.entryPointType === "video"
        )?.uri || "",
    });

    return { meetingId, gData };
  } catch (error) {
    console.error("Error creating calendar event:", error);
    throw error;
  }
};