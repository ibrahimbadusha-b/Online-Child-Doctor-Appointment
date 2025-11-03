import React, { useEffect, useState } from "react";
import { auth } from "../config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";


export default function DashBoard() {
  const user=auth.currentUser;
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        let url="";
        
        if (user.email === "admin@gmail.com") {
           url = "https://online-child-doctor-appointment-bk.vercel.app/api/users/getUsersData";
        } else {          
           url = `https://online-child-doctor-appointment-bk.vercel.app/api/users/singleUserData/${user.email}`
        }
        const res=await fetch(url)
        const data = await res.json();
        setAppointments(data.userDatas || []);
      } catch (err) {
        console.log(err);

      }
    }

    getAllUsers();

  }, [])

  const deleteHandler=async (id)=>{
   await fetch(`https://online-child-doctor-appointment-bk.vercel.app/api/users/cancelAppointment/${id}`,{
    headers:{"Content-Type":"application/json"},
    method:"DELETE"
   })

   setAppointments((pre)=>(pre.filter((user)=>user._id !==id)))
  }

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4 text-center fw-bold">User Dashboard</h1>

      {appointments.length === 0 ? (
        <div className="text-center text-muted">No appointments found.</div>
      ) : (
        appointments.map((user) => (
          <div className="card mb-4 shadow-sm w-100v rounded" key={user._id}>
            <div className="card-body">
              {/* Email */}
              <div className="mb-3">
                <span className="fw-semibold">Email: </span>
                <span>{user.authEmail}</span>
              </div>

              <div className="row mb-3">
                <div className="col-md-3 col-6">
                  <span className="fw-semibold">Doctor:</span> {user.doctorName}
                </div>
                <div className="col-md-2 col-6">
                  <span className="fw-semibold">Date:</span> {user.date}
                </div>
                <div className="col-md-2 col-6">
                  <span className="fw-semibold">Time:</span> {user.time}
                </div>
                <div className="col-md-2 col-6">
                  <span className="fw-semibold">Child:</span> {user.childName}
                </div>
                <div className="col-md-1 col-6">
                  <span className="fw-semibold">Age:</span> {user.childAge}
                </div>
                <div className="col-md-2 col-6">
                  <span className="fw-semibold">Phone:</span> {user.phone}
                </div>

              </div>

              {/* Issue field */}
              <div className="mb-3">
                <span className="fw-semibold">Issue: </span> {user.issue}
                <span></span>
              </div>

              {/* Cancel button */}
              <div className="text-end">
                <button className="btn btn-outline-danger btn-sm" onClick={()=>deleteHandler(user._id)}> 
                  Cancel Appointment
                </button>
              </div>
            </div>
          </div>

        ))

      )}
    </div>
  );
}
