'use client';

import Link from 'next/link';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavigationProps {
  currentPage?: 'home' | 'vietnam' | 'romania' | 'contact';
}

export default function Navigation({ currentPage = 'home' }: NavigationProps) {
  const { t } = useLanguage();
  
  return (
    <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-serif text-slate-800">
            Cata & Lam
          </Link>
          <div className="flex items-center space-x-8">
            <div className="flex space-x-6">
              <Link 
                href="/" 
                className={`transition-colors ${
                  currentPage === 'home' 
                    ? 'text-blue-600 font-medium' 
                    : 'text-slate-700 hover:text-blue-600'
                }`}
              >
                {t('nav.home')}
              </Link>
              <Link 
                href="/vietnam" 
                className={`transition-colors ${
                  currentPage === 'vietnam' 
                    ? 'text-blue-600 font-medium' 
                    : 'text-slate-700 hover:text-blue-600'
                }`}
              >
                {t('nav.vietnam')}
              </Link>
              <Link 
                href="/romania" 
                className={`transition-colors ${
                  currentPage === 'romania' 
                    ? 'text-blue-600 font-medium' 
                    : 'text-slate-700 hover:text-blue-600'
                }`}
              >
                {t('nav.romania')}
              </Link>
              <Link 
                href="/contact" 
                className={`transition-colors ${
                  currentPage === 'contact' 
                    ? 'text-blue-600 font-medium' 
                    : 'text-slate-700 hover:text-blue-600'
                }`}
              >
                {t('nav.contact')}
              </Link>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}