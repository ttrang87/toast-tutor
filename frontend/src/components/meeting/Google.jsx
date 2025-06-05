import { toast } from "react-hot-toast";
import GoogleCalendarConnect from "../calendar/GoogleCalendarConnect";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const googleSignIn = async (supabase, redirectPath) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}${redirectPath}`,
      scopes:
        "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events",
    },
  });
  if (error) {
    toast.error("Google sign-in failed");
    throw error;
  }
  if (data?.url) window.location.assign(data.url);
};

const googleLogout = async (supabase) => {
  await supabase.auth.signOut();
  localStorage.removeItem("supabase.auth.token");
  toast.success("Signed out from Google");
};

const GoogleFormCreate = () => {
  const supabase = useSupabaseClient();

  const connectGoogle = async () => {
    try {
      await googleSignIn(supabase, "/meetings/create");
      toast.success("Google Calendar connected");
    } catch {
      toast.error("Failed to connect");
    }
  };

  return <GoogleCalendarConnect onConnect={connectGoogle} />;
};

const GoogleFormEdit = ({ supabase, meetingId }) => {
  const connectGoogle = async () => {
    try {
      await googleSignIn(supabase, `/meetings/${meetingId}/edit`);
      toast.success("Google Calendar connected");
    } catch {
      toast.error("Failed to connect");
    }
  };

  return <GoogleCalendarConnect onConnect={connectGoogle} />;
};

export { googleSignIn, googleLogout, GoogleFormCreate, GoogleFormEdit };
