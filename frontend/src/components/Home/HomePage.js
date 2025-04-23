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
      padding: 80px 20px;
      background: white;
    }

    .section-title {
      text-align: center;
      font-size: 2.5rem;
      font-weight: 600;
      color: #2a7458;
      margin-bottom: 50px;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 30px;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .feature-card {
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      text-align: center;
      transition: all 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 40px rgba(42, 116, 88, 0.2);
    }

    .feature-icon {
      font-size: 2.5rem;
      color: #2a7458;
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

    /* Why Choose Us Section */
    .why-choose-section {
      padding: 80px 20px;
      background: #f8f9fa;
    }

    .reasons-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .reason-card {
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: flex-start;
      gap: 20px;
      transition: all 0.3s ease;
    }

    .reason-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(42, 116, 88, 0.15);
    }

    .reason-icon {
      font-size: 2rem;
      color: #2a7458;
      flex-shrink: 0;
    }

    .reason-content h3 {
      font-size: 1.3rem;
      font-weight: 600;
      color: #2a7458;
      margin-bottom: 10px;
    }

    .reason-content p {
      color: #666;
      line-height: 1.6;
      margin: 0;
    }

    /* CTA Section */
    .cta-section {
      padding: 100px 20px;
      background: linear-gradient(135deg, #2a7458 0%, #3b9c73 100%);
      text-align: center;
      color: white;
    }

    .cta-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .cta-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 20px;
    }

    .cta-description {
      font-size: 1.2rem;
      margin-bottom: 40px;
      opacity: 0.9;
    }

    .cta-button {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: white;
      color: #2a7458;
      padding: 15px 40px;
      border-radius: 30px;
      font-size: 1.1rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .cta-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
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

      .feature-card {
        padding: 20px;
      }

      .stat-number {
        font-size: 2.5rem;
      }

      .cta-title {
        font-size: 2rem;
      }

      .cta-description {
        font-size: 1.1rem;
      }
    }

    @media (max-width: 480px) {
      .slide-title {
        font-size: 2rem;
      }

      .slide-subtitle {
        font-size: 1rem;
      }

      .section-title {
        font-size: 1.8rem;
      }

      .feature-card {
        padding: 15px;
      }

      .stat-number {
        font-size: 2rem;
      }

      .cta-title {
        font-size: 1.8rem;
      }

      .cta-description {
        font-size: 1rem;
      }

      .cta-button {
        padding: 12px 30px;
        font-size: 1rem;
      }
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
                <img src={slide.image} alt={`Slide ${index + 1}`} />
                <div className="slide-content">
                  <h1 className="slide-title">{slide.title}</h1>
                  <p className="slide-subtitle">{slide.subtitle}</p>
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
                className={`dot ${currentSlide === index ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="section-title">Our Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <FontAwesomeIcon icon={faLeaf} className="feature-icon" />
              <h3 className="feature-title">Eco-Friendly</h3>
              <p className="feature-description">
                Committed to sustainable practices and environmental conservation
              </p>
            </div>
            <div className="feature-card">
              <FontAwesomeIcon icon={faRecycle} className="feature-icon" />
              <h3 className="feature-title">Sustainable</h3>
              <p className="feature-description">
                Promoting recycling and responsible resource management
              </p>
            </div>
            <div className="feature-card">
              <FontAwesomeIcon icon={faHandHoldingHeart} className="feature-icon" />
              <h3 className="feature-title">Quality Care</h3>
              <p className="feature-description">
                Dedicated to providing the highest quality products and service
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{animatedStats.products}+</div>
              <div className="stat-label">Products</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{animatedStats.customers}+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{animatedStats.satisfaction}%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{animatedStats.sustainability}%</div>
              <div className="stat-label">Sustainability Score</div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="why-choose-section">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="reasons-grid">
            <div className="reason-card">
              <FontAwesomeIcon icon={faChartLine} className="reason-icon" />
              <div className="reason-content">
                <h3>Growth Focus</h3>
                <p>Committed to continuous improvement and innovation</p>
              </div>
            </div>
            <div className="reason-card">
              <FontAwesomeIcon icon={faUsers} className="reason-icon" />
              <div className="reason-content">
                <h3>Customer First</h3>
                <p>Dedicated to exceeding customer expectations</p>
              </div>
            </div>
            <div className="reason-card">
              <FontAwesomeIcon icon={faShieldAlt} className="reason-icon" />
              <div className="reason-content">
                <h3>Quality Assured</h3>
                <p>Rigorous quality control and testing processes</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-description">
              Join us in our mission to create a more sustainable future
            </p>
            <Link to="/register" className="cta-button">
              Get Started <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;