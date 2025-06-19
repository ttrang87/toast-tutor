import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
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

import MessengerInterface from "./pages/features/messenger/Messenger.jsx";

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const stripePromise = loadStripe(import.meta.env.VITE_PUBLIC_KEY);
  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Header - Fixed height */}
        <div className="flex-shrink-0">
          <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        </div>
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

          <Route path="/listing" element={<TutorList />} />

          <Route path="/payment/:meetingId/" element={<Elements stripe={stripePromise}><Payment /></Elements>} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/confirmation/:meetingId/" element={<Elements stripe={stripePromise}><Confirm /></Elements>} />

          {/* Need to add userID to this  */}
          <Route
            path="/dashboard/:id"
            element={
              <ProtectedRoute>
                <ScheduleDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <MessengerInterface />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
