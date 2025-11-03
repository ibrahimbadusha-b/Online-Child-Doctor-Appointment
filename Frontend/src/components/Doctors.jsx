import React from 'react'
import './Doctor.css'

const Doctors = () => {
    const doctors = [
        {
            "id": 1,
            "name": "Dr. Priya Sharma",
            "specialization": "Pediatrician",
            "days": "Mon–Fri",
            "timing": "8:00 AM - 5:00 PM",
            "image": "/images/women1.png",
            "experience": "12+ years",
            "education": "MBBS, MD Pediatrics, DM Neonatology",
            "specialties": ["General Child Care", "Vaccination", "Growth Monitoring"],
            "languages": ["Hindi", "English", "Punjabi"],
        },
        {
            "id": 2,
            "name": "Dr. Rajesh Kumar",
            "specialization": "Neonatologist",
            "days": "Mon–Fri",
            "timing": "8:00 AM - 6:00 PM",
            "image": "/images/men1.png",
            "experience": "5+ years",
            "education": "MBBS, MD Pediatrics, DM Neonatology",
            "specialties": ["Newborn Care", "NICU Management", "Premature Babies"],
            "languages": ["Tamil", "English", "Hindi"],
        },
        {
            "id": 3,
            "name": "Dr. Kavitha Menon",
            "specialization": "Pediatric Surgeon",
            "days": "Mon–Fri",
            "timing": "9:00 AM - 4:00 PM",
            "image": "/images/women2.png",
            "experience": "8+ years",
            "education": "MBBS, MS Surgery, MCh Pediatric Surgery",
            "specialties": ["Pediatric Surgery", "Hernia Repair", "Congenital Defects"],
            "languages": ["Marathi", "Hindi", "English"],
        },
        {
            "id": 4,
            "name": "Dr. Arjun Reddy",
            "specialization": "Child Psychologist",
            "days": "Mon–Fri",
            "timing": "10:00 AM - 6:00 PM",
            "image": "/images/men2.png",
            "experience": "10+ years",
            "education": "MBBS, MD Psychiatry, Fellowship Child Psychology",
            "specialties": ["Behavioral Issues", "ADHD Treatment", "Child Counseling"],
            "languages": ["Telugu", "Tamil", "English", "Hindi"],
        }
    ];

    const timeSlots = [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
        "11:00 AM", "11:30 AM", "04:00 PM", "04:30 PM",
        "05:00 PM", "05:30 PM"
    ];

    const handleBookAppointment = (doctor) => {
        console.log(`Booking appointment with ${doctor.name}`);
    };

    const DoctorCard = ({ doctor }) => (
        <div className="col-lg-4 col-md-6 col-sm-12 mb-3 mb-lg-0">
            <div className="card h-100 " id='doctor-card'>
                <div className="position-relative">
                    <img
                        className="card-img-top doctor-image"
                        src={doctor.image}
                        alt={`${doctor.name}`}
                        style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div
                        className="position-absolute top-0 start-0 text-white p-2 rounded"
                        style={{
                            background: `linear-gradient(135deg, #ee0d0d, #b60505)`,
                            width: '40%',
                            margin: '5px'
                        }}
                    >
                        <h6 className="mb-1 fw-bold" style={{ fontSize: '0.85rem', lineHeight: '1.2' }}>
                            {doctor.name}
                        </h6>
                        <p className="mb-0" style={{ fontSize: '0.5rem', lineHeight: '1.1' }}>
                            {doctor.education}
                        </p>
                    </div>
                </div>

                <div className="card-body d-flex flex-column">
                    <div className="row">
                        <div className="col-6">
                            <div className="role">
                                <p className='text-danger fw-bolder mb-1'>{doctor.specialization}</p>
                                <p className='text-muted small'><strong>{doctor.experience} Experience</strong> </p>
                            </div>
                        </div>
                        
                    </div>
                    <div className="mb-2">
                        <p className="small mb-1">
                            <strong>Available:</strong> <span className='me-2'>{doctor.days}</span> {doctor.timing}
                        </p>
                    </div>

                    <div className="mb-3">

                        <div className="d-flex flex-wrap gap-1">
                            <span className="small mb-2"><strong>Specialties:</strong></span>
                            {doctor.specialties.map((specialty, index) => (
                                <span key={index} className=" bg-light text-muted small">
                                    {specialty} ,
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6 ">
                            <a
                                className='btn btn-sm '
                                href='#Appointment-Form'
                                style={{ background: 'linear-gradient(135deg, #ee0d0d, #b60505)', color: "white" }}
                            >
                                Book Appointment
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );

    return (
        <div className='container mt-4 mt-md-5' id='doctor-section'>
            <div className="row">
                <div className="col-12">
                    <h2 className="text-center display-6 fw-bold text-dark mb-3">Our Expert Doctors</h2>
                    <p className="text-center lead text-muted mb-4 mb-md-5">
                        Meet our experienced pediatric specialists dedicated to your child's health and well-being
                    </p>
                </div>
            </div>

            <div className="row">
                {doctors.slice(0, 3).map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
            </div>

            {/*  <div className="row mt-5">
                <div className="col-12">
                    <h4 className="mb-3">Available Time Slots</h4>
                    <div className="d-flex flex-wrap gap-2">
                        {timeSlots.map((slot, index) => (
                            <span key={index} className="badge bg-outline-primary border border-primary text-primary p-2">
                                {slot}
                            </span>
                        ))}
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default Doctors
