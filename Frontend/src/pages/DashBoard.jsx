import React, { useEffect, useState } from "react";
import { auth } from "../config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const getAllUsers = async () => {
      if (!currentUser?.email) return;

      try {
        setLoading(true);
        let url = "";

        if (currentUser.email === "admin@gmail.com") {
          url = "https://online-child-doctor-appointment-bk.vercel.app/api/users/getUsersData";
        } else {
          url = `https://online-child-doctor-appointment-bk.vercel.app/api/users/singleUserData/${currentUser.email}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        setAppointments(data.userDatas || []);
        setFilteredAppointments(data.userDatas || []);
      } catch (err) {
        toast.error("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    getAllUsers();
  }, [currentUser]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setFilteredAppointments(
      appointments.filter(
        (item) =>
          item.childName.toLowerCase().includes(value) ||
          item.doctorName.toLowerCase().includes(value) ||
          item.date.includes(value)
      )
    );
  };

  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      const res = await fetch(
        `http://localhost:2000/api/users/cancelAppointment/${id}`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (data.success) {
        setAppointments((prev) => prev.filter((user) => user._id !== id));
        setFilteredAppointments((prev) => prev.filter((user) => user._id !== id));
        toast.success("Appointment cancelled successfully!");
      } else {
        toast.error("Failed to cancel appointment");
      }
    } catch {
      toast.error("Network error!");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="text-center py-5 text-muted fs-5">
        Please log in to view your dashboard.
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <h3 className="fw-bold text-success mb-1">
            {currentUser.email === "admin@gmail.com"
              ? "Admin Dashboard"
              : "My Appointments"}
          </h3>
          <p className="text-muted small mb-0">
            Welcome, <strong>{currentUser.email}</strong>
          </p>
        </div>

        <div className="mt-3 mt-md-0">
          <input
            type="text"
            className="form-control border-success"
            placeholder="Search by name, doctor, or date"
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-md-3">
          <div className="card border-0 shadow-sm text-center p-3">
            <div className="text-success fs-3 mb-2">
              <i className="bi bi-calendar-check"></i>
            </div>
            <h6 className="fw-bold">Total Appointments</h6>
            <p className="text-muted mb-0 fs-5 fw-semibold">{appointments.length}</p>
          </div>
        </div>

        <div className="col-sm-6 col-md-3">
          <div className="card border-0 shadow-sm text-center p-3">
            <div className="text-primary fs-3 mb-2">
              <i className="bi bi-person"></i>
            </div>
            <h6 className="fw-bold">My Role</h6>
            <p className="text-muted mb-0 fs-6">
              {currentUser.email === "admin@gmail.com" ? "Admin" : "User"}
            </p>
          </div>
        </div>
      </div>

      {/* Appointment List */}
      {filteredAppointments.length === 0 ? (
        <div className="text-center text-muted fs-5 mt-5">
          No appointments found.
        </div>
      ) : (
        <div className="row g-4">
          {filteredAppointments.map((user) => (
            <div className="col-sm-12 col-md-6 col-lg-4" key={user._id}>
              <div className="card border-0 shadow-lg h-100">
                <div className="card-header bg-white border-0">
                  <h6 className="text-success fw-bold mb-0">
                    <i className="bi bi-person-heart me-2"></i>
                    {user.doctorName || "Dr. Not Assigned"}
                  </h6>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled mb-3">
                    <li>
                      <strong>Date:</strong> {user.date}
                    </li>
                    <li>
                      <strong>Time:</strong> {user.time}
                    </li>
                    <li>
                      <strong>Child:</strong> {user.childName} ({user.childAge} yrs)
                    </li>
                    <li>
                      <strong>Phone:</strong> {user.phone}
                    </li>
                  </ul>
                  <p className="text-muted small mb-3">
                    <strong>Issue:</strong> {user.issue || "—"}
                  </p>

                  <button
                    onClick={() => deleteHandler(user._id)}
                    className="btn btn-outline-danger btn-sm w-100"
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Cancel Appointment
                  </button>
                </div>
                <div className="card-footer bg-light text-center small text-muted">
                  ID: {user._id.slice(-6).toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer position="bottom-right" autoClose={2000} />
    </div>
  );
}
