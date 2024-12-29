import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/landing/Header";
import LandingPage from "./pages/LandingPage";
import TutorProfile from "./pages/TutorProfile";


function App() {
  return (
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/tutor/profile" element={<TutorProfile />} />
        </Routes>
      </Router>
  );
}

export default App;
