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
    // Only fetch when we have a user
    if (currentUser?.email) {
      getAllUsers();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const getAllUsers = async () => {
    if (!currentUser?.email) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("🔄 Starting API call for user:", currentUser.email);
      
      let url = "";
      if (currentUser.email === "admin@gmail.com") {
        url = "https://online-child-doctor-appointment-bk.vercel.app/api/users/getUsersData";
      } else {
        url = `https://online-child-doctor-appointment-bk.vercel.app/api/users/singleUserData/${encodeURIComponent(currentUser.email)}`;
      }

      console.log("📡 Fetching from URL:", url);

      // Enhanced fetch with timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log("📡 Response status:", res.status);
      console.log("📡 Response ok:", res.ok);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("📡 Error response:", errorText);
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      console.log("📡 Raw API response:", data);
      console.log("📡 Response keys:", Object.keys(data));

      // Handle different possible response structures
      let appointmentsData = [];
      
      if (data.userDatas && Array.isArray(data.userDatas)) {
        appointmentsData = data.userDatas;
        console.log("✅ Using data.userDatas");
      } else if (data.userData) {
        appointmentsData = Array.isArray(data.userData) ? data.userData : [data.userData];
        console.log("✅ Using data.userData");
      } else if (data.data && Array.isArray(data.data)) {
        appointmentsData = data.data;
        console.log("✅ Using data.data");
      } else if (data.appointments && Array.isArray(data.appointments)) {
        appointmentsData = data.appointments;
        console.log("✅ Using data.appointments");
      } else if (Array.isArray(data)) {
        appointmentsData = data;
        console.log("✅ Using data directly (it's an array)");
      } else {
        console.warn("⚠️ Unknown response structure:", data);
        appointmentsData = [];
      }

      console.log("✅ Final appointments array:", appointmentsData);
      console.log("✅ Appointments count:", appointmentsData.length);

      setAppointments(appointmentsData);
      setFilteredAppointments(appointmentsData);

      if (appointmentsData.length === 0) {
        toast.info("No appointments found for this user.");
      } else {
        console.log("✅ Successfully loaded", appointmentsData.length, "appointments");
      }

    } catch (err) {
      console.error("❌ getAllUsers error:", err);
      
      if (err.name === 'AbortError') {
        toast.error("Request timeout - please try again");
      } else if (err.message.includes('fetch')) {
        toast.error("Network error - check your connection");
      } else {
        toast.error(`Failed to load appointments: ${err.message}`);
      }
      
      // Set empty arrays on error
      setAppointments([]);
      setFilteredAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    
    if (!value.trim()) {
      setFilteredAppointments(appointments);
      return;
    }
    
    const filtered = appointments.filter((item) => {
      const childName = item.childName?.toLowerCase() || '';
      const doctorName = item.doctorName?.toLowerCase() || '';
      const date = item.date?.toLowerCase() || '';
      
      return childName.includes(value) || 
             doctorName.includes(value) || 
             date.includes(value);
    });
    
    setFilteredAppointments(filtered);
  };

  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    if (!id) {
      toast.error("Invalid appointment ID");
      return;
    }

    try {
      console.log("🗑️ Deleting appointment ID:", id);
      
      const res = await fetch(
        `https://online-child-doctor-appointment-bk.vercel.app/api/users/cancelAppointment/${id}`,
        { 
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("🗑️ Delete response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("🗑️ Delete error response:", errorText);
        throw new Error(`Failed to delete: ${res.status}`);
      }

      const data = await res.json();
      console.log("🗑️ Delete response data:", data);

      if (data.success) {
        // Update both arrays
        setAppointments((prev) => prev.filter((user) => user._id !== id));
        setFilteredAppointments((prev) => prev.filter((user) => user._id !== id));
        toast.success("Appointment cancelled successfully!");
      } else {
        toast.error(data.message || "Failed to cancel appointment");
      }
    } catch (error) {
      console.error("❌ Delete error:", error);
      toast.error(`Error cancelling appointment: ${error.message}`);
    }
  };

  // Retry function
  const handleRetry = () => {
    console.log("🔄 Retry button clicked");
    getAllUsers();
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-success mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted">Loading your appointments...</p>
        <small className="text-muted">User: {currentUser?.email || 'Authenticating...'}</small>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="text-center py-5 text-muted fs-5">
        <i className="bi bi-person-lock fs-1 mb-3 d-block"></i>
        <p>Please log in to view your dashboard.</p>
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

        <div className="mt-3 mt-md-0 d-flex gap-2">
          <input
            type="text"
            className="form-control border-success"
            placeholder="Search by name, doctor, or date"
            value={search}
            onChange={handleSearch}
          />
          <button 
            onClick={handleRetry} 
            className="btn btn-outline-success"
            title="Refresh appointments"
          >
            🔄
          </button>
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

      {/* Debug info (remove in production) */}
      <div className="alert alert-light border small mb-4">
        <strong>Debug:</strong> Found {appointments.length} appointments | 
        Filtered: {filteredAppointments.length} | 
        Search: "{search}"
        <button onClick={() => console.log("Appointments data:", appointments)} className="btn btn-sm btn-outline-secondary ms-2">
          Log Data
        </button>
      </div>

      {/* Appointment List */}
      {filteredAppointments.length === 0 ? (
        <div className="text-center text-muted fs-5 mt-5">
          <i className="bi bi-calendar-x fs-1 mb-3 d-block"></i>
          {appointments.length === 0 ? (
            <div>
              <p>No appointments found.</p>
              <button onClick={handleRetry} className="btn btn-outline-primary">
                <i className="bi bi-arrow-clockwise me-1"></i>
                Retry Loading
              </button>
            </div>
          ) : (
            <div>
              <p>No appointments match your search: "{search}"</p>
              <button onClick={() => setSearch("")} className="btn btn-outline-secondary btn-sm">
                Clear Search
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="row g-4">
          {filteredAppointments.map((user, index) => (
            <div className="col-sm-12 col-md-6 col-lg-4" key={user._id || index}>
              <div className="card border-0 shadow-lg h-100">
                <div className="card-header bg-white border-0">
                  <h6 className="text-success fw-bold mb-0">
                    <i className="bi bi-person-heart me-2"></i>
                    {user.doctorName || "Dr. Not Assigned"}
                  </h6>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled mb-3">
                    <li><strong>Date:</strong> {user.date || "—"}</li>
                    <li><strong>Time:</strong> {user.time || "—"}</li>
                    <li>
                      <strong>Child:</strong> {user.childName || "—"}
                      {user.childAge ? ` (${user.childAge} yrs)` : ""}
                    </li>
                    <li><strong>Phone:</strong> {user.phone || "—"}</li>
                  </ul>
                  <p className="text-muted small mb-3">
                    <strong>Issue:</strong> {user.issue || "—"}
                  </p>

                  <button
                    onClick={() => deleteHandler(user._id)}
                    className="btn btn-outline-danger btn-sm w-100"
                    disabled={!user._id}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Cancel Appointment
                  </button>
                </div>
                <div className="card-footer bg-light text-center small text-muted">
                  ID: {user._id?.slice(-6).toUpperCase() || "N/A"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
