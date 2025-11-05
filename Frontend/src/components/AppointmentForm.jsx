import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase-config.js";
import { onAuthStateChanged } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppointmentForm = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  const doctors = [
    { id: 1, name: "Dr. Priya Sharma", specialization: "Pediatrician" },
    { id: 2, name: "Dr. Rajesh Kumar", specialization: "Neonatologist" },
    { id: 3, name: "Dr. Kavitha Menon", specialization: "Pediatric Surgeon" },
    { id: 4, name: "Dr. Arjun Reddy", specialization: "Child Psychologist" },
  ];

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "4:00 PM", "4:30 PM",
    "5:00 PM", "5:30 PM"
  ];

  const [formData, setFormData] = useState({
    authEmail: "",
    childName: "",
    childAge: "",
    doctorName: "",
    date: "",
    time: "",
    phone: "",
    issue: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser?.email) {
      setFormData((prev) => ({ ...prev, authEmail: currentUser.email }));
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.warn("Please login to book an appointment!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      navigate("/sign-up");
      return;
    }

    // Check required fields before form submit
    if (!formData.childName || !formData.childAge || !formData.doctorName || !formData.date || !formData.time || !formData.issue) {
      toast.error("Please fill all required fields.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        // get data from backend
        "https://online-child-doctor-appointment-bk.vercel.app/api/users/storeUserData",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success === false) {
        throw new Error(data.message || "Server validation failed");
      }

      toast.success("Appointment Booked Successfully!", {
        position: "top-right",
        autoClose: 3000,
        style: {
          backgroundColor: "#14532d",
          color: "#fff",
          fontWeight: "500",
        },
      });

      // after submission the will blank
      setFormData({
        authEmail: currentUser.email,
        childName: "",
        childAge: "",
        doctorName: "",
        date: "",
        time: "",
        phone: "",
        issue: "",
      });
    } catch (error) {
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingUser) {
    return <p className="text-center my-5">Loading user...</p>;
  }

  return (
    <div className="my-4 my-md-5">
      <div className="container px-3 px-lg-4" id="Appointment-Form">
        <div className="card appointment-card">
          <div className="card-body p-3 p-lg-4">
            <h3 className="mb-3 mb-lg-4 text-center text-dark fw-bold">
              Book <span className="d-none d-sm-inline">an</span> Appointment
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="row g-2 g-lg-3">
                <div className="col-12 col-lg-4">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Child Name"
                    name="childName"
                    value={formData.childName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 col-lg-2">
                  <input
                    className="form-control"
                    type="number"
                    placeholder="Age"
                    name="childAge"
                    min="0"
                    value={formData.childAge}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 col-lg-3">
                  <input
                    className="form-control"
                    type="tel"
                    placeholder="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 col-lg-3">
                  <select
                    className="form-control"
                    name="doctorName"
                    value={formData.doctorName}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose Doctor...</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} - {d.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-6 col-lg-3">
                  <input
                    className="form-control"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                <div className="col-6 col-lg-3">
                  <select
                    className="form-control"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Time...</option>
                    {timeSlots.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-lg-6">
                  <textarea
                    className="form-control"
                    name="issue"
                    rows="2"
                    placeholder="Describe symptoms or reason for visit..."
                    value={formData.issue}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <div className="row mt-3 mt-lg-4">
                <div className="col-12 col-lg-2 ms-lg-auto">
                  <button
                    type="submit"
                    className="btn w-100 fw-bold"
                    style={{
                      background: "linear-gradient(135deg, #ee0d0d, #b60505)",
                      color: "white",
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Booking..." : "Book Now"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
         {/* setting Toastify */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default AppointmentForm;
