import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainNavbar from './MainNavbar';

const HomePage = () => {
  // State for the image slider
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    '/1.jpg',
    '/2.jpg',
    '/3.jpg',
  ];

  // Auto-slide functionality
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(slideInterval); // Cleanup on unmount
  }, [slides.length]);

  // Handle manual slide navigation
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
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    .home-page {
      font-family: 'Poppins', sans-serif;
      text-align: center;
      background: linear-gradient(135deg, #f5f7fa 0%, #e6f0ea 100%);
      min-height: 100vh;
    }

    /* Image Slider Styles */
    .image-slider {
      position: relative;
      width: 100%;
      height: 90vh;
      overflow: hidden;
    }

    .slider-container {
      display: flex;
      width: ${slides.length * 100}%;
      height: 100%;
      transition: transform 0.5s ease-in-out;
      transform: translateX(-${currentSlide * (100 / slides.length)}%);
    }

    .slide {
      flex: 0 0 ${100 / slides.length}%;
      width: 100%;
      height: 100%;
    }

    .slide img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }

    .slider-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0, 0, 0, 0.5);
      color: white;
      border: none;
      padding: 15px;
      cursor: pointer;
      font-size: 1.5rem;
      transition: background 0.3s ease;
    }

    .slider-nav:hover {
      background: rgba(0, 0, 0, 0.7);
    }

    .prev {
      left: 20px;
    }

    .next {
      right: 20px;
    }

    .slider-dots {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 10px;
    }

    .dot {
      width: 12px;
      height: 12px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .dot.active {
      background: #328e6e;
    }

    /* Welcome Message on Slider */
    .welcome-message {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 3rem;
      font-weight: 600;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      background: rgba(0, 0, 0, 0.3);
      padding: 10px 20px;
      border-radius: 8px;
    }

    /* Main Content Styles */
    .main-content {
      padding: 40px;
    }

    .main-content p {
      font-size: 1.2rem;
      color: #5e6d55;
      margin-bottom: 40px;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }

    .home-functions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .function-card {
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      padding: 20px;
      width: 200px;
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .function-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }

    .function-card a {
      text-decoration: none;
      font-size: 1.1rem;
      font-weight: 500;
      color: #328e6e;
      transition: color 0.3s ease;
    }

    .function-card a:hover {
      color: #46b38a;
    }

    @media (max-width: 768px) {
      .image-slider {
        height: 70vh;
      }

      .welcome-message {
        font-size: 2rem;
        padding: 8px 16px;
      }

      .main-content {
        padding: 20px;
      }

      .main-content p {
        font-size: 1rem;
      }

      .function-card {
        width: 150px;
        padding: 15px;
      }

      .function-card a {
        font-size: 1rem;
      }

      .slider-nav {
        padding: 10px;
        font-size: 1.2rem;
      }

      .dot {
        width: 10px;
        height: 10px;
      }
    }

    @media (max-width: 480px) {
      .image-slider {
        height: 50vh;
      }

      .welcome-message {
        font-size: 1.5rem;
        padding: 6px 12px;
      }

      .main-content p {
        font-size: 0.9rem;
      }

      .function-card {
        width: 100%;
        max-width: 300px;
      }

      .slider-nav {
        padding: 8px;
        font-size: 1rem;
      }

      .dot {
        width: 8px;
        height: 8px;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <MainNavbar />
      <div className="home-page">
        {/* Image Slider */}
        <div className="image-slider">
          <div className="slider-container">
            {slides.map((slide, index) => (
              <div className="slide" key={index}>
                <img src={slide} alt={`Slide ${index + 1}`} />
              </div>
            ))}
          </div>
          <div className="slider-dots">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`dot ${currentSlide === index ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
          {/* Welcome Message on Slider */}
          <h1 className="welcome-message">Welcome to GreenCoco</h1>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <p>
            Your all-in-one solution for managing business operations efficiently. Navigate through our main functions to get started.
          </p>
          <div className="home-functions">
            <div className="function-card">
              <Link to="/finance">Finance Management</Link>
            </div>
            <div className="function-card">
              <Link to="/inventory">Inventory Management</Link>
            </div>
            <div className="function-card">
              <Link to="/delivery">Delivery</Link>
            </div>
            <div className="function-card">
              <Link to="/order-supplier">Order & Supplier Management</Link>
            </div>
            <div className="function-card">
              <Link to="/employee">Employee Management</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;