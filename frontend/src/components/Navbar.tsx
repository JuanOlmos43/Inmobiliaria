import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-[#0f172a] via-[#0f172a] to-[#1e293b] shadow-xl sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 text-3xl font-bold bg-gradient-to-r from-[#14b8a6] to-[#2dd4bf] bg-clip-text text-transparent hover:from-[#2dd4bf] hover:to-[#14b8a6] transition-all duration-300 transform hover:scale-105">
              <Image 
                src="/icon.png" 
                alt="InmoHogar Logo" 
                width={60} 
                height={60}
                className="transition-transform duration-300"
              />
              InmoHogar
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-1 items-center">
            <Link 
              href="/" 
              className="relative px-4 py-2 text-white hover:text-[#14b8a6] transition-colors font-medium group"
            >
              Inicio
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/propiedades" 
              className="relative px-4 py-2 text-white hover:text-[#14b8a6] transition-colors font-medium group"
            >
              Propiedades
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/nosotros" 
              className="relative px-4 py-2 text-white hover:text-[#14b8a6] transition-colors font-medium group"
            >
              Nosotros
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/contacto" 
              className="relative px-4 py-2 text-white hover:text-[#14b8a6] transition-colors font-medium group"
            >
              Contacto
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            {/* Login Button */}
            <Link 
              href="/login"
              className="ml-6 px-8 py-3 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white font-bold rounded-full hover:from-[#0d9488] hover:to-[#0f766e] transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
            >
              Iniciar Sesión
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-white hover:text-[#14b8a6] focus:outline-none transition-colors">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
