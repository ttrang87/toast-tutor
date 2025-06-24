import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import "./App.css";
import { Toaster } from "react-hot-toast";
import Header from "./components/landing/Header";
import LandingPage from "./pages/LandingPage";
import TutorProfile from "./pages/TutorProfile";
import CreateMeetingPage from "./pages/meeting/CreateMeetingPage";
import BookingMeetingPage from "./pages/meeting/BookingMeetingPage";
import TutorMeetingPage from "./pages/meeting/TutorMeetingPage";
import EditMeetingPage from "./pages/meeting/EditMeetingPage";
import Booking from "./pages/features/booking_tutor/CombineBookingSteps";
import WaitingMatched from "./pages/features/booking_tutor/WaitingMatched";
import MatchedTutors from "./pages/features/booking_tutor/MatchedTutors";
import SignUp from "./pages/auth/SignUp";
import EnterEmail from "./pages/auth/password/EnterEmail";
import NewPassword from "./pages/auth/password/NewPassword";
import RedirectPage from "./pages/auth/password/RedirectPage";
import Waiting from "./pages/auth/password/Waiting";
import LogIn from "./pages/auth/LogIn";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";


import TutorList from "./pages/TutorList";


import Payment from "./pages/payment/payment";
import Success from "./pages/payment/success.jsx";
import Confirm from "./pages/payment/Confirm";
import Cancel from "./pages/payment/cancel";


import ScheduleDashboard from "./pages/Schedule/dashboard";


import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { createClient } from "@supabase/supabase-js";

import { updateUserStatus } from "./services/userService"; // Import your user status update function

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


function App() {
  const stripePromise = loadStripe(import.meta.env.VITE_PUBLIC_KEY);
const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userState, setPresenceState] = useState({});
  const subscribeToPresence = useCallback(async (room) => {
    if (isLoggedIn) {
      const userId = localStorage.getItem("userId") || "anonymous";
      const userStatus = {
        user: userId,
        online_at: new Date().toISOString(),
      };

      // Track the user's presence in the Supabase channel
      await room.track(userStatus);

      // Send the user's status to the backend API
      try {
        await updateUserStatus(userId, true); // Set `is_active` to true
        console.log("User status updated to active");
      } catch (error) {
        console.error("Failed to update user status:", error);
      }
    }
  }, [isLoggedIn]);

  const handleSync = useCallback((room) => {
    const newState = room.presenceState();
    setPresenceState(newState);
    console.log("Presence state updated:", newState);
  }, []);

  const handleJoin = useCallback(({ newPresences }) => {
    newPresences.forEach((presence) => {
      console.log(`User ${presence.user} joined at ${presence.online_at}`);
    });
  }, []);

  const handleLeave = useCallback(async ({ leftPresences }) => {
    leftPresences.forEach(async (presence) => {
      console.log(`User ${presence.user} left`);

      // Update the user's status to inactive in the backend
      try {
        await updateUserStatus(presence.user, false); // Set `is_active` to false
        console.log(`User ${presence.user} status updated to inactive`);
      } catch (error) {
        console.error(`Failed to update status for user ${presence.user}:`, error);
      }
    });
  }, []);

  useEffect(() => {
    const room = supabase.channel("tutors_presence");

    room.on("presence", { event: "sync" }, () => handleSync(room));
    room.on("presence", { event: "join" }, handleJoin);
    room.on("presence", { event: "leave" }, handleLeave);

    room.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await subscribeToPresence(room);
      }
    });

    return () => {
      room.unsubscribe();
    };
  }, [subscribeToPresence, handleSync, handleJoin, handleLeave]);

  return (
    <BrowserRouter>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={12}
        containerStyle={{ top: 20 }}
        toastOptions={{
          duration: 1000,
          style: {
            minWidth: 350,
            maxWidth: "90vw",
            padding: "1.25rem 1.75rem",
            fontSize: "1.2rem",
            borderRadius: 16,
            background: "#FFFFFF",
            color: "#8b5e34",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
          success: { iconTheme: { primary: "#4caf50", secondary: "#ffffff" } },
          error: { iconTheme: { primary: "#f44336", secondary: "#ffffff" } },
        }}
      />


      <Routes>
        <Route path="/" element={<LandingPage />} />


        <Route
          path="/tutor/profile/:id"
          element={
            <ProtectedRoute>
              <TutorProfile />
            </ProtectedRoute>
          }
        />


        <Route
          path="/booking/:id"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />


        <Route
          path="/waiting_match"
          element={
            <ProtectedRoute>
              <WaitingMatched />
            </ProtectedRoute>
          }
        />


 
        <Route
          path="/meetings/create"
          element={
            <ProtectedRoute>
              <CreateMeetingPage />
            </ProtectedRoute>
          }
        />


        <Route
          path="/meetings/:meetingId/edit"
          element={
            <ProtectedRoute>
              <EditMeetingPage />
            </ProtectedRoute>
          }
        />


        {/* ---------- VIEW/BOOK ROUTE AFTER ---------- */}
        <Route
          path="/meetings/:meetingId/book"
          element={
            <ProtectedRoute>
              <BookingMeetingPage />
            </ProtectedRoute>
          }
        />


        {/* tutor-scoped views */}
        <Route
          path="/meetings/tutor/:tutorId/:studentId"
          element={
            <ProtectedRoute>
              <TutorMeetingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meetings/tutor/:tutorId"
          element={
            <ProtectedRoute>
              <TutorMeetingPage />
            </ProtectedRoute>
          }
        />


        {/* matched tutors */}
        <Route
          path="/matched_tutors/:id"
          element={
            <ProtectedRoute>
              <MatchedTutors />
            </ProtectedRoute>
          }
        />


        {/* auth */}
        <Route
          path="/signup"
          element={
            <SignUp isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          }
        />
        <Route
          path="/login"
          element={
            <LogIn isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          }
        />
        <Route path="/auth/enteremail" element={<EnterEmail />} />
        <Route path="/reset-password/:token" element={<NewPassword />} />
        <Route path="/auth/waiting" element={<Waiting />} />
        <Route path="/auth/redirect" element={<RedirectPage />} />


        <Route path="/listing" element={<TutorList presenceState={userState} />} />


        <Route path="/payment/:meetingId/" element={ <Elements stripe={stripePromise}><Payment /></Elements>}/>
        <Route path="/success" element={<Success />}/>
        <Route path="/cancel" element={<Cancel />}/>
        <Route path="/confirmation/:meetingId/" element={<Elements stripe={stripePromise}><Confirm /></Elements>}/>


        {/* Need to add userID to this  */}
        <Route
        path="/dashboard/:id"
        element={
          <ProtectedRoute>
            <ScheduleDashboard />
          </ProtectedRoute>
          }
        />


        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;



