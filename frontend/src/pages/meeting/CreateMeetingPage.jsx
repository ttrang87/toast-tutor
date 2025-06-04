import { useSession } from "@supabase/auth-helpers-react";
import {
  CalendarStyle,
  CalendarForm,
  CalendarFooter,
} from "../../components/meeting/Calendar";
import { GoogleFormCreate } from "../../components/meeting/Google";

const CreateMeetingPage = () => {
  const session = useSession();

  return (
    <div className="min-h-screen bg-[#FFFDE7] py-16 px-5">
      {/* <Toaster position="top-right" reverseOrder={false} /> */}
      <CalendarStyle />
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#8b5e34]">
            Schedule a Meeting
          </h1>
          <p className="mt-3 text-xl text-[#b78846]">
            Create a new meeting and connect with your students
          </p>
        </header>

        <section className="bg-white rounded-3xl border-2 border-[#FFE082] shadow-xl overflow-hidden">
          {session ? <CalendarForm /> : <GoogleFormCreate />}
        </section>

        <CalendarFooter />
      </div>
    </div>
  );
};

export default CreateMeetingPage;
