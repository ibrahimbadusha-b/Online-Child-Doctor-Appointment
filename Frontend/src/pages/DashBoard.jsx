import React, { useEffect, useState } from "react";
import { auth } from "../config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './DashBoard.css';

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const baseURL =
    process.env.REACT_APP_API_BASE_URL ||
    "https://online-child-doctor-appointment-bk.vercel.app";

  // --- Authentication listener ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // --- Fetch appointment data ---
  useEffect(() => {
    const getAllUsers = async () => {
      if (!currentUser?.email) return;

      try {
        setLoading(true);
        let url = "";

        if (currentUser.email === "admin@gmail.com") {
          url = `${baseURL}/api/users/getUsersData`;
        } else {
          url = `${baseURL}/api/users/singleUserData/${currentUser.email}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        if (data.userDatas) {
          setAppointments(data.userDatas);
          setFilteredAppointments(data.userDatas);
        } else {
          setAppointments([]);
          setFilteredAppointments([]);
        }
      } catch (err) {
        toast.error("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    getAllUsers();
  }, [currentUser]);

  // --- Search Handler ---
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

  // --- Delete/Cancel Handler ---
  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;

    try {
      const res = await fetch(`${baseURL}/api/users/cancelAppointment/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setAppointments((prev) => prev.filter((a) => a._id !== id));
        setFilteredAppointments((prev) => prev.filter((a) => a._id !== id));
        toast.success("Appointment cancelled successfully!");
      } else {
        toast.error("Failed to cancel appointment");
      }
    } catch {
      toast.error("Network error!");
    }
  };

  // --- Loading Screen ---
  if (loading) {
    return (
      <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75" style={{ zIndex: 1050 }}>
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  // --- Unauthenticated state ---
  if (!currentUser) {
    return (
      <div className="text-center py-5 text-muted fs-5">
        Please log in to view your dashboard.
      </div>
    );
  }

  // --- MAIN DASHBOARD UI ---
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <aside
        className="bg-success text-white p-3 d-none d-md-flex flex-column justify-content-between"
        style={{ width: "240px", minHeight: "100vh" }}
      >
        <div>
          <h5 className="fw-bold mb-4">KidCare</h5>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <a className="nav-link text-white" href="#">
                <i className="bi bi-speedometer2 me-2"></i> Dashboard
              </a>
            </li>
            {currentUser.email === "admin@gmail.com" && (
              <li className="nav-item mb-2">
                <a className="nav-link text-white" href="#">
                  <i className="bi bi-people me-2"></i> Users
                </a>
              </li>
            )}
            <li className="nav-item mb-2">
              <a className="nav-link text-white" href="#">
                <i className="bi bi-calendar3 me-2"></i> Appointments
              </a>
            </li>
            <li className="nav-item mb-2">
              <a className="nav-link text-white" href="#">
                <i className="bi bi-person-lines-fill me-2"></i> Profile
              </a>
            </li>
          </ul>
        </div>

        <div>
          <small className="text-white-50">
            {currentUser.email}
          </small>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 bg-light p-4">
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

          <div className="mt-3 mt-md-0" style={{ maxWidth: "300px" }}>
            <input
              type="text"
              className="form-control border-success"
              placeholder="Search appointments..."
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
              <p className="text-muted mb-0 fs-5 fw-semibold">
                {appointments.length}
              </p>
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

        {/* Appointment Cards */}
        {filteredAppointments.length === 0 ? (
          <div className="text-center text-muted mt-5">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              alt="No data"
              width="120"
              className="mb-3"
            />
            <p className="fs-5">No appointments found</p>
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
                        <strong>Child:</strong> {user.childName} (
                        {user.childAge} yrs)
                      </li>
                      <li>
                        <strong>Phone:</strong> {user.phone}
                      </li>
                    </ul>
                    <p className="text-muted small mb-3">
                      <strong>Issue:</strong> {user.issue || "—"}
                    </p>

                    {currentUser.email === "admin@gmail.com" ? (
                      <>
                        <button className="btn btn-outline-primary btn-sm w-100 mb-2">
                          <i className="bi bi-check2-circle me-1"></i>
                          Approve Appointment
                        </button>
                        <button
                          onClick={() => deleteHandler(user._id)}
                          className="btn btn-outline-danger btn-sm w-100"
                        >
                          <i className="bi bi-x-circle me-1"></i>
                          Delete Appointment
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => deleteHandler(user._id)}
                        className="btn btn-outline-danger btn-sm w-100"
                      >
                        <i className="bi bi-x-circle me-1"></i>
                        Cancel Appointment
                      </button>
                    )}
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
      </main>
    </div>
  );
}
