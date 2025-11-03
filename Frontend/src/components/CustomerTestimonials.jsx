import React from 'react';
import './CustomerTestimonials.css'

const CustomerTestimonials = () => {
    const testimonials = [
        {
            id: 1,
            name: "Mrs. Priya Verma",
            location: "Mumbai, Maharashtra",
            rating: 5,
            childAge: "3 years",
            testimonial: "Dr. Priya Sharma provided excellent care for my daughter's vaccination. The online booking system is very convenient and the staff is professional.",
            doctorVisited: "Dr. Priya Sharma",
            visitType: "Vaccination"
        },
        {
            id: 2,
            name: "Mr. Rajesh Patel",
            location: "Bangalore, Karnataka",
            rating: 5,
            childAge: "6 months",
            testimonial: "Outstanding neonatal care provided by Dr. Rajesh Kumar. The medical facilities are top-notch and the staff is highly trained and caring.",
            doctorVisited: "Dr. Rajesh Kumar",
            visitType: "Neonatal Care"
        },
        {
            id: 3,
            name: "Mrs. Sneha Reddy",
            location: "Hyderabad, Telangana",
            rating: 5,
            childAge: "8 years",
            testimonial: "Dr. Arjun Reddy's expertise in child psychology helped address my son's behavioral concerns effectively. Professional and patient approach.",
            doctorVisited: "Dr. Arjun Reddy",
            visitType: "Child Psychology"
        },
        {
            id: 4,
            name: "Mr. Kavita Singh",
            location: "Delhi, NCR",
            rating: 5,
            childAge: "5 years",
            testimonial: "The pediatric surgery was successful with excellent pre and post-operative care. Dr. Kavitha Menon is highly skilled and professional.",
            doctorVisited: "Dr. Kavitha Menon",
            visitType: "Pediatric Surgery"
        },
        {
            id: 5,
            name: "Mr. Amit Sharma",
            location: "Pune, Maharashtra",
            rating: 4,
            childAge: "2 years",
            testimonial: "Comprehensive health checkup with detailed explanation. Clean facilities, experienced doctors, and efficient appointment system.",
            doctorVisited: "Dr. Priya Sharma",
            visitType: "Health Checkup"
        },
        {
            id: 6,
            name: "Mrs. Deepika Nair",
            location: "Chennai, Tamil Nadu",
            rating: 5,
            childAge: "1 year",
            testimonial: "Excellent newborn care services. Knowledgeable doctors and supportive nursing staff. Highly recommend KidCare for pediatric needs.",
            doctorVisited: "Dr. Rajesh Kumar",
            visitType: "Newborn Care"
        }
    ];

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <i
                    key={i}
                    className={`fa${i < rating ? 's' : 'r'} fa-star ${i < rating ? 'text-warning' : 'text-muted'} small me-1`}
                ></i>
            );
        }
        return stars;
    };

    const TestimonialCard = ({ testimonial }) => (
        <div className="h-100 px-2">
            <div className="card h-100 border-0 shadow-sm rounded-3">
                <div className="card-body p-3 p-md-4">
                    <div className="mb-3 text-center">
                        <div className="mb-2">
                            {renderStars(testimonial.rating)}
                        </div>
                        <small className="text-muted">
                            <i className="fas fa-check-circle text-success me-1"></i>
                            Verified Patient Review
                        </small>
                    </div>

                    <div className="mb-4">
                        <p className="text-muted mb-0 lh-lg" style={{ fontSize: '0.9rem' }}>
                            <i className="fas fa-quote-left text-primary me-2"></i>
                            {testimonial.testimonial}
                        </p>
                    </div>

                    <div className="border-top pt-3">
                        <h6 className="mb-2 text-dark fw-semibold">
                            {testimonial.name}
                        </h6>
                        <p className="mb-1 small text-muted">
                            <i className="fas fa-map-marker-alt me-1 text-danger"></i>
                            {testimonial.location}
                        </p>
                        <p className="mb-3 small text-muted">
                            <i className="fas fa-child me-1 text-info"></i>
                            Child Age: {testimonial.childAge}
                        </p>

                        <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                            <small className="text-primary fw-medium flex-grow-1">
                                <i className="fas fa-user-md me-1"></i>
                                {testimonial.doctorVisited}
                            </small>
                            <span className="badge bg-light text-dark border border-secondary">
                                {testimonial.visitType}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <section className="mb-4 mb-md-5" id="testimonials-section">
            <div className="container">
                <div className="row mb-2">
                    <div className="col-12 text-center">
                        <h2 className="display-6 fw-bold text-dark mb-3">Patient Reviews</h2>
                        <p className="lead text-muted mb-3 mx-auto" style={{ maxWidth: '600px' }}>
                            Feedback from families who have experienced our pediatric care services
                        </p>
                    </div>
                </div>

                {/* Large Devices Carousel - 3 cards */}
                <div className="d-none d-lg-block position-relative">
                    <div id="testimonialsCarouselLg" className="carousel slide" data-bs-ride="carousel" data-bs-interval="5000">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <div className="row g-4">
                                    <div className="col-lg-4">
                                        <TestimonialCard testimonial={testimonials[0]} />
                                    </div>
                                    <div className="col-lg-4">
                                        <TestimonialCard testimonial={testimonials[1]} />
                                    </div>
                                    <div className="col-lg-4">
                                        <TestimonialCard testimonial={testimonials[2]} />
                                    </div>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <div className="row g-4">
                                    <div className="col-lg-4">
                                        <TestimonialCard testimonial={testimonials[3]} />
                                    </div>
                                    <div className="col-lg-4">
                                        <TestimonialCard testimonial={testimonials[4]} />
                                    </div>
                                    <div className="col-lg-4">
                                        <TestimonialCard testimonial={testimonials[5]} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="carousel-control-prev position-absolute top-50 start-0 translate-middle-y opacity-100" type="button" data-bs-target="#testimonialsCarouselLg" data-bs-slide="prev" style={{ left: '-60px', width: 'auto', zIndex: 5 }}>
                            <div className=" rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: '50px', height: '50px' , background: 'linear-gradient(135deg, #ee0d0d, #b60505)'}}>
                                <i className="fas fa-chevron-left text-white"></i>
                            </div>
                        </button>
                        <button className="carousel-control-next position-absolute top-50 end-0 translate-middle-y opacity-100" type="button" data-bs-target="#testimonialsCarouselLg" data-bs-slide="next" style={{ right: '-60px', width: 'auto', zIndex: 5 }}>
                            <div className=" rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #ee0d0d, #b60505)' }}>
                                <i className="fas fa-chevron-right text-white"></i>
                            </div>
                        </button>

                        <div className="carousel-indicators position-relative mt-4 mb-0">
                            <button type="button" data-bs-target="#testimonialsCarouselLg" data-bs-slide-to="0" className="active bg-danger rounded-circle border-0" style={{ width: '12px', height: '12px' }}></button>
                            <button type="button" data-bs-target="#testimonialsCarouselLg" data-bs-slide-to="1" className="bg-secondary rounded-circle border-0" style={{ width: '12px', height: '12px' }}></button>
                        </div>
                    </div>
                </div>

                <div className="d-none d-md-block d-lg-none position-relative">
                    <div id="testimonialsCarouselMd" className="carousel slide" data-bs-ride="carousel" data-bs-interval="5000">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <TestimonialCard testimonial={testimonials[0]} />
                                    </div>
                                    <div className="col-md-6">
                                        <TestimonialCard testimonial={testimonials[1]} />
                                    </div>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <TestimonialCard testimonial={testimonials[2]} />
                                    </div>
                                    <div className="col-md-6">
                                        <TestimonialCard testimonial={testimonials[3]} />
                                    </div>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <TestimonialCard testimonial={testimonials[4]} />
                                    </div>
                                    <div className="col-md-6">
                                        <TestimonialCard testimonial={testimonials[5]} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="carousel-control-prev position-absolute top-50 start-0 translate-middle-y opacity-100" type="button" data-bs-target="#testimonialsCarouselMd" data-bs-slide="prev" style={{ left: '-50px', width: 'auto', zIndex: 5 }}>
                            <div className=" rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: '45px', height: '45px', background: 'linear-gradient(135deg, #ee0d0d, #b60505)' }}>
                                <i className="fas fa-chevron-left text-white"></i>
                            </div>
                        </button>
                        <button className="carousel-control-next position-absolute top-50 end-0 translate-middle-y opacity-100" type="button" data-bs-target="#testimonialsCarouselMd" data-bs-slide="next" style={{ right: '-50px', width: 'auto', zIndex: 5 }}>
                            <div className=" rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: '45px', height: '45px' , background: 'linear-gradient(135deg, #ee0d0d, #b60505)'}}>
                                <i className="fas fa-chevron-right text-white"></i>
                            </div>
                        </button>

                        <div className="carousel-indicators position-relative mt-4 mb-0">
                            <button type="button" data-bs-target="#testimonialsCarouselMd" data-bs-slide-to="0" className="active bg-danger rounded-circle border-0" style={{ width: '12px', height: '12px' }}></button>
                            <button type="button" data-bs-target="#testimonialsCarouselMd" data-bs-slide-to="1" className="bg-secondary rounded-circle border-0" style={{ width: '12px', height: '12px' }}></button>
                            <button type="button" data-bs-target="#testimonialsCarouselMd" data-bs-slide-to="2" className="bg-secondary rounded-circle border-0" style={{ width: '12px', height: '12px' }}></button>
                        </div>
                    </div>
                </div>

                <div className="d-block d-md-none">
                    <div className="position-relative">
                        <div id="testimonialsCarouselSm" className="carousel slide" data-bs-ride="carousel" data-bs-interval="4000" data-bs-pause="hover" data-bs-keyboard="true" data-bs-touch="true">
                            <div className="carousel-inner">
                                {testimonials.map((testimonial, index) => (
                                    <div key={testimonial.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                        <div className="row justify-content-center">
                                            <div className="col-11">
                                                <TestimonialCard testimonial={testimonial} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="carousel-control-prev position-absolute top-50 translate-middle-y opacity-100 border-0 bg-transparent" type="button" data-bs-target="#testimonialsCarouselSm" data-bs-slide="prev" style={{ left: '-25px', width: '50px', zIndex: 10 }}>
                                <div className="rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: '40px', height: '40px' , background: 'linear-gradient(135deg, #ee0d0d, #b60505)' }}>
                                    <i className="fas fa-chevron-left text-white"></i>
                                </div>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next position-absolute top-50 translate-middle-y opacity-100 border-0 bg-transparent" type="button" data-bs-target="#testimonialsCarouselSm" data-bs-slide="next" style={{ right: '-25px', width: '50px', zIndex: 10 }}>
                                <div className=" rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #ee0d0d, #b60505)' }}>
                                    <i className="fas fa-chevron-right text-white"></i>
                                </div>
                                <span className="visually-hidden">Next</span>
                            </button>

                            <div className="carousel-indicators position-relative mt-4 mb-0 d-flex justify-content-center gap-2">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        data-bs-target="#testimonialsCarouselSm"
                                        data-bs-slide-to={index}
                                        className={`${index === 0 ? 'active bg-danger' : 'bg-secondary opacity-50'} rounded-circle border-0`}
                                        style={{ width: '10px', height: '10px' }}
                                        aria-label={`Slide ${index + 1}`}
                                    ></button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-4 mt-md-4 mt-lg-5">
                    <div className="col-12">
                        <div className="text-white rounded-4 p-4 mx-auto text-center" style={{ 
                            background: "linear-gradient(135deg, #ee0d0d, #b60505)", 
                            maxWidth: '800px' 
                        }}>
                            <h5 className="mb-3 fw-bold">Schedule Your Child's Appointment</h5>
                            <p className="mb-4 opacity-75">
                                Experience professional pediatric care with our qualified specialists
                            </p>
                            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                                <a className="btn btn-light d-none d-md-inline btn-lg px-4 fw-medium rounded-pill" href='#Appointment-Form'>
                                    Book Appointment
                                </a>
                                <a className="btn btn-light px-4  d-inline d-md-none fw-medium rounded-pill" href='#Appointment-Form'>
                                    Book Appointment
                                </a>
                               
                                <a className="btn btn-outline-light  d-none d-md-inline btn-lg px-4 fw-medium rounded-pill" href='tel:9150739154'>
                                    <i className="fas fa-phone me-2"></i>
                                    Contact Us
                                </a>
                                <a className="btn btn-outline-light  d-inline d-md-none px-4 fw-medium rounded-pill" href='tel:9150739154'>
                                    <i className="fas fa-phone me-2"></i>
                                    Contact Us
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CustomerTestimonials;
