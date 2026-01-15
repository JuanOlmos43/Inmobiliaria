'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FormInput from '@/components/FormInput';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validar credenciales para Administrador
    if (email === 'admin@emanil.com' && password === 'admin01') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userRole', 'admin');
      
      setTimeout(() => {
        router.push('/admin');
      }, 500);
      return;
    }
    
    // Validar credenciales para Inquilino
    if (email === 'Inqui@emanil.com' && password === 'Inqui01') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userRole', 'tenant');
      
      setTimeout(() => {
        router.push('/inquilino');
      }, 500);
      return;
    }
    
    // Validar credenciales para Propietario
    if (email === 'Propietario@emanil.com' && password === 'Propietario01') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userRole', 'landlord');
      
      setTimeout(() => {
        router.push('/propietario');
      }, 500);
      return;
    }
    
    // Validar credenciales para Agente
    if (email === 'Agente01@email.com' && password === 'Agente01') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userRole', 'agente');
      
      setTimeout(() => {
        router.push('/agente');
      }, 500);
      return;
    } 
    
    // Validar credenciales para Gerencia
    if (email === 'Duenio01@email.com' && password === 'Duenio01') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userRole', 'owner');
      
      setTimeout(() => {
        router.push('/gerencia');
      }, 500);
      return;
    }
    
    // Validar contra usuarios creados dinámicamente por el administrador
    const storedUsers = localStorage.getItem('systemUsers');
    if (storedUsers) {
      try {
        const users = JSON.parse(storedUsers);
        const user = users.find((u: any) => u.email === email && u.password === password);
        
        if (user && user.status === 'active') {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userEmail', email);
          
          // Mapear el rol del usuario al formato esperado
          let userRole = '';
          let redirectPath = '/';
          
          switch(user.role) {
            case 'tenant':
              userRole = 'tenant';
              redirectPath = '/'; // Los inquilinos van a la página principal
              break;
            case 'landlord':
              userRole = 'landlord';
              redirectPath = '/'; // Los propietarios también van a la página principal
              break;
            case 'agent':
              userRole = 'agente';
              redirectPath = '/agente';
              break;
            case 'owner':
              userRole = 'owner';
              redirectPath = '/gerencia';
              break;
          }
          
          localStorage.setItem('userRole', userRole);
          
          setTimeout(() => {
            router.push(redirectPath);
          }, 500);
          return;
        }
      } catch (error) {
        console.error('Error parsing users:', error);
      }
    }
    
    // Si no se encontró ninguna coincidencia
    setIsLoading(false);
    setError('Credenciales incorrectas. Por favor, verifica tu correo y contraseña.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0f172a] to-[#334155] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Card Container */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 animate-scale-in">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Iniciar Sesión</h1>
            <p className="text-gray-200">Accede a tu cuenta de InmoHogar</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <FormInput
              label="Correo Electrónico"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              theme="dark"
            />

            {/* Password Input */}
            <FormInput
              label="Contraseña"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              theme="dark"
            />

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link 
                href="#" 
                className="text-sm text-[#14b8a6] hover:text-[#2dd4bf] transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white font-bold py-3 px-6 rounded-full hover:from-[#0d9488] hover:to-[#0f766e] transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? 'Iniciando sesión...' : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link 
              href="/" 
              className="text-sm text-gray-300 hover:text-white transition-colors inline-flex items-center gap-2"
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
