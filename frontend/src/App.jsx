import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/landing/Header";
import LandingPage from "./pages/LandingPage";
import TutorProfile from "./pages/TutorProfile";
import LogIn from "./pages/auth/LogIn";
import SignUp from "./pages/auth/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/tutor/profile/8"
          element={
            <ProtectedRoute>
              <TutorProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
