import Link from 'next/link';

interface NavigationProps {
  currentPage?: 'home' | 'vietnam' | 'romania';
}

export default function Navigation({ currentPage = 'home' }: NavigationProps) {
  return (
    <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-serif text-slate-800">
            Cata & Lam
          </Link>
          <div className="flex space-x-8">
            <Link 
              href="/" 
              className={`transition-colors ${
                currentPage === 'home' 
                  ? 'text-blue-600 font-medium' 
                  : 'text-slate-700 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/vietnam" 
              className={`transition-colors ${
                currentPage === 'vietnam' 
                  ? 'text-blue-600 font-medium' 
                  : 'text-slate-700 hover:text-blue-600'
              }`}
            >
              Vietnam Wedding
            </Link>
            <Link 
              href="/romania" 
              className={`transition-colors ${
                currentPage === 'romania' 
                  ? 'text-slate-700 font-medium' 
                  : 'text-slate-700 hover:text-blue-600'
              }`}
            >
              Romania Wedding
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}