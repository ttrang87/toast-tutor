import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/landing/Header";
import LandingPage from "./pages/LandingPage";


function App() {
  return (
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </Router>
  );
}

export default App;
