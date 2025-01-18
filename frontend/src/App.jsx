import { React, useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/landing/Header";
import LandingPage from "./pages/LandingPage";
import TutorProfile from "./pages/TutorProfile";
import Booking from "./pages/features/booking_tutor/CombineBookingSteps";
import WaitingMatched from "./pages/features/booking_tutor/WaitingMatched";
import MatchedTutors from "./pages/features/booking_tutor/MatchedTutors";
import SignUp from "./pages/auth/SignUp";
import EnterEmail from "./pages/auth/password/EnterEmail";
import NewPassword from "./pages/auth/password/NewPassword";
import RedirectPage from "./pages/auth/password/RedirectPage";
import Waiting from "./pages/auth/password/Waiting";
import LogIn from "./pages/auth/LogIn";

function App() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get the user ID from localStorage
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tutor/profile/:id" element={<TutorProfile />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/waiting_match" element={<WaitingMatched />} />
        <Route path="/matched_tutors/:id" element={<MatchedTutors />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />

        <Route path="/auth/enteremail" element={<EnterEmail />} />
        <Route path="/reset-password/:token" element={<NewPassword />} />
        <Route path="/auth/waiting" element={<Waiting />} />
        <Route path="/auth/redirect" element={<RedirectPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;