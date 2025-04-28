import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLeaf,
  faRecycle,
  faHandHoldingHeart,
  faChartLine,
  faUsers,
  faShieldAlt,
  faArrowRight,
  faChevronLeft,
  faChevronRight,
  faQuoteLeft,
  faEnvelope,
  faPhone,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import MainNavbar from './MainNavbar';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({
    products: 0,
    customers: 0,
    satisfaction: 0,
    sustainability: 0
  });

  const slides = [
    {
      image: '/1.jpg',
      title: 'Sustainable Solutions',
      subtitle: 'For a Greener Tomorrow'
    },
    {
      image: '/2.jpg',
      title: 'Quality Products',
      subtitle: 'From Nature to You'
    },
    {
      image: '/3.jpg',
      title: 'Eco-Friendly',
      subtitle: 'Making a Difference'
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Environmental Advocate",
      text: "GreenCoco's commitment to sustainability is unmatched. Their products are not only eco-friendly but also of the highest quality.",
      initials: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Business Owner",
      text: "Working with GreenCoco has transformed our supply chain. Their efficient system and reliable service make them an invaluable partner.",
      initials: "MC"
    },
    {
      name: "Emma Davis",
      role: "Sustainability Director",
      text: "The impact GreenCoco has had on our environmental initiatives is remarkable. They're leading the way in sustainable practices.",
      initials: "ED"
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [slides.length]);

  // Stats animation
  useEffect(() => {
    const targetStats = {
      products: 150,
      customers: 2000,
      satisfaction: 98,
      sustainability: 85
    };

    const duration = 2000; // 2 seconds
    const steps = 50;
    const interval = duration / steps;

    const animateStats = () => {
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setAnimatedStats({
          products: Math.round(targetStats.products * progress),
          customers: Math.round(targetStats.customers * progress),
          satisfaction: Math.round(targetStats.satisfaction * progress),
          sustainability: Math.round(targetStats.sustainability * progress)
        });

        if (currentStep === steps) {
          clearInterval(timer);
        }
      }, interval);
    };

    // Start animation when element is in view
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateStats();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => observer.disconnect();
  }, []);

  const goToPreviousSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

    .home-page {
      font-family: 'Poppins', sans-serif;
      background: linear-gradient(135deg, #f5f7fa 0%, #e6f0ea 100%);
      min-height: 100vh;
      overflow-x: hidden;
    }

    /* Hero Section Styles */
    .hero-section {
      position: relative;
      height: 90vh;
      overflow: hidden;
      background: #1a1a1a;
    }

    .slider-container {
      height: 100%;
      position: relative;
    }

    .slide {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      transition: opacity 0.5s ease-in-out;
    }

    .slide.active {
      opacity: 1;
    }

    .slide img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(0.7);
    }

    .slide-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: white;
      z-index: 2;
      width: 90%;
      max-width: 800px;
    }

    .slide-title {
      font-size: 4rem;
      font-weight: 700;
      margin-bottom: 1rem;
      opacity: 0;
      transform: translateY(20px);
      animation: fadeInUp 0.5s forwards;
    }

    .slide-subtitle {
      font-size: 1.5rem;
      font-weight: 400;
      margin-bottom: 2rem;
      opacity: 0;
      transform: translateY(20px);
      animation: fadeInUp 0.5s 0.2s forwards;
    }

    .slider-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: none;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      z-index: 2;
    }

    .slider-nav:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-50%) scale(1.1);
    }

    .prev {
      left: 20px;
    }

    .next {
      right: 20px;
    }

    .slider-dots {
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 12px;
      z-index: 2;
    }

    .dot {
      width: 12px;
      height: 12px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .dot:hover {
      transform: scale(1.2);
    }

    .dot.active {
      background: #ffffff;
      transform: scale(1.2);
    }

    /* Features Section */
    .features-section {
      padding: 100px 0;
      background: white;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .feature-card {
      background: white;
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      text-align: center;
    }

    .feature-card:hover {
      transform: translateY(-10px);
    }

    .feature-icon {
      font-size: 2.5rem;
      color: #2ecc71;
      margin-bottom: 20px;
    }

    .feature-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #2a7458;
      margin-bottom: 15px;
    }

    .feature-description {
      color: #666;
      line-height: 1.6;
    }

    /* Stats Section */
    .stats-section {
      background: linear-gradient(135deg, #2a7458 0%, #3b9c73 100%);
      padding: 80px 20px;
      color: white;
      text-align: center;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 40px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .stat-card {
      padding: 20px;
    }

    .stat-number {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .stat-label {
      font-size: 1.1rem;
      opacity: 0.9;
    }

    /* Testimonials Section */
    .testimonials-section {
      padding: 100px 0;
      background: linear-gradient(135deg, #f5f7fa 0%, #e6f0ea 100%);
      position: relative;
      overflow: hidden;
    }

    .testimonials-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100%;
      background: linear-gradient(45deg, rgba(46, 204, 113, 0.05) 0%, rgba(39, 174, 96, 0.05) 100%);
      transform: skewY(-6deg);
      transform-origin: top left;
    }

    .testimonial-card {
      background: white;
      padding: 30px;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      position: relative;
      z-index: 1;
    }

    .testimonial-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(46, 204, 113, 0.15);
    }

    .quote-icon {
      font-size: 2rem;
      color: #2ecc71;
      opacity: 0.2;
      margin-bottom: 15px;
    }

    .testimonial-quote {
      font-size: 1.1rem;
      color: #555;
      margin-bottom: 20px;
      line-height: 1.6;
    }

    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .testimonial-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .author-info h4 {
      margin: 0;
      color: #333;
      font-size: 1.1rem;
    }

    .author-info p {
      margin: 5px 0 0;
      color: #666;
      font-size: 0.9rem;
    }

    /* Contact Section */
    .contact-section {
      padding: 100px 0;
      background: white;
      position: relative;
    }

    .contact-section::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 30%;
      background: linear-gradient(135deg, rgba(46, 204, 113, 0.05) 0%, rgba(39, 174, 96, 0.05) 100%);
    }

    .contact-info {
      background: white;
      padding: 30px;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      position: relative;
      z-index: 1;
    }

    .contact-info:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(46, 204, 113, 0.15);
    }

    .contact-icon {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.2rem;
      margin-right: 20px;
      transition: all 0.3s ease;
    }

    .contact-info:hover .contact-icon {
      transform: scale(1.1);
    }

    .contact-info h4 {
      color: #333;
      font-size: 1.2rem;
      margin: 0 0 5px 0;
    }

    .contact-info p {
      color: #666;
      margin: 0;
      font-size: 1rem;
    }

    .section-title {
      text-align: center;
      font-size: 2.5rem;
      color: #333;
      margin-bottom: 50px;
    }

    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .slide-title {
        font-size: 2.5rem;
      }

      .slide-subtitle {
        font-size: 1.2rem;
      }

      .section-title {
        font-size: 2rem;
      }
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      position: relative;
      z-index: 1;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      position: relative;
      z-index: 1;
    }

    .cta-button {
      display: inline-block;
      padding: 16px 36px;
      font-size: 1.25rem;
      font-weight: 700;
      color: #fff;
      background: linear-gradient(90deg, #2ecc71 0%, #27ae60 100%);
      border: none;
      border-radius: 32px;
      box-shadow: 0 4px 20px rgba(46, 204, 113, 0.15);
      text-decoration: none;
      transition: background 0.3s, transform 0.2s, box-shadow 0.3s;
      margin-top: 20px;
      letter-spacing: 1px;
      position: relative;
      overflow: hidden;
    }
    .cta-button:hover, .cta-button:focus {
      background: linear-gradient(90deg, #27ae60 0%, #2ecc71 100%);
      color: #fff;
      transform: translateY(-3px) scale(1.04);
      box-shadow: 0 8px 32px rgba(46, 204, 113, 0.25);
      text-decoration: none;
    }
    .cta-button svg {
      margin-left: 12px;
      font-size: 1.1em;
      vertical-align: middle;
      transition: transform 0.2s;
    }
    .cta-button:hover svg {
      transform: translateX(4px) scale(1.1);
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <MainNavbar />
      <div className="home-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="slider-container">
            {slides.map((slide, index) => (
              <div key={index} className={`slide ${index === currentSlide ? 'active' : ''}`}>
                <img src={slide.image} alt={slide.title} />
                <div className="slide-content">
                  <h1 className="slide-title">{slide.title}</h1>
                  <p className="slide-subtitle">{slide.subtitle}</p>
                  <Link to="/register" className="cta-button">
                    Get Started <FontAwesomeIcon icon={faArrowRight} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <button className="slider-nav prev" onClick={goToPreviousSlide}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button className="slider-nav next" onClick={goToNextSlide}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
          <div className="slider-dots">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="section-title">Why Choose GreenCoco</h2>
          <div className="features-grid">
            <div className="feature-card">
              <FontAwesomeIcon icon={faLeaf} className="feature-icon" />
              <h3>Eco-Friendly</h3>
              <p>Committed to sustainable practices and environmental conservation</p>
            </div>
            <div className="feature-card">
              <FontAwesomeIcon icon={faRecycle} className="feature-icon" />
              <h3>Sustainable</h3>
              <p>Using renewable resources and minimizing environmental impact</p>
            </div>
            <div className="feature-card">
              <FontAwesomeIcon icon={faHandHoldingHeart} className="feature-icon" />
              <h3>Quality</h3>
              <p>Premium products that meet the highest standards</p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{animatedStats.products}+</h3>
              <p>Products</p>
            </div>
            <div className="stat-card">
              <h3>{animatedStats.customers}+</h3>
              <p>Happy Customers</p>
            </div>
            <div className="stat-card">
              <h3>{animatedStats.satisfaction}%</h3>
              <p>Satisfaction Rate</p>
            </div>
            <div className="stat-card">
              <h3>{animatedStats.sustainability}%</h3>
              <p>Sustainability Score</p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <h2 className="section-title">What Our Clients Say</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <FontAwesomeIcon icon={faQuoteLeft} className="quote-icon" />
                <p className="testimonial-quote">{testimonial.text}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">
                    {testimonial.initials}
                  </div>
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <h2 className="section-title">Get in Touch</h2>
          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <div>
                <h4>Email</h4>
                <p>info@greencoco.com</p>
              </div>
            </div>
            <div className="contact-info">
              <div className="contact-icon">
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <div>
                <h4>Phone</h4>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="contact-info">
              <div className="contact-icon">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </div>
              <div>
                <h4>Location</h4>
                <p>123 Green Street, Eco City</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;