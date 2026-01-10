'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/Icon';

// Tipos
interface Property {
  id: string;
  title: string;
  type: 'Venta' | 'Alquiler';
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  status: 'Activa' | 'Pausada';
  description: string;
  landlordName?: string;
  landlordPhone?: string;
  landlordEmail?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [rentingProperty, setRentingProperty] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Activa' | 'Pausada'>('all');
  const [userEmail, setUserEmail] = useState('');

  // Verificar autenticación
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated');
    const email = localStorage.getItem('userEmail');
    
    if (!isAuth || isAuth !== 'true') {
      router.push('/login');
    } else {
      setUserEmail(email || '');
      // Cargar propiedades de ejemplo
      loadSampleProperties();
    }
  }, [router]);

  const loadSampleProperties = () => {
    const sampleProperties: Property[] = [
      {
        id: '1',
        title: 'Casa Moderna en Zona Norte',
        type: 'Venta',
        price: 250000,
        location: 'Zona Norte, Ciudad',
        bedrooms: 3,
        bathrooms: 2,
        area: 180,
        image: '/placeholder-house.jpg',
        status: 'Activa',
        description: 'Hermosa casa moderna con acabados de lujo',
        landlordName: 'Carlos Rodríguez',
        landlordPhone: '+54 11 2345-6789',
        landlordEmail: 'carlos.rodriguez@email.com'
      },
      {
        id: '2',
        title: 'Departamento Céntrico',
        type: 'Alquiler',
        price: 800,
        location: 'Centro, Ciudad',
        bedrooms: 2,
        bathrooms: 1,
        area: 85,
        image: '/placeholder-apartment.jpg',
        status: 'Activa',
        description: 'Departamento amoblado en zona céntrica',
        landlordName: 'María González',
        landlordPhone: '+54 11 3456-7890',
        landlordEmail: 'maria.gonzalez@email.com'
      }
    ];
    setProperties(sampleProperties);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  const handleAddProperty = () => {
    setEditingProperty(null);
    setIsModalOpen(true);
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setIsModalOpen(true);
  };

  const handleDeleteProperty = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setProperties(properties.map(p => 
      p.id === id 
        ? { ...p, status: p.status === 'Activa' ? 'Pausada' : 'Activa' } 
        : p
    ));
  };

  const handleRentProperty = (property: Property) => {
    setRentingProperty(property);
    setIsRentalModalOpen(true);
  };

  const handleSaveProperty = (property: Omit<Property, 'id'>) => {
    if (editingProperty) {
      // Editar propiedad existente
      setProperties(properties.map(p => 
        p.id === editingProperty.id 
          ? { ...property, id: editingProperty.id } 
          : p
      ));
    } else {
      // Agregar nueva propiedad
      const newProperty: Property = {
        ...property,
        id: Date.now().toString()
      };
      setProperties([...properties, newProperty]);
    }
    setIsModalOpen(false);
  };

  // Filtrar propiedades
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Icon name="briefcase" className="w-8 h-8 text-[#14b8a6]" />
              <div>
                <h1 className="text-2xl font-bold text-[#14b8a6]">Agente</h1>
                <p className="text-sm text-gray-300">Bienvenido, {userEmail}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <Icon name="logout" className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#0f172a] mb-6">Resumen de Propiedades</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <StatsCard
              title="Total Propiedades"
              value={properties.length}
              color="from-[#0f172a] to-[#334155]"
              icon="building"
            />
            <StatsCard
              title="En Venta"
              value={properties.filter(p => p.type === 'Venta').length}
              color="from-[#334155] to-[#0f172a]"
              icon="tag"
            />
            <StatsCard
              title="En Alquiler"
              value={properties.filter(p => p.type === 'Alquiler').length}
              color="from-[#475569] to-[#334155]"
              icon="key"
            />
            <StatsCard
              title="Activas"
              value={properties.filter(p => p.status === 'Activa').length}
              color="from-[#14b8a6] to-[#0d9488]"
              icon="check"
            />
            <StatsCard
              title="Pausadas"
              value={properties.filter(p => p.status === 'Pausada').length}
              color="from-amber-500 to-amber-600"
              icon="pause"
            />
          </div>
        </div>

        {/* Toolbar */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#0f172a] mb-6">Gestión de Propiedades</h2>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full md:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar propiedades..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex gap-3 w-full md:w-auto">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                >
                  <option value="all">Todos los estados</option>
                  <option value="Activa">Activas</option>
                  <option value="Pausada">Pausadas</option>
                </select>
                
                <button
                  onClick={handleAddProperty}
                  className="px-6 py-3 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white font-semibold rounded-lg hover:from-[#0d9488] hover:to-[#0f766e] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Nueva Propiedad
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay propiedades</h3>
            <p className="text-gray-500 mb-6">Comienza agregando tu primera propiedad</p>
            <button
              onClick={handleAddProperty}
              className="px-6 py-3 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white font-semibold rounded-lg hover:from-[#0d9488] hover:to-[#0f766e] transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar Propiedad
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                onEdit={handleEditProperty}
                onDelete={handleDeleteProperty}
                onToggleStatus={handleToggleStatus}
                onRent={handleRentProperty}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <PropertyModal
          property={editingProperty}
          onSave={handleSaveProperty}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Rental Modal */}
      {isRentalModalOpen && rentingProperty && (
        <RentalModal
          property={rentingProperty}
          onClose={() => setIsRentalModalOpen(false)}
          onSave={(rentalData) => {
            // Pausar la propiedad
            handleToggleStatus(rentingProperty.id);
            // Guardar el contrato en localStorage
            const existingRentals = JSON.parse(localStorage.getItem('rentalContracts') || '[]');
            const newRental = {
              id: Date.now().toString(),
              propertyId: rentingProperty.id,
              propertyName: rentingProperty.title,
              address: rentingProperty.location,
              monthlyRent: rentingProperty.price,
              ...rentalData,
              agentName: userEmail,
              agentPhone: '+54 11 2345-6789',
              agentEmail: userEmail
            };
            localStorage.setItem('rentalContracts', JSON.stringify([...existingRentals, newRental]));
            setIsRentalModalOpen(false);
            alert('Contrato de alquiler creado exitosamente');
          }}
        />
      )}
    </div>
  );
}

// Stats Card Component
function StatsCard({ 
  title, 
  value, 
  color,
  icon
}: { 
  title: string; 
  value: number; 
  color: string;
  icon: string;
}) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300`}>
      <div className="flex items-start justify-end mb-3">
        <div className="opacity-80">
          <Icon name={icon as any} className="w-8 h-8" />
        </div>
      </div>
      <p className="text-sm opacity-90 mb-1">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

// Property Card Component
function PropertyCard({ 
  property, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  onRent
}: { 
  property: Property; 
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onRent?: (property: Property) => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300">
        <svg className="absolute inset-0 m-auto w-24 h-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <div className="absolute top-3 right-3 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            property.status === 'Activa' 
              ? 'bg-green-500 text-white' 
              : 'bg-yellow-500 text-white'
          }`}>
            {property.status}
          </span>
          <span className="px-3 py-1 bg-[#0f172a] text-white rounded-full text-xs font-semibold">
            {property.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-[#0f172a] mb-2 line-clamp-1">{property.title}</h3>
        <p className="text-2xl font-bold text-[#0f172a] mb-3">
          ${property.price.toLocaleString()}
          {property.type === 'Alquiler' && <span className="text-sm text-gray-500">/mes</span>}
        </p>
        
        <div className="flex items-center text-gray-600 mb-3">
          <svg className="w-5 h-5 mr-2 text-[#14b8a6]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">{property.location}</span>
        </div>

        <div className="flex gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-[#0f172a]" fill="currentColor" viewBox="0 0 640 512">
              <path d="M32 32c17.7 0 32 14.3 32 32V320H288V160c0-17.7 14.3-32 32-32H544c53 0 96 43 96 96V448c0 17.7-14.3 32-32 32s-32-14.3-32-32V416H352 320 64v32c0 17.7-14.3 32-32 32s-32-14.3-32-32V64C0 46.3 14.3 32 32 32zm144 96a80 80 0 1 1 0 160 80 80 0 1 1 0-160z"/>
            </svg>
            {property.bedrooms} hab
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-[#0f172a]" fill="currentColor" viewBox="0 0 512 512">
              <path d="M64 131.9C64 112.1 80.1 96 99.9 96c9.5 0 18.6 3.8 25.4 10.5l16.2 16.2c-21 38.9-17.4 87.5 10.9 123L151 247c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0L345 121c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-1.3 1.3c-35.5-28.3-84.2-31.9-123-10.9L170.5 61.3C151.8 42.5 126.4 32 99.9 32C44.7 32 0 76.7 0 131.9V448c0 17.7 14.3 32 32 32s32-14.3 32-32V131.9zM256 352a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm64 64a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-128a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm64 64a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-128a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm64 64a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm32-32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/>
            </svg>
            {property.bathrooms} baños
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-[#0f172a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            {property.area}m²
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <button
            onClick={() => onEdit(property)}
            className="flex-1 px-3 py-2 bg-[#0f172a] text-white rounded-lg hover:bg-[#334155] transition-colors text-sm font-medium flex items-center justify-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </button>
          
          {/* Botón Alquilar - solo para propiedades de alquiler activas */}
          {property.type === 'Alquiler' && property.status === 'Activa' && onRent && (
            <button
              onClick={() => onRent(property)}
              className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center justify-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Alquilar
            </button>
          )}
          
          <button
            onClick={() => onToggleStatus(property.id)}
            className={`flex-1 px-3 py-2 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-1 ${
              property.status === 'Activa'
                ? 'bg-[#14b8a6] text-white hover:bg-[#0d9488]'
                : 'bg-[#475569] text-white hover:bg-[#334155]'
            }`}
          >
            {property.status === 'Activa' ? 'Pausar' : 'Activar'}
          </button>
          <button
            onClick={() => onDelete(property.id)}
            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// Property Modal Component
function PropertyModal({ 
  property, 
  onSave, 
  onClose 
}: { 
  property: Property | null;
  onSave: (property: Omit<Property, 'id'>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<Omit<Property, 'id'>>({
    title: property?.title || '',
    type: property?.type || 'Venta',
    price: property?.price || 0,
    location: property?.location || '',
    bedrooms: property?.bedrooms || 1,
    bathrooms: property?.bathrooms || 1,
    area: property?.area || 0,
    image: property?.image || '/placeholder-house.jpg',
    status: property?.status || 'Activa',
    description: property?.description || '',
    landlordName: property?.landlordName || '',
    landlordPhone: property?.landlordPhone || '',
    landlordEmail: property?.landlordEmail || ''
  });

  const [landlords, setLandlords] = useState<any[]>([]);
  const [landlordSearch, setLandlordSearch] = useState('');
  const [showLandlordDropdown, setShowLandlordDropdown] = useState(false);

  useEffect(() => {
    // Cargar propietarios del localStorage (creados por el admin)
    const storedUsers = localStorage.getItem('systemUsers');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const landlordUsers = users.filter((u: any) => u.role === 'landlord' && u.status === 'active');
      setLandlords(landlordUsers);
    }
  }, []);

  // Inicializar el campo de búsqueda con el nombre del propietario si existe
  useEffect(() => {
    if (property?.landlordName) {
      setLandlordSearch(property.landlordName);
    }
  }, [property]);

  const handleLandlordSelect = (landlord: any) => {
    setFormData({
      ...formData,
      landlordEmail: landlord.email,
      landlordName: landlord.name || landlord.email,
      landlordPhone: landlord.phone || 'No especificado'
    });
    setLandlordSearch(landlord.name || landlord.email);
    setShowLandlordDropdown(false);
  };

  const handleLandlordSearchChange = (value: string) => {
    setLandlordSearch(value);
    setShowLandlordDropdown(true);
    // Si se borra el campo, limpiar la selección
    if (!value) {
      setFormData({
        ...formData,
        landlordEmail: '',
        landlordName: '',
        landlordPhone: ''
      });
    }
  };

  const filteredLandlords = landlords.filter(landlord => {
    const searchLower = landlordSearch.toLowerCase();
    const name = (landlord.name || '').toLowerCase();
    const email = landlord.email.toLowerCase();
    return name.includes(searchLower) || email.includes(searchLower);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#0f172a]">
            {property ? 'Editar Propiedad' : 'Nueva Propiedad'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
              placeholder="Ej: Casa Moderna en Zona Norte"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Venta' | 'Alquiler' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
              >
                <option value="Venta">Venta</option>
                <option value="Alquiler">Alquiler</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Activa' | 'Pausada' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
              >
                <option value="Activa">Activa</option>
                <option value="Pausada">Pausada</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio {formData.type === 'Alquiler' && '(mensual)'}
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
              placeholder="Ej: Zona Norte, Ciudad"
            />
          </div>

          {/* Búsqueda de Propietario con Autocompletado */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Propietario *</label>
            <div className="relative">
              <input
                type="text"
                required
                value={landlordSearch}
                onChange={(e) => handleLandlordSearchChange(e.target.value)}
                onFocus={() => setShowLandlordDropdown(true)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                placeholder="Buscar propietario por nombre o email..."
              />
              <svg className="w-5 h-5 text-gray-400 absolute right-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Dropdown de resultados */}
            {showLandlordDropdown && landlordSearch && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredLandlords.length > 0 ? (
                  filteredLandlords.map(landlord => (
                    <button
                      key={landlord.email}
                      type="button"
                      onClick={() => handleLandlordSelect(landlord)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{landlord.name || landlord.email}</div>
                      <div className="text-sm text-gray-500">{landlord.email}</div>
                      {landlord.phone && (
                        <div className="text-xs text-gray-400">{landlord.phone}</div>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    No se encontraron propietarios
                  </div>
                )}
              </div>
            )}
            
            {landlords.length === 0 && (
              <p className="text-sm text-amber-600 mt-1">No hay propietarios disponibles. El administrador debe crear usuarios con rol "Propietario".</p>
            )}
            
            {formData.landlordEmail && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-900">Propietario seleccionado</p>
                    <p className="text-xs text-green-700 mt-1">
                      <span className="font-medium">Nombre:</span> {formData.landlordName}
                    </p>
                    <p className="text-xs text-green-700">
                      <span className="font-medium">Email:</span> {formData.landlordEmail}
                    </p>
                    <p className="text-xs text-green-700">
                      <span className="font-medium">Teléfono:</span> {formData.landlordPhone}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Habitaciones</label>
              <input
                type="number"
                required
                min="1"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Baños</label>
              <input
                type="number"
                required
                min="1"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Área (m²)</label>
              <input
                type="number"
                required
                min="1"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
              placeholder="Describe las características principales de la propiedad..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white font-semibold rounded-lg hover:from-[#0d9488] hover:to-[#0f766e] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {property ? 'Guardar Cambios' : 'Crear Propiedad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Rental Modal Component
interface RentalData {
  tenantEmail: string;
  startDate: string;
  endDate: string;
  adjustmentPeriod: 'trimestral' | 'semestral' | 'anual';
  adjustmentPercentage: number;
  status: 'active' | 'expiring' | 'expired';
}

function RentalModal({
  property,
  onClose,
  onSave
}: {
  property: Property;
  onClose: () => void;
  onSave: (data: RentalData & { landlordName: string; landlordPhone: string; landlordEmail: string; nextAdjustmentDate: string }) => void;
}) {
  const [formData, setFormData] = useState<RentalData>({
    tenantEmail: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    adjustmentPeriod: 'anual',
    adjustmentPercentage: 0,
    status: 'active'
  });

  const [tenants, setTenants] = useState<any[]>([]);
  const [tenantSearch, setTenantSearch] = useState('');
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);

  useEffect(() => {
    // Cargar inquilinos del localStorage (creados por el admin)
    const storedUsers = localStorage.getItem('systemUsers');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const tenantUsers = users.filter((u: any) => u.role === 'tenant' && u.status === 'active');
      setTenants(tenantUsers);
    }
  }, []);

  const handleTenantSelect = (tenant: any) => {
    setSelectedTenant(tenant);
    setFormData({ ...formData, tenantEmail: tenant.email });
    setTenantSearch(tenant.name || tenant.email);
    setShowTenantDropdown(false);
  };

  const handleTenantSearchChange = (value: string) => {
    setTenantSearch(value);
    setShowTenantDropdown(true);
    // Si se borra el campo, limpiar la selección
    if (!value) {
      setSelectedTenant(null);
      setFormData({ ...formData, tenantEmail: '' });
    }
  };

  const filteredTenants = tenants.filter(tenant => {
    const searchLower = tenantSearch.toLowerCase();
    const name = (tenant.name || '').toLowerCase();
    const email = tenant.email.toLowerCase();
    return name.includes(searchLower) || email.includes(searchLower);
  });

  // Calcular meses de ajuste automáticamente según el periodo
  const calculateAdjustmentMonths = () => {
    if (!formData.startDate || !formData.endDate) return [];
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const adjustmentMonths = [];
    let current = new Date(start);
    
    // Determinar el incremento según el periodo
    const incrementMonths = formData.adjustmentPeriod === 'trimestral' ? 3 
                          : formData.adjustmentPeriod === 'semestral' ? 6 
                          : 12; // anual
    
    // Primer ajuste
    current.setMonth(current.getMonth() + incrementMonths);
    
    while (current <= end) {
      adjustmentMonths.push(new Date(current));
      current.setMonth(current.getMonth() + incrementMonths);
    }
    
    return adjustmentMonths;
  };

  const adjustmentMonths = calculateAdjustmentMonths();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calcular la fecha del próximo ajuste según el periodo
    const nextAdjustmentDate = new Date(formData.startDate);
    const incrementMonths = formData.adjustmentPeriod === 'trimestral' ? 3 
                          : formData.adjustmentPeriod === 'semestral' ? 6 
                          : 12;
    nextAdjustmentDate.setMonth(nextAdjustmentDate.getMonth() + incrementMonths);
    
    // Información del propietario (de la propiedad)
    const landlordInfo = {
      landlordName: property.landlordName || 'Propietario de ' + property.title,
      landlordPhone: property.landlordPhone || '+54 11 0000-0000',
      landlordEmail: property.landlordEmail || 'propietario@email.com',
      nextAdjustmentDate: nextAdjustmentDate.toISOString().split('T')[0]
    };
    
    onSave({ ...formData, ...landlordInfo });
  };

  const periodLabels = {
    trimestral: 'Trimestral (cada 3 meses)',
    semestral: 'Semestral (cada 6 meses)',
    anual: 'Anual (cada año)'
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex-1"></div>
          <h2 className="text-2xl font-bold text-[#0f172a]">Crear Contrato de Alquiler</h2>
          <div className="flex-1 flex justify-end">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información de la Propiedad y Propietario */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Propiedad</h3>
            <div className="space-y-2">
              <p className="text-gray-700"><span className="font-medium">Título:</span> {property.title}</p>
              <p className="text-gray-700"><span className="font-medium">Ubicación:</span> {property.location}</p>
              <p className="text-gray-700"><span className="font-medium">Renta Mensual:</span> ${property.price.toLocaleString()}</p>
            </div>
            
            {/* Información del Propietario */}
            {property.landlordName && (
              <div className="mt-4 pt-4 border-t border-gray-300">
                <h4 className="text-md font-semibold text-[#0f172a] mb-2">Propietario</h4>
                <div className="space-y-1">
                  <p className="text-gray-700"><span className="font-medium">Nombre:</span> {property.landlordName}</p>
                  <p className="text-gray-700"><span className="font-medium">Teléfono:</span> {property.landlordPhone}</p>
                  <p className="text-gray-700"><span className="font-medium">Email:</span> {property.landlordEmail}</p>
                </div>
              </div>
            )}
          </div>

          {/* Búsqueda de Inquilino con Autocompletado */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Inquilino *</label>
            <div className="relative">
              <input
                type="text"
                required
                value={tenantSearch}
                onChange={(e) => handleTenantSearchChange(e.target.value)}
                onFocus={() => setShowTenantDropdown(true)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                placeholder="Buscar inquilino por nombre o email..."
              />
              <svg className="w-5 h-5 text-gray-400 absolute right-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Dropdown de resultados */}
            {showTenantDropdown && tenantSearch && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredTenants.length > 0 ? (
                  filteredTenants.map(tenant => (
                    <button
                      key={tenant.email}
                      type="button"
                      onClick={() => handleTenantSelect(tenant)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{tenant.name || tenant.email}</div>
                      <div className="text-sm text-gray-500">{tenant.email}</div>
                      {tenant.phone && (
                        <div className="text-xs text-gray-400">{tenant.phone}</div>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    No se encontraron inquilinos
                  </div>
                )}
              </div>
            )}
            
            {tenants.length === 0 && (
              <p className="text-sm text-amber-600 mt-1">No hay inquilinos disponibles. El administrador debe crear usuarios con rol "Inquilino".</p>
            )}
            
            {selectedTenant && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">Inquilino seleccionado</p>
                    <p className="text-xs text-blue-700 mt-1">
                      <span className="font-medium">Nombre:</span> {selectedTenant.name || selectedTenant.email}
                    </p>
                    <p className="text-xs text-blue-700">
                      <span className="font-medium">Email:</span> {selectedTenant.email}
                    </p>
                    {selectedTenant.phone && (
                      <p className="text-xs text-blue-700">
                        <span className="font-medium">Teléfono:</span> {selectedTenant.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Fechas del Contrato */}
          <div>
            <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Fechas del Contrato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio *</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Vencimiento *</label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Meses de Ajuste de Precio */}
          <div>
            <h3 className="text-lg font-semibold text-[#0f172a] mb-3">Meses de Ajuste</h3>
            <div className="mb-4">              
              <select
                required
                value={formData.adjustmentPeriod}
                onChange={(e) => setFormData({ ...formData, adjustmentPeriod: e.target.value as 'trimestral' | 'semestral' | 'anual' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
              >
                <option value="trimestral">Trimestral (cada 3 meses)</option>
                <option value="semestral">Semestral (cada 6 meses)</option>
                <option value="anual">Anual (cada año)</option>
              </select>
            </div>
            
            {/* Mostrar meses de ajuste calculados */}
            {adjustmentMonths.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Meses en que se ajustará el precio:</p>
                <div className="flex flex-wrap gap-2">
                  {adjustmentMonths.map((date, index) => (
                    <span key={index} className="px-3 py-1 bg-[#14b8a6] text-white rounded-full text-xs font-medium">
                      {date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  El ajuste se aplicará {periodLabels[formData.adjustmentPeriod].toLowerCase()}.
                </p>
              </div>
            )}
            
            {adjustmentMonths.length === 0 && formData.startDate && formData.endDate && (
              <p className="text-sm text-gray-500">
                No hay ajustes programados para el periodo seleccionado.
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white font-semibold rounded-lg hover:from-[#0d9488] hover:to-[#0f766e] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Crear Contrato
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
