import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/landing/Header";
import LandingPage from "./pages/LandingPage";
import TutorProfile from "./pages/TutorProfile";
import EnterEmail from "./pages/auth/password/EnterEmail";
import NewPassword from "./pages/auth/password/NewPassword";
import RedirectPage from "./pages/auth/password/RedirectPage";
import Waiting from "./pages/auth/password/Waiting";
import TutorList from "./pages/TutorList";
import LogIn from "./pages/auth/LogIn";

function App() {
  return (
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/tutor/profile" element={<TutorProfile />} />
          <Route path="/auth/enteremail" element={<EnterEmail />} />
          <Route path="/reset-password/:token" element={<NewPassword />} />
          <Route path="/auth/waiting" element={<Waiting />} />
          <Route path="/auth/redirect" element={<RedirectPage />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/listing" element={<TutorList />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
