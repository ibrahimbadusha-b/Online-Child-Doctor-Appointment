import React from 'react';
import './Banner.css';
import banner from '../assets/banner.webp';      
import bannersm from '../assets/banner-sm.jpg';   

const Banner = () => {
  return (
    <>
      {/* small banner for mobile devices */}
      <div className="banner-container d-sm-none position-relative">
        <img
          src={bannersm}
          alt="Pediatric Doctor Banner"
          className="img-fluid w-100 banner-image"
        />

        <div className="position-absolute top-50 start-0 translate-middle-y w-100 px-3 banner-content">
          <div className="row">
            <div className="col-7 text-start">
              <p className="fs-5 fw-semibold mb-4" style={{ color:"#242020ff" }}>
                Expert Pediatricians Dedicated to Your Child’s Health and Wellness
              </p>
              <a className="btn btn-sm text-white rounded-pill px-3 shadow-sm" href='#Appointment-Form' style={{ background: 'linear-gradient(135deg, #ee0d0d, #b60505)' }}>
                Book Appointment
              </a>
            </div>
          </div>
        </div>
      </div>
   {/* for medium and larger size devices */}
      <div className="banner-container d-none d-sm-block">  
        <a href="#Appointment-Form">
          <img
            src={banner}
            alt="Pediatric Banner"
            className="img-fluid w-100 banner-image"
          />
        </a>

      </div>
    </>
  );
};

export default Banner;
