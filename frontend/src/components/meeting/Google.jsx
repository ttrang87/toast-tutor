import { CalendarIcon, GoogleCalendarIcon } from "../../assets/icon";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";

export const googleSignIn = async (supabase, redirectPath) => {
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

export const googleLogout = async (supabase) => {
  await supabase.auth.signOut();
  localStorage.removeItem("supabase.auth.token");
  toast.success("Signed out from Google");
};

export const GoogleFormCreate = () => {
  const supabase = useSupabaseClient();
  const connectGoogle = async () => {
    try {
      await googleSignIn(supabase, "/meetings/create");
      toast.success("Google Calendar connected");
    } catch {
      toast.error("Failed to connect");
    }
  };

  return (
    <div className="p-12 text-center space-y-8">
      <div className="w-28 h-28 bg-[#FFF8E1] rounded-full grid place-items-center mx-auto">
        {CalendarIcon}
      </div>
      <h2 className="text-2xl font-semibold text-[#8b5e34]">
        Connect Your Calendar
      </h2>
      <p className="text-lg text-[#b78846]">
        Connect Google Calendar to schedule meetings with integrated Google Meet
      </p>
      <button
        onClick={connectGoogle}
        className="inline-flex items-center gap-3 px-10 py-4 text-xl font-medium text-white bg-[#FF8A65] rounded-xl shadow-lg hover:bg-[#ff7043]"
      >
        {GoogleCalendarIcon}
        Connect Google Calendar
      </button>
    </div>
  );
};

export const GoogleFormEdit = ({ supabase, meetingId }) => {
  const connectGoogle = async () => {
    try {
      await googleSignIn(supabase, `/meetings/${meetingId}/edit`);
      toast.success("Google Calendar connected");
    } catch {
      toast.error("Failed to connect");
    }
  };

  return (
    <div className="p-12 text-center space-y-8">
      <div className="w-28 h-28 bg-[#FFF8E1] rounded-full grid place-items-center mx-auto">
        {CalendarIcon}
      </div>
      <h2 className="text-2xl font-semibold text-[#8b5e34]">
        Connect Your Calendar
      </h2>
      <p className="text-lg text-[#b78846]">
        Connect Google Calendar to schedule meetings with integrated Google Meet
      </p>
      <button
        onClick={connectGoogle}
        className="inline-flex items-center gap-3 px-10 py-4 text-xl font-medium text-white bg-[#FF8A65] rounded-xl shadow-lg hover:bg-[#ff7043]"
      >
        {GoogleCalendarIcon}
        Connect Google Calendar
      </button>
    </div>
  );
};
