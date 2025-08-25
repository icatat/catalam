'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

const languages = [
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'ro' as Language, name: 'Română', flag: '🇷🇴' },
  { code: 'vi' as Language, name: 'Tiếng Việt', flag: '🇻🇳' }
];

export default function SubtleLanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200",
          "bg-white/10 backdrop-blur-sm border border-white/20 text-white/90",
          "hover:bg-white/20 hover:text-white hover:border-white/30"
        )}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className="text-white">{currentLanguage.flag}</span>
        <span className="text-white hidden sm:inline">{currentLanguage.name}</span>
        <ChevronDown className={cn(
          "h-4 w-4 text-white/70 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className={cn(
          "absolute right-0 top-full mt-2 w-48 z-[9999]",
          "bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-white/20",
          "py-2"
        )}
        style={{ zIndex: 9999 }}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={cn(
                "w-full px-4 py-2 text-left flex items-center space-x-3",
                "hover:bg-white/20 transition-colors duration-150",
                "text-sm focus:outline-none focus:bg-white/20",
                language === lang.code && "bg-blue-50/50 text-blue-700"
              )}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="font-medium text-gray-800">{lang.name}</span>
              {language === lang.code && (
                <span className="ml-auto">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}