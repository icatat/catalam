'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface DynamicPhotoCardProps {
  src: string;
  alt: string;
  className?: string;
}

interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export function DynamicPhotoCard({
  src,
  alt,
  className = '',
}: DynamicPhotoCardProps) {
  const { t } = useLanguage();
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      setDimensions({
        width: img.width,
        height: img.height,
        aspectRatio,
      });
    };
    img.onerror = () => setImageError(true);
    img.src = src;
  }, [src]);

  if (imageError || !dimensions) {
    return (
      <div className={cn(
        'relative overflow-hidden rounded-2xl shadow-card bg-gray-200 animate-pulse',
        'aspect-square min-h-[200px]',
        className
      )}>
        {imageError && (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            {t('error.image')}
          </div>
        )}
      </div>
    );
  }

  // Determine grid span and aspect ratio based on image dimensions
  const getCardClasses = (aspectRatio: number) => {
    if (aspectRatio > 1.8) {
      // Very wide images - span 2 columns
      return {
        gridClass: 'col-span-1 sm:col-span-2',
        aspectClass: 'aspect-[2/1]',
      };
    } else if (aspectRatio > 1.3) {
      // Wide images
      return {
        gridClass: 'col-span-1 sm:col-span-2 md:col-span-1',
        aspectClass: 'aspect-[4/3]',
      };
    } else if (aspectRatio > 0.8) {
      // Square-ish images
      return {
        gridClass: 'col-span-1',
        aspectClass: 'aspect-square',
      };
    } else if (aspectRatio > 0.6) {
      // Portrait images
      return {
        gridClass: 'col-span-1',
        aspectClass: 'aspect-[3/4]',
      };
    } else {
      // Very tall images - give them more height
      return {
        gridClass: 'col-span-1',
        aspectClass: 'aspect-[2/3]',
      };
    }
  };

  const { gridClass, aspectClass } = getCardClasses(dimensions.aspectRatio);

  // Add some randomness to the ordering/sizing for visual interest
  const randomVariant = Math.random();
  let finalGridClass = gridClass;
  let finalAspectClass = aspectClass;

  // Occasionally make some images larger for visual variety
  if (randomVariant > 0.85 && dimensions.aspectRatio > 0.8 && dimensions.aspectRatio < 1.3) {
    finalGridClass = 'col-span-1 sm:col-span-2';
    finalAspectClass = 'aspect-[3/2]';
  }

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-2xl shadow-card hover:shadow-card-hover group cursor-pointer',
        finalGridClass,
        finalAspectClass,
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        
        {/* Dark overlay that appears on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Decorative border that appears on hover */}
      <div className="absolute inset-0 border-2 border-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}