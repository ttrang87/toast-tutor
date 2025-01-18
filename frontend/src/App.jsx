import { React, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/landing/Header";
import LandingPage from "./pages/LandingPage";
import TutorProfile from "./pages/TutorProfile";
import Booking from "./pages/features/booking_tutor/CombineBookingSteps";
import Waiting from "./pages/features/booking_tutor/Waiting";
import MatchedTutors from "./pages/features/booking_tutor/MatchedTutors";
import SignUp from "./pages/auth/SignUp";
import LogIn from "./pages/auth/LogIn";

function App() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get the user ID from localStorage
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tutor/profile/:id" element={<TutorProfile />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/waiting" element={<Waiting />} />
        <Route path="/matched_tutors/:id" element={<MatchedTutors />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
      </Routes>
    </Router>
  );
}

export default App;