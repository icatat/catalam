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
  const heroStyle = backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`,
  } : {};

  const bgClass = backgroundImage 
    ? 'relative bg-cover bg-center bg-no-repeat'
    : 'bg-gradient-to-br from-slate-100 to-slate-200';

  return (
    <div 
      className={`${bgClass} py-16 ${className}`}
      style={heroStyle}
    >
      {backgroundImage && <div className="absolute inset-0 bg-slate-800/60"></div>}
      <div className={`${backgroundImage ? 'relative z-10' : ''} max-w-4xl mx-auto px-4 text-center`}>
        <h1 className={`text-5xl font-serif mb-4 ${backgroundImage ? 'text-white drop-shadow-lg' : 'text-slate-800'}`}>
          {title}
        </h1>
        {subtitle && (
          <p className={`text-xl mb-8 font-body ${backgroundImage ? 'text-white drop-shadow-md' : 'text-slate-700'}`}>
            {subtitle}
          </p>
        )}
        <div className={`${backgroundImage ? 'bg-white/90' : 'bg-white/70'} rounded-lg p-6 inline-block shadow-lg`}>
          <div className="text-2xl font-semibold text-slate-800 mb-2">{date}</div>
          <div className="text-lg text-slate-600">{location}</div>
        </div>
      </div>
    </div>
  );
}