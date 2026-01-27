"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  // Estado para controlar el menú móvil
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Alterna entre abrir y cerrar el menú
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Cierra el menú al hacer clic en un enlace
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-(--primary) shadow-xl sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="shrink-0">
            <Link
              href="/"
              className="flex items-center gap-3 text-3xl font-bold text-(--accent) hover:text-(--accent-hover) transition-all duration-300 transform hover:scale-105"
            >
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
              className="relative px-4 py-2 text-white hover:text-(--accent) transition-colors font-medium group"
            >
              Inicio
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-(--accent) group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/propiedades"
              className="relative px-4 py-2 text-white hover:text-(--accent) transition-colors font-medium group"
            >
              Propiedades
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-(--accent) group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/nosotros"
              className="relative px-4 py-2 text-white hover:text-(--accent) transition-colors font-medium group"
            >
              Nosotros
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-(--accent) group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/contacto"
              className="relative px-4 py-2 text-white hover:text-(--accent) transition-colors font-medium group"
            >
              Contacto
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-(--accent) group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Login Button */}
            <Link
              href="/login"
              className="ml-6 px-8 py-3 bg-(--accent) text-white font-bold rounded-full hover:bg-(--accent-hover) transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
            >
              Iniciar Sesión
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-(--accent) focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2 bg-(--primary)">
          <Link
            href="/"
            onClick={closeMenu}
            className="block px-4 py-3 text-white hover:text-(--accent) hover:bg-(--primary-light) rounded-lg transition-all duration-200 font-medium"
          >
            Inicio
          </Link>
          <Link
            href="/propiedades"
            onClick={closeMenu}
            className="block px-4 py-3 text-white hover:text-(--accent) hover:bg-(--primary-light) rounded-lg transition-all duration-200 font-medium"
          >
            Propiedades
          </Link>
          <Link
            href="/nosotros"
            onClick={closeMenu}
            className="block px-4 py-3 text-white hover:text-(--accent) hover:bg-(--primary-light) rounded-lg transition-all duration-200 font-medium"
          >
            Nosotros
          </Link>
          <Link
            href="/contacto"
            onClick={closeMenu}
            className="block px-4 py-3 text-white hover:text-(--accent) hover:bg-(--primary-light) rounded-lg transition-all duration-200 font-medium"
          >
            Contacto
          </Link>
          <Link
            href="/login"
            onClick={closeMenu}
            className="block mt-4 px-6 py-3 bg-(--accent) text-white font-bold rounded-full hover:bg-(--accent-hover) transition-all duration-300 shadow-lg text-center"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </nav>
  );
}
