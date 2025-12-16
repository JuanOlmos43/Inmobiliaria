import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-[#0A2647] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-[#C69B56] hover:text-[#B38A45] transition-colors">
              InmoHogar
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link 
              href="/" 
              className="text-white hover:text-[#C69B56] transition-colors font-medium"
            >
              Inicio
            </Link>
            <Link 
              href="/propiedades" 
              className="text-white hover:text-[#C69B56] transition-colors font-medium"
            >
              Propiedades
            </Link>
            <Link 
              href="/nosotros" 
              className="text-white hover:text-[#C69B56] transition-colors font-medium"
            >
              Nosotros
            </Link>
            <Link 
              href="/contacto" 
              className="text-white hover:text-[#C69B56] transition-colors font-medium"
            >
              Contacto
            </Link>
            
            {/* Login Button */}
            <Link 
              href="/login"
              className="ml-4 px-6 py-2 bg-gradient-to-r from-[#C69B56] to-[#B38A45] text-white font-semibold rounded-lg hover:from-[#B38A45] hover:to-[#A27934] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Iniciar Sesión
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-white hover:text-[#C69B56] focus:outline-none">
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
