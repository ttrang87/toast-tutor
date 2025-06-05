import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/landing/Header";
import LandingPage from "./pages/LandingPage";
import TutorProfile from "./pages/TutorProfile";
import MeetingsListPage from "./pages/MeetingsListPage";
import CreateMeetingPage from "./pages/CreateMeetingPage";
import BookingMeetingPage from "./pages/BookingPage";
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
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <BrowserRouter>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
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
          path="/meetings"
          element={
            <ProtectedRoute>
              <MeetingsListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meetings/:meetingId"
          element={
            <ProtectedRoute>
              <BookingMeetingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matched_tutors/:id"
          element={
            <ProtectedRoute>
              <MatchedTutors />
            </ProtectedRoute>
          }
        />
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
