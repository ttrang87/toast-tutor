import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/landing/Header";
import LandingPage from "./pages/LandingPage";
import TutorProfile from "./pages/TutorProfile";
import Booking from "./pages/features/booking_tutor/CombineBookingSteps";
import Waiting from "./pages/features/booking_tutor/Waiting";


function App() {
  return (
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/tutor/profile/8" element={<TutorProfile />} />
          <Route path="/booking/8" element={<Booking/>} />
          <Route path="/waiting/8" element={<Waiting/>} />


        </Routes>
      </Router>
  );
}

export default App;
