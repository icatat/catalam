'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { themeClasses } from '@/lib/theme';
import { PhotoCard, TextCard } from '@/components/ui/photo-card';
import { DynamicPhotoCard } from '@/components/DynamicPhotoCard';
import { useState, useEffect } from 'react';

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


  return (
    <div className={cn('min-h-screen', themeClasses.gradientBg('hero'), 'p-4 md:p-6')}>
      <div className="max-w-7xl mx-auto">
        {/* Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          
          {/* Main Title Card */}
          <TextCard size="large" variant="primary" className="col-span-full sm:col-span-2 lg:col-span-2">
            <div>
              <motion.h1 
                className={cn(themeClasses.heading('h2', 'primary'), 'mb-4 text-center')}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                Cata & Lam
              </motion.h1>
              <p className={cn(themeClasses.body('large', 'secondary'))}>
                Wedding World Tour
              </p>
              <Heart className="w-8 h-8 text-rose-500 mx-auto mt-4" />
            </div>
          </TextCard>

          {/* Romania Wedding Navigation Card */}
          <PhotoCard
            src="/photo_3.png"
            alt="Romania Wedding"
            size="wide"
            href="/romania"
            className="sm:col-span-2"
            overlay={
              <div>
                <MapPin className="w-6 h-6 mb-2" />
                <h3 className={cn(themeClasses.heading('h4', 'white'), 'mb-2')}>
                  Romania Wedding
                </h3>
                <p className={themeClasses.body('base', 'white')}>
                  September 11-12, 2026 • Oradea
                </p>
              </div>
            }
          />

          {/* Vietnam Wedding Navigation Card */}
          <PhotoCard
            src="/photo_0.png"
            alt="Vietnam Wedding"
            size="wide"
            href="/vietnam"
            className="sm:col-span-4"
            overlay={
              <div>
                <Calendar className="w-6 h-6 mb-2" />
                <h3 className={cn(themeClasses.heading('h4', 'white'), 'mb-2')}>
                  Vietnam Wedding
                </h3>
                <p className={themeClasses.body('base', 'white')}>
                  September 26, 2026 • Hanoi
                </p>
              </div>
            }
          />
          {/* Dynamic Blob Store Images */}
          {loading && (
            <div className="col-span-full text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
              <p className={cn(themeClasses.body('base', 'secondary'), 'mt-2')}>
                Loading our memories...
              </p>
            </div>
          )}

          {!loading && blobImages.map((image, index) => (
            <DynamicPhotoCard
              key={image.url}
              src={image.url}
              alt={`Wedding memory ${index + 1}`}
            />
          ))}

        </div>
      </div>
    </div>
  );
}