'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar, Heart, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { themeClasses } from '@/lib/theme';
import { PhotoCard, TextCard } from '@/components/ui/photo-card';
import { DynamicPhotoCard } from '@/components/DynamicPhotoCard';
import { useState, useEffect, useMemo } from 'react';

interface BlobImage {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
}

export default function Home() {
  const [blobImages, setBlobImages] = useState<BlobImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch('/api/images');
        const data = await response.json();
        setBlobImages(data.images || []);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

  // Randomize blob images with dynamic positioning
  const randomizedBlobImages = useMemo(() => {
    return [...blobImages].sort(() => Math.random() - 0.5).map(image => ({
      ...image,
      rotation: (Math.random() - 0.5) * 4,
      scale: 0.8 + Math.random() * 0.4,
    }));
  }, [blobImages]);

  return (
    <div className={cn('min-h-screen', themeClasses.gradientBg('hero'), 'p-4 md:p-6')}>
      <div className="max-w-7xl mx-auto">
        
        {/* Centered Main Title */}
        <div className="flex justify-center mb-16">
          <TextCard size="large" variant="primary" className="max-w-md">
            <div>
              <motion.h1 
                className={cn(themeClasses.heading('h1', 'primary'), 'mb-4 text-center')}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                Cata & Lam
              </motion.h1>
              <p className={cn(themeClasses.body('large', 'secondary'), 'text-center')}>
                Wedding World Tour
              </p>
            </div>
          </TextCard>
        </div>

        {/* Prominent Wedding Location Cards */}
        <motion.div
          className="flex justify-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
      
              {/* Romania Wedding Card */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <PhotoCard
                  src="/photo_3.png"
                  alt="Romania Wedding"
                  size="wide"
                  href="/romania"
                  className="w-80 shadow-xl hover:shadow-2xl transition-all duration-300 ring-4 ring-rose-500/30 hover:ring-rose-500/60"
                  overlay={
                    <div className="text-center">
                      <MapPin className="w-8 h-8 mb-3 mx-auto text-rose-400" />
                      <h3 className={cn(themeClasses.heading('h4', 'white'), 'mb-2 font-bold')}>
                        Romania Wedding
                      </h3>
                      <p className={cn(themeClasses.body('base', 'white'), 'mb-3')}>
                        September 11-12, 2026 • Oradea
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-4">
                        <span className="text-white font-semibold">View Details</span>
                        <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  }
                />
              </motion.div>

              {/* Vietnam Wedding Card */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <PhotoCard
                  src="/photo_0.png"
                  alt="Vietnam Wedding"
                  size="wide"
                  href="/vietnam"
                  className="w-80 shadow-xl hover:shadow-2xl transition-all duration-300 ring-4 ring-emerald-500/30 hover:ring-emerald-500/60"
                  overlay={
                    <div className="text-center">
                      <Calendar className="w-8 h-8 mb-3 mx-auto text-emerald-400" />
                      <h3 className={cn(themeClasses.heading('h4', 'white'), 'mb-2 font-bold')}>
                        Vietnam Wedding
                      </h3>
                      <p className={cn(themeClasses.body('base', 'white'), 'mb-3')}>
                        September 26, 2026 • Hanoi
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-4">
                        <span className="text-white font-semibold">View Details</span>
                        <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  }
                />
              </motion.div>
        </motion.div>
        {/* Dynamic Blob Store Images Gallery */}
        {loading && (
          <motion.div
            className="flex justify-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center py-8 bg-white/10 backdrop-blur-sm rounded-2xl px-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-rose-500"></div>
              <p className={cn(themeClasses.body('large', 'secondary'), 'mt-4')}>
                Loading our memories...
              </p>
            </div>
          </motion.div>
        )}

        {!loading && blobImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          > 
            {/* Masonry-like grid for blob images */}
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6">
              {randomizedBlobImages.map((image, index) => (
                <motion.div
                  key={image.url}
                  className="break-inside-avoid mb-4 md:mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    rotate: image.rotation 
                  }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotate: 0,
                    zIndex: 10,
                    transition: { duration: 0.3 }
                  }}
                >
                  <DynamicPhotoCard
                    src={image.url}
                    alt={`Wedding memory ${index + 1}`}
                    className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {!loading && blobImages.length === 0 && (
          <motion.div
            className="flex justify-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <TextCard size="medium" variant="accent" className="max-w-md">
              <div className="text-center">
                <Heart className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className={cn(themeClasses.heading('h5', 'primary'), 'mb-3')}>
                  Memories Coming Soon
                </h3>
                <p className={themeClasses.body('small', 'secondary')}>
                  We'll be sharing our beautiful moments here soon!
                </p>
              </div>
            </TextCard>
          </motion.div>
        )}

      </div>
    </div>
  );
}