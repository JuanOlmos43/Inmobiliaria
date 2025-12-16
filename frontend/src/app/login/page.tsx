'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar lógica de autenticación
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2647] via-[#144272] to-[#205295] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Card Container */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Iniciar Sesión</h1>
            <p className="text-gray-300">Accede a tu cuenta de InmoHogar</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C69B56] focus:border-transparent transition-all"
                placeholder="tu@email.com"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C69B56] focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link 
                href="#" 
                className="text-sm text-[#C69B56] hover:text-[#B38A45] transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#C69B56] to-[#B38A45] text-white font-semibold py-3 px-6 rounded-lg hover:from-[#B38A45] hover:to-[#A27934] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-center text-gray-300 text-sm">
              ¿No tienes una cuenta?{' '}
              <Link 
                href="#" 
                className="text-[#C69B56] hover:text-[#B38A45] font-medium transition-colors"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link 
              href="/" 
              className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
