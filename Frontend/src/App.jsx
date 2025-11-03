import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Banner from "./components/Banner.jsx";
import Services from "./components/Services.jsx";
import Doctors from "./components/Doctors.jsx";
import AppointmentForm from "./components/AppointmentForm.jsx";
import CustomerTestimonials from "./components/CustomerTestimonials.jsx";
import AllDoctors from "./pages/AllDoctors.jsx";
import SignUpForm from "./pages/SignUpForm.jsx";
import SignInForm from "./pages/SignInForm.jsx";
import DashBoard from "./pages/DashBoard.jsx";



function HomePage() {
  return (
    <>
      <Banner />
      <Services />
      <Doctors />
      <AppointmentForm />
      <CustomerTestimonials />
    </>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/all-doctors" element={<AllDoctors />}/>
        <Route path="/sign-up" element={<SignUpForm />}/>
        <Route path="/sign-in" element={<SignInForm />}/> 
        <Route path="/user-dashboard" element={<DashBoard />}/> 
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
