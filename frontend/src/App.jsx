import { useState } from "react";
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
import TutorList from "./pages/TutorList";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

import Payment from "./pages/payment/payment";
import SuccessPayment from "./pages/payment/success";
import Confirmation from "./pages/payment/Confirm";
import CancelPayment from "./pages/payment/cancel";

import ScheduleDashboard from "./pages/Schedule/dashboard";

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const stripePromise = loadStripe(import.meta.env.VITE_PUBLIC_KEY);

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

        <Route path="/listing" element={<TutorList />} />

        <Route path="/payment" element={ <Elements stripe={stripePromise}><Payment /></Elements>}/>
        <Route path="/success" element={<SuccessPayment />}/>
        <Route path="/cancel" element={<CancelPayment />}/>
        <Route path="/confirmation" element={<Elements stripe={stripePromise}><Confirmation /></Elements>}/>

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
