import { themeClasses } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  date: string;
  location: string;
  backgroundImage?: string;
  className?: string;
}

export default function HeroSection({
  title,
  subtitle,
  date,
  location,
  backgroundImage,
  className = ''
}: HeroSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const heroStyle = backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`,
  } : {};

  const bgClass = backgroundImage 
    ? 'relative bg-cover bg-center bg-no-repeat'
    : themeClasses.gradientBg('neutral');

  const textColor = backgroundImage ? 'white' : 'primary';
  const subtitleColor = backgroundImage ? 'white' : 'secondary';

  return (
    <motion.div 
      ref={ref}
      className={cn(bgClass, themeClasses.section('base'), 'relative overflow-hidden', className)}
      style={{ ...heroStyle, y, opacity }}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
      )}
      <div className={cn(
        backgroundImage ? 'relative z-10' : '', 
        themeClasses.container(), 
        'text-center'
      )}>
        <motion.h1 
          className={cn(
            themeClasses.heading('h2', textColor),
            'mb-4',
            backgroundImage && 'drop-shadow-2xl'
          )}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p 
            className={cn(
              themeClasses.body('large', subtitleColor),
              'mb-8',
              backgroundImage && 'drop-shadow-lg'
            )}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {subtitle}
          </motion.p>
        )}
        <motion.div 
          className={cn(
            themeClasses.card('hero'),
            'inline-block',
            backgroundImage ? 'bg-white/95' : 'bg-white/80'
          )}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className={cn(themeClasses.heading('h4', 'primary'), 'mb-2')}>
            {date}
          </div>
          <div className={themeClasses.body('base', 'secondary')}>
            {location}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}