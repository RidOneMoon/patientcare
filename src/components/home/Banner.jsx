


"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid"; // Import icons

const slides = [
  {
    image: "/baby.jpg",
    title: "Expert Baby Care",
    description: "Nurturing your little ones with professional and verified sitters, ensuring their safety and joy.",
    link: "/services/baby-care"
  },
  {
    image: "/compassionate.jpeg",
    title: "Compassionate Elderly Care",
    description: "Dignified support and health monitoring for your senior family members, fostering comfort and well-being.",
    link: "/services/elderly-care"
  },
  {
    image: "/dadicate.jpg",
    title: "Dedicated Sick Care",
    description: "Specialized home care for individuals recovering from illness or surgery, with trained medical support.",
    link: "/services/sick-care"
  }
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); 

    return () => clearInterval(slideInterval); 
  }, []);

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative w-full h-[80vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out
            ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto h-full flex items-center justify-start text-white px-6">
        <div className="max-w-2xl text-left animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-4">
            {slides[currentSlide].title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-medium">
            {slides[currentSlide].description}
          </p>
          <Link
            href={slides[currentSlide].link}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg inline-block
                       hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Learn More
          </Link>
        </div>
      </div>

      <button
        onClick={goToPrevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/20 p-3 rounded-full text-white
                   hover:bg-white/40 transition-colors duration-300 z-20"
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/20 p-3 rounded-full text-white
                   hover:bg-white/40 transition-colors duration-300 z-20"
      >
        <ChevronRightIcon className="w-6 h-6" />
      </button>

      {/* Slide Indicators (Dots) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full bg-white transition-opacity duration-300
                       ${index === currentSlide ? "opacity-100" : "opacity-50 hover:opacity-75"}`}
          ></button>
        ))}
      </div>
    </section>
  );
}