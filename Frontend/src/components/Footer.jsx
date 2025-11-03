import React from 'react';
import logo from '../assets/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  return (
    <footer className="container-fluid pt-5 pb-3" style={{ backgroundColor: "#e6e6e6ff" }}>
      <div className='container'>
        <div className="row text-center text-lg-start px-4 gy-4">

          {/* Hospital Info */}
          <div className="col-12 col-lg-5 pe-4 d-flex flex-column align-items-center align-items-lg-start">
            <img src={logo} alt="logo" height="65" width="65" className="mb-3" />
            <h5 className="fw-bold text-primary">KidCare Children's Hospital</h5>
            <p className="text-muted small text-center text-lg-start">
              Providing compassionate pediatric care with advanced technology and expert doctors.
              Your child’s health is our top priority.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-11 col-sm-6  col-lg-3">
            <h5 className="fw-bold mb-3 text-start text-dark ms-5 ms-md-0">Quick Links</h5>
            <div className="d-flex flex-column text-start gap-2">
              <a href="#" className="text-dark text-decoration-none d-flex align-items-center">
                <i className="fas fa-home me-2 text-secondary"></i> Home
              </a>
              <a href="#" className="text-dark text-decoration-none d-flex align-items-center">
                <i className="fas fa-calendar-check me-2 text-secondary"></i> Book Appointment
              </a>
              <a href="#" className="text-dark text-decoration-none d-flex align-items-center">
                <i className="fas fa-user-md me-2 text-secondary"></i> Our Doctors
              </a>
              <a href="#" className="text-dark text-decoration-none d-flex align-items-center">
                <i className="fas fa-comments me-2 text-secondary"></i> Patient Testimonials
              </a>
            </div>
          </div>


          <div className="col-11 col-sm-6 col-lg-3">
            <h5 className="fw-bold mb-3 text-dark text-start ms-5 ms-md-0">Contact Us</h5>
            <div className="d-flex flex-column text-start gap-2">
              <a href="tel:91 9150739154" className="text-decoration-none text-dark">
                <i className="fas fa-phone me-2 text-secondary"></i>
                +91 91507 39154
              </a>
              <a href="mailto:ibrahimbadusha2602@gmail.com" className="text-decoration-none text-dark">
                <i className="fas fa-envelope me-2 text-secondary"></i> kidcarehospital@gmail.com
              </a>
              <div className="">
                <i className="fas fa-clock me-2 text-secondary"></i>
                <span>Mon – Sat: 8:00 AM – 8:00 PM</span>
              </div>
              <div className="">
                <i className="fas fa-map-marker-alt me-2 text-secondary"></i>
                <span>Chennai, Tamil Nadu</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        <div className="row text-center gy-3">
          <div className="col-12">
            <div className="d-flex justify-content-center gap-4 fs-5">
              <a href="#" className="text-dark"><i className="fab fa-facebook"></i></a>
              <a href="#" className="text-dark"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-dark"><i className="fab fa-linkedin"></i></a>
              <a href="#" className="text-dark"><i className="fab fa-youtube"></i></a>
            </div>
          </div>

          <div className="col-12">
            <h6 className="text-dark mb-1">
              © 2025 KidCare Children's Hospital. All rights reserved.
            </h6>
            <small className="text-muted">
              NABH Certified | Licensed Pediatric Care Center | Trusted by 10,000+ Families
            </small>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
