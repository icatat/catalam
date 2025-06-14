'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Wedding photos
  const photos = [
    '/photo_2.jpeg',
    '/photo_0.png',
    '/photo_1.jpeg',
    '/photo_4.png',
    '/photo_7.png',
    '/photo_3.png',
    '/photo_5.png',
  ]
  ;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % photos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [photos.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % photos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section with Carousel */}
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        
        {/* Carousel Container */}
        <div className="relative w-full h-full">
          {photos.map((photo, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={photo}
                alt={`Wedding photo ${index + 1}`}
                fill
                className="object-contain"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-slate-700 p-2 rounded-full shadow-lg transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-slate-700 p-2 rounded-full shadow-lg transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Overlay Content */}
        <div className="absolute inset-0 z-15 flex items-end justify-center pb-24">
          <div className="text-center text-white px-4">
            <h1 className="text-6xl md:text-8xl font-serif mb-4 drop-shadow-lg">
              Cata & Lam
            </h1>
            <p className="text-xl md:text-2xl font-body mb-8 drop-shadow-md">
              World Tour
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/romania"
                className="relative bg-slate-700 hover:bg-slate-800 text-white px-8 py-3 rounded-full transition-colors shadow-lg overflow-hidden"
                style={{
                  backgroundImage: 'url(/photo_3.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-slate-700/70 hover:bg-slate-800/70 transition-colors rounded-full"></div>
                <span className="relative z-10">Romania Wedding</span>
              </Link>
              <Link
                href="/vietnam"
                className="relative bg-slate-700 hover:bg-slate-800 text-white px-8 py-3 rounded-full transition-colors shadow-lg overflow-hidden"
                style={{
                  backgroundImage: 'url(/photo_0.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                Vietnam Wedding
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}