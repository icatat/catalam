'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface PhotoCardProps {
  src: string;
  alt: string;
  size?: 'small' | 'medium' | 'large' | 'wide' | 'tall';
  overlay?: ReactNode;
  href?: string;
  className?: string;
  priority?: boolean;
}

export function PhotoCard({
  src,
  alt,
  size = 'medium',
  overlay,
  href,
  className = '',
  priority = false,
}: PhotoCardProps) {
  const sizeClasses = {
    small: 'col-span-1 aspect-square',
    medium: 'col-span-1 aspect-[3/4]',
    large: 'col-span-2 aspect-square',
    wide: 'col-span-2 aspect-[2/1]',
    tall: 'col-span-1 aspect-[3/4]',
  };

  const CardContent = (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-2xl shadow-card hover:shadow-card-hover group cursor-pointer',
        sizeClasses[size],
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
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Dark overlay that appears on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content overlay */}
        {overlay && (
          <div className="absolute inset-0 flex items-end p-6">
            <div className="text-white transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              {overlay}
            </div>
          </div>
        )}
      </div>
      
      {/* Decorative border that appears on hover */}
      <div className="absolute inset-0 border-2 border-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}

interface TextCardProps {
  children: ReactNode;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

export function TextCard({ 
  children, 
  size = 'medium', 
  variant = 'primary',
  className = '' 
}: TextCardProps) {
  const sizeClasses = {
    small: 'col-span-1 aspect-square',
    medium: 'col-span-1 aspect-[3/4]', 
    large: 'col-span-2 aspect-[2/1]',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-br from-rose-50 to-pink-100 text-slate-800',
    secondary: 'bg-gradient-to-br from-emerald-50 to-teal-100 text-slate-800',
    accent: 'bg-gradient-to-br from-purple-50 to-indigo-100 text-slate-800',
  };

  return (
    <motion.div
      className={cn(
        'relative rounded-2xl shadow-card hover:shadow-card-hover p-6 flex items-center justify-center text-center',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}