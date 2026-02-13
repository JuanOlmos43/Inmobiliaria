"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Icon } from "@/components/ui";

export function Navbar() {
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
    <nav className="bg-opacity-95 sticky top-0 z-50 bg-(--primary) shadow-xl backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="shrink-0">
            <Link
              href="/"
              className="flex transform items-center gap-3 text-3xl font-bold text-(--accent) transition-all duration-300 hover:scale-105 hover:text-(--accent-hover)"
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
          <div className="hidden items-center space-x-1 md:flex">
            <Link
              href="/"
              className="group relative px-4 py-2 font-medium text-white transition-colors hover:text-(--accent)"
            >
              Inicio
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-(--accent) transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/propiedades"
              className="group relative px-4 py-2 font-medium text-white transition-colors hover:text-(--accent)"
            >
              Propiedades
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-(--accent) transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/nosotros"
              className="group relative px-4 py-2 font-medium text-white transition-colors hover:text-(--accent)"
            >
              Nosotros
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-(--accent) transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/contacto"
              className="group relative px-4 py-2 font-medium text-white transition-colors hover:text-(--accent)"
            >
              Contacto
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-(--accent) transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Login Button */}
            <Link
              href="/login"
              className="ml-6 transform rounded-full bg-(--accent) px-8 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:scale-95 hover:bg-(--accent-hover) hover:shadow-2xl"
            >
              Iniciar Sesión
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white transition-colors hover:text-(--accent) focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <Icon name="close" className="h-6 w-6" />
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
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
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-2 bg-(--primary) px-4 pt-2 pb-6">
          <Link
            href="/"
            onClick={closeMenu}
            className="block rounded-lg px-4 py-3 font-medium text-white transition-all duration-200 hover:bg-(--primary-light) hover:text-(--accent)"
          >
            Inicio
          </Link>
          <Link
            href="/propiedades"
            onClick={closeMenu}
            className="block rounded-lg px-4 py-3 font-medium text-white transition-all duration-200 hover:bg-(--primary-light) hover:text-(--accent)"
          >
            Propiedades
          </Link>
          <Link
            href="/nosotros"
            onClick={closeMenu}
            className="block rounded-lg px-4 py-3 font-medium text-white transition-all duration-200 hover:bg-(--primary-light) hover:text-(--accent)"
          >
            Nosotros
          </Link>
          <Link
            href="/contacto"
            onClick={closeMenu}
            className="block rounded-lg px-4 py-3 font-medium text-white transition-all duration-200 hover:bg-(--primary-light) hover:text-(--accent)"
          >
            Contacto
          </Link>
          <Link
            href="/login"
            onClick={closeMenu}
            className="mt-4 block rounded-full bg-(--accent) px-6 py-3 text-center font-bold text-white shadow-lg transition-all duration-300"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </nav>
  );
}
