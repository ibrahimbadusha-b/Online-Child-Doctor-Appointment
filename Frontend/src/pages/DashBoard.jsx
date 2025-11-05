import React, { useEffect, useState, useMemo } from "react";
import { auth } from "../config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './DashBoard.css';

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("date");
  const [viewMode, setViewMode] = useState("grid");
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
      getAllUsers();

      const interval = setInterval(() => {
        refreshData();
      }, 120000);

      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const getAllUsers = async () => {
    if (!currentUser?.email) return;

    try {

      /* user can access their own data whiel admin can access all resources */
      setLoading(true);
      const isAdmin = currentUser.email === "admin@gmail.com";
      const url = isAdmin
        ? "https://online-child-doctor-appointment-bk.vercel.app/api/users/getUsersData"
        : `https://online-child-doctor-appointment-bk.vercel.app/api/users/singleUserData/${currentUser.email}`;

      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      const appointmentsData = data.userDatas || [];

      const enrichedAppointments = appointmentsData.map(apt => ({
        ...apt,
        status: getAppointmentStatus(apt.date, apt.time)
      }));

      setAppointments(enrichedAppointments);
      setLastUpdate(new Date());

    } catch (err) {
      console.error('Fetch error:', err);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await getAllUsers();
    setRefreshing(false);
  };

  const getAppointmentStatus = (date, time) => {
    const appointmentDateTime = new Date(`${date} ${time}`);
    const now = new Date();
    const diffHours = (appointmentDateTime - now) / (1000 * 60 * 60);

    if (diffHours < -2) return 'completed';
    if (diffHours < 0) return 'ongoing';
    if (diffHours < 24) return 'upcoming';
    return 'scheduled';
  };

  const sortedAppointments = useMemo(() => {
    if (!appointments || appointments.length === 0) {
      return [];
    }

    return [...appointments].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          try {
            const dateTimeA = `${a.date} ${a.time || '00:00:00'}`;
            const dateTimeB = `${b.date} ${b.time || '00:00:00'}`;

            const dateA = new Date(dateTimeA);
            const dateB = new Date(dateTimeB);

            if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
              return 0;
            }

            return dateA.getTime() - dateB.getTime();
          } catch (error) {
            return 0;
          }

        case 'name':
          const nameA = String(a.childName || '').toLowerCase().trim();
          const nameB = String(b.childName || '').toLowerCase().trim();

          if (nameA === '' && nameB === '') return 0;
          if (nameA === '') return 1;
          if (nameB === '') return -1;

          return nameA.localeCompare(nameB);

        case 'doctor':
          const doctorA = String(a.doctorName || 'Dr. Not Assigned').toLowerCase().trim();
          const doctorB = String(b.doctorName || 'Dr. Not Assigned').toLowerCase().trim();

          return doctorA.localeCompare(doctorB);

        default:
          return 0;
      }
    });
  }, [appointments, sortBy]);

  const analytics = useMemo(() => {
    const total = appointments.length;
    const today = appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length;
    return { total, today };
  }, [appointments]);

  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      const res = await fetch(
        `https://online-child-doctor-appointment-bk.vercel.app/api/users/cancelAppointment/${id}`,
        {
          method: "DELETE",
          headers: { 'Content-Type': 'application/json' }
        }
      );
      const data = await res.json();

      if (data.success) {
        setAppointments(prev => prev.filter(user => user._id !== id));
        toast.success("Appointment cancelled successfully!");
      } else {
        toast.error(data.message || "Failed to cancel appointment");
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Network error!");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      scheduled: 'bg-primary',
      upcoming: 'bg-warning text-dark',
      ongoing: 'bg-success',
      completed: 'bg-secondary'
    };
    return badges[status] || 'bg-light text-dark';
  };

  const getStatusIcon = (status) => {
    const icons = {
      scheduled: 'fa-calendar-check',
      upcoming: 'fa-clock',
      ongoing: 'fa-stethoscope',
      completed: 'fa-check-circle'
    };
    return icons[status] || 'fa-calendar';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <i className="fa-solid fa-user-xmark fa-4x text-muted mb-3"></i>
          <h4 className="text-muted">Authentication Required</h4>
          <p>Please log in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  const isAdmin = currentUser.email === "admin@gmail.com";

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />

      <div className="container-fluid py-3 py-md-4 bg-light min-vh-100">
        <div className="row mb-3 mb-md-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm bg-gradient bg-primary text-white">
              <div className="card-body p-3 p-md-4">
                <div className="row align-items-center g-3">
                  <div className="col-12 col-lg-8">
                    <div className="text-center text-lg-start">
                      <h2 className="fw-bold mb-2 fs-4 fs-md-3 fs-lg-2">
                        <i className="fa-solid fa-chart-line me-2"></i>
                        {isAdmin ? "Admin Dashboard" : "My Dashboard"}
                      </h2>
                      <p className="mb-2 opacity-75 fs-6 fs-md-5">
                        <i className="fa-solid fa-hand-wave me-1"></i>
                        Welcome back,
                        <span className="d-block d-sm-inline mt-1 mt-sm-0 ms-sm-1">
                          {currentUser.displayName || currentUser.email}
                        </span>
                      </p>
                      <small className="opacity-75 d-block d-sm-inline fs-7">
                        <i className="fa-solid fa-clock me-1"></i>
                        Last updated: {lastUpdate.toLocaleTimeString()}
                        {refreshing && (
                          <span className="ms-2 d-block d-sm-inline mt-1 mt-sm-0">
                            <i className="fa-solid fa-arrows-rotate fa-spin"></i> Updating...
                          </span>
                        )}
                      </small>
                    </div>
                  </div>

                  <div className="col-12 col-lg-4">
                    <div className="text-center text-lg-end">
                      <button
                        onClick={refreshData}
                        className="btn btn-light btn-sm px-3 py-2"
                        disabled={refreshing}
                      >
                        <i className={`fa-solid ${refreshing ? 'fa-arrows-rotate fa-spin' : 'fa-arrows-rotate'} me-2`}></i>
                        <span>Refresh Data</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="row mt-3 d-block d-lg-none">
                  <div className="col-12">
                    <div className="d-flex justify-content-around text-center py-2">
                      <div className="flex-fill">
                        <div className="fs-6 fw-bold">{analytics.total}</div>
                        <small className="opacity-75" style={{ fontSize: '0.7rem' }}>Total</small>
                      </div>
                      <div className="flex-fill border-start border-light border-opacity-25">
                        <div className="fs-6 fw-bold">{analytics.today}</div>
                        <small className="opacity-75" style={{ fontSize: '0.7rem' }}>Today</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3 mb-3 mb-md-4 d-none d-lg-block">
          <div className="col-12">
            <div className="row g-3 justify-content-center">
              <div className="col-lg-6 col-md-6">
                <div className="card border-0 shadow-sm analytics-card">
                  <div className="card-body text-center py-3">
                    <div className="text-primary fs-2 mb-2">
                      <i className="fa-solid fa-calendar-days"></i>
                    </div>
                    <h3 className="fw-bold text-primary mb-2 fs-4">{analytics.total}</h3>
                    <p className="text-muted mb-0 small">Total Appointments</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 col-md-6">
                <div className="card border-0 shadow-sm analytics-card">
                  <div className="card-body text-center py-3">
                    <div className="text-blue fs-2 mb-2">
                      <i className="fa-solid fa-calendar-day"></i>
                    </div>
                    <h3 className="fw-bold text-blue mb-2 fs-4">{analytics.today}</h3>
                    <p className="text-muted mb-0 small">Today's Appointments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-3 mb-md-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-3">
                <div className="row g-3 align-items-end">
                  {/* Sort Select */}
                  <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                    <label className="form-label text-muted small mb-2">
                      <i className="fa-solid fa-sort me-1"></i>
                      Sort By {sortedAppointments.length > 0 && `(${sortedAppointments.length} items)`}
                    </label>
                    <select
                      className="form-select form-select-sm"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="date">Sort By Date</option>
                      <option value="name">Sort By Name</option>
                      <option value="doctor">Sort By Doctor</option>
                    </select>
                  </div>

                  {/*  View Mode Buttons  */}
                  <div className="col-12 col-sm-6 col-md-2 col-lg-2 offset-md-5 offset-lg-6 d-none d-md-block">
                    <div className="d-flex justify-content-end">
                      <div className="btn-group" role="group">
                        <button
                          type="button"
                          className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`}
                          onClick={() => setViewMode('grid')}
                          title="Grid View"
                        >
                          <i className="fa-solid fa-grip me-1"></i>
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`}
                          onClick={() => setViewMode('list')}
                          title="List View"
                        >
                          <i className="fa-solid fa-bars me-1"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {sortedAppointments.length === 0 ? (
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-4 py-md-5">
              <i className="fa-solid fa-calendar-xmark fa-3x fa-md-4x text-muted mb-3 mb-md-4"></i>
              <h4 className="text-muted mb-3 fs-5 fs-md-4">No appointments found</h4>
              <p className="text-muted mb-0">You don't have any appointments yet</p>
            </div>
          </div>
        ) : (
          <div className={`row g-3 g-md-4 ${viewMode === 'list' ? 'row-cols-1' : 'row-cols-1 row-cols-md-2 row-cols-xl-3'}`}>
            {sortedAppointments.map((appointment, index) => (
              <div className="col" key={appointment._id}>
                <div className="card border-0 shadow-sm h-100 hover-card">
                  <div className="card-header bg-white border-0 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center py-3 gap-2 gap-sm-0">
                    <div className="flex-grow-1">
                      <h6 className="fw-bold text-primary mb-0 fs-6">
                        <i className="fa-solid fa-user-doctor me-2"></i>
                        {appointment.doctorName || "Dr. Not Assigned"}
                        <small className="text-muted ms-2">#{index + 1}</small>
                      </h6>
                    </div>
                    <span className={`badge ${getStatusBadge(appointment.status)} text-capitalize d-flex align-items-center flex-shrink-0`}>
                      <i className={`fa-solid ${getStatusIcon(appointment.status)} me-1`}></i>
                      {appointment.status}
                    </span>
                  </div>

                  <div className="card-body py-3">
                    <div className="row g-2 g-md-3 mb-3">
                      <div className="col-12">
                        <div className="d-flex align-items-center mb-2">
                          <i className="fa-solid fa-child me-2 text-primary flex-shrink-0"></i>
                          <span className="fw-semibold me-1">Patient:</span>
                          <span className="text-truncate">{`${appointment.childName} (${appointment.childAge} yrs)`}</span>
                        </div>
                      </div>

                      <div className="col-12 col-sm-6">
                        <div className="d-flex align-items-center">
                          <i className="fa-solid fa-phone me-2 text-primary flex-shrink-0"></i>
                          <span className="fw-semibold me-1">Phone:</span>
                          <span className="text-truncate">{appointment.phone}</span>
                        </div>
                      </div>

                      <div className="col-12 col-sm-6">
                        <div className="d-flex align-items-center">
                          <i className="fa-solid fa-calendar-alt me-2 text-primary flex-shrink-0"></i>
                          <span className="fw-semibold me-1">Date:</span>
                          <span className="small fw-medium">{appointment.date}</span>
                        </div>
                      </div>

                      <div className="col-12 col-sm-6">
                        <div className="d-flex align-items-center">
                          <i className="fa-solid fa-clock me-2 text-primary flex-shrink-0"></i>
                          <span className="fw-semibold me-1">Time:</span>
                          <span className="small fw-medium">{appointment.time}</span>
                        </div>
                      </div>
                    </div>

                    {appointment.issue && (
                      <div className="mb-3">
                        <div className="d-flex align-items-start">
                          <i className="fa-solid fa-file-medical me-2 text-primary mt-1 flex-shrink-0"></i>
                          <div className="flex-grow-1">
                            <span className="fw-semibold">Issue:</span>
                            <span className="text-muted ms-1 d-block d-sm-inline">{appointment.issue}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="card-footer bg-light border-0 py-3">
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 gap-sm-0">
                      <small className="text-muted d-flex align-items-center">
                        <i className="fa-solid fa-hashtag me-1"></i>
                        ID: {appointment._id.slice(-6).toUpperCase()}
                      </small>
                      <button
                        onClick={() => deleteHandler(appointment._id)}
                        className="btn btn-outline-danger btn-sm flex-shrink-0"
                        disabled={appointment.status === 'completed'}
                      >
                        <i className="fa-solid fa-xmark me-1"></i>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </>
  );
}
