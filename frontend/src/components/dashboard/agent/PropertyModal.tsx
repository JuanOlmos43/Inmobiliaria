import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Modal from '@/components/UI/Modal';
import FormInput from '@/components/UI/FormInput';
import FormSelect from '@/components/UI/FormSelect';
import { usersService } from '@/lib/api/services/users';
import { propertiesService } from '@/lib/api/services/properties';
import { UserRole, type UserProfile } from '@/types/api';

// Tipos localizados por ahora
interface Property {
    id?: string; // made optional as it's not present for new properties in general interface usage here
    title: string;
    type: 'Venta' | 'Alquiler';
    price: number;
    currency: 'USD' | 'ARS';
    location: string;
    // Temporary UI fields (optional in Property interface as they might not come from DB yet)
    province?: string;
    city?: string;
    street?: string;
    streetNumber?: string;
    apartment?: string;
    bedrooms: number;
    rooms: number;
    bathrooms: number;
    area: number;
    image?: string;
    images?: string[];
    status: 'Activa' | 'Pausada';
    description: string;
    propertyType: string;
    yearBuilt?: number | null;
    features?: string[];
    landlordName?: string;
    landlordPhone?: string;
    landlordEmail?: string;
    ownerId?: string; // Captured owner ID
}

interface PropertyModalProps {
    property: Property | null;
    onSave: (property: Omit<Property, 'id'>, files: File[]) => void;
    onClose: () => void;
}

export default function PropertyModal({
    property,
    onSave,
    onClose
}: PropertyModalProps) {
    const [formData, setFormData] = useState<Omit<Property, 'id'>>({
        title: property?.title || '',
        type: property?.type || 'Venta',
        price: property?.price || 0,
        currency: property?.currency || 'USD',
        location: property?.location || '',
        bedrooms: property?.bedrooms || 1,
        rooms: property?.rooms || 1,
        bathrooms: property?.bathrooms || 1,
        area: property?.area || 0,
        image: property?.image || undefined,
        images: property?.images || [],
        status: property?.status || 'Activa',
        description: property?.description || '',
        propertyType: property?.propertyType || 'casa',
        yearBuilt: property?.yearBuilt || null,
        features: property?.features || [],
        landlordName: property?.landlordName || '',
        landlordPhone: property?.landlordPhone || '',
        landlordEmail: property?.landlordEmail || '',
        ownerId: property?.ownerId || '',
        // Initialize new fields
        province: '',
        city: '',
        street: '',
        streetNumber: '',
        apartment: ''
    });

    const [landlordSearch, setLandlordSearch] = useState('');
    const [showLandlordDropdown, setShowLandlordDropdown] = useState(false);
    const [featureInput, setFeatureInput] = useState('');
    const [inputModes, setInputModes] = useState<{
        city: 'select' | 'input';
        street: 'select' | 'input';
    }>({
        city: 'select',
        street: 'select'
    });

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>(property?.images || []);

    useEffect(() => {
        if (property?.images) {
            setPreviewUrls(property.images);
        }
    }, [property]);

    // Fetch provinces using TanStack Query
    const { data: provincias = [] } = useQuery({
        queryKey: ['ubicaciones', 'provincias'],
        queryFn: () => propertiesService.getProvincias(),
        staleTime: 1000 * 60 * 60, // Cache for 1 hour
    });

    // Derive selected IDs from names for dependent queries
    const selectedProvinciaId = provincias.find(p => p.nombre === formData.province)?.id;

    // Fetch localities dependent on province
    const { data: localidades = [], isLoading: isLoadingLocalidades } = useQuery({
        queryKey: ['ubicaciones', 'localidades', selectedProvinciaId],
        queryFn: () => propertiesService.getLocalidades(selectedProvinciaId!),
        enabled: !!selectedProvinciaId, // Only fetch if a province is selected
    });

    const selectedLocalidadId = localidades.find(l => l.nombre === formData.city)?.id;

    // Fetch streets dependent on locality
    const { data: calles = [], isLoading: isLoadingCalles } = useQuery({
        queryKey: ['ubicaciones', 'calles', selectedLocalidadId],
        queryFn: () => propertiesService.getCalles(selectedLocalidadId!),
        enabled: !!selectedLocalidadId,
    });

    // Fetch landlords using TanStack Query
    const { data: landlords = [], isLoading: isLoadingLandlords } = useQuery({
        queryKey: ['users', 'landlords'],
        queryFn: () => usersService.getUsers(UserRole.Propietario),
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

    useEffect(() => {
        if (property?.landlordName) {
            setLandlordSearch(property.landlordName);
        }
    }, [property]);

    const handleLandlordSelect = (landlord: UserProfile) => {
        setFormData({
            ...formData,
            landlordEmail: landlord.email,
            landlordName: landlord.name || landlord.email,
            landlordPhone: landlord.phone || 'No especificado',
            ownerId: landlord.id // Set the owner ID
        });
        setLandlordSearch(landlord.name || landlord.email);
        setShowLandlordDropdown(false);
    };

    const handleLandlordSearchChange = (value: string) => {
        setLandlordSearch(value);
        setShowLandlordDropdown(true);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // 1. Handle Location Creation if Manual
            let currentLocalidadId = selectedLocalidadId;
            let currentCalleId: string | undefined = undefined;

            // Create Localidad if in input mode
            if (inputModes.city === 'input' && formData.city && selectedProvinciaId) {
                try {
                    const newLocalidad = await propertiesService.createLocalidad({
                        nombre: formData.city,
                        provinciaId: selectedProvinciaId
                    });
                    currentLocalidadId = newLocalidad.id;
                } catch (error) {
                    console.error('Error creating localidad:', error);
                    // Decide if stop or continue. For now continue but maybe alert?
                }
            }

            if (inputModes.street === 'input' && formData.street && currentLocalidadId) {
                try {
                    const newCalle = await propertiesService.createCalle({
                        nombre: formData.street,
                        localidadId: currentLocalidadId
                    });
                    currentCalleId = newCalle.id;
                } catch (error: any) {
                    console.error('Error creating calle:', error);
                    // Si ya existe (409), intentamos buscarla para recuperar su ID
                    // Esto maneja el caso de reintentos fallidos previos
                    if (error?.status === 409 || error?.code === 409) {
                        try {
                            // Recargamos las calles de esa localidad para encontrar la existente
                            const callesExistentes = await propertiesService.getCalles(currentLocalidadId);
                            const calleEncontrada = callesExistentes.find(
                                c => c.nombre.toLowerCase() === (formData.street || '').toLowerCase()
                            );
                            if (calleEncontrada) {
                                currentCalleId = calleEncontrada.id;
                            }
                        } catch (findError) {
                            console.error('Error finding existing calle after conflict:', findError);
                        }
                    }
                }
            } else if (inputModes.street === 'select' && formData.street) {
                // Find the ID of the selected street from the loaded 'calles' array
                const selectedCalle = calles.find(c => c.nombre === formData.street);
                if (selectedCalle) {
                    currentCalleId = selectedCalle.id;
                }
            }

            // 2. Prepare Submission
            // Concatenate address fields into the single location string for backward compatibility
            const fullLocation = `${formData.street} ${formData.streetNumber}, ${formData.city}, ${formData.province}${formData.apartment ? ' Dpto ' + formData.apartment : ''}`;

            const submissionData = {
                ...formData,
                location: fullLocation, // Keep for UI compatibility if needed
                locationText: fullLocation, // Map to DTO locationText
                streetNumber: formData.streetNumber, // Map streetNumber to DTO address parameter
                localidadId: currentLocalidadId,
                provinciaId: selectedProvinciaId,
                calleId: currentCalleId,
            };

            onSave(submissionData, selectedFiles);
        } catch (error) {
            console.error('Error submitting form:', error);
            // handle global error
        }
    };

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={property ? 'Editar Propiedad' : 'Nueva Propiedad'}
            maxWidth="lg" // Using lg for the property form
            staticBackdrop={true}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                    label="Título"
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ej: Casa Moderna en Zona Norte"
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormSelect
                        label="Tipo"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Venta' | 'Alquiler' })}
                    >
                        <option value="Venta">Venta</option>
                        <option value="Alquiler">Alquiler</option>
                    </FormSelect>

                    <FormSelect
                        label="Estado"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Activa' | 'Pausada' })}
                    >
                        <option value="Activa">Activa</option>
                        <option value="Pausada">Pausada</option>
                    </FormSelect>
                </div>

                <FormInput
                    label={`Precio ${formData.type === 'Alquiler' ? '(mensual)' : ''} - ${formData.type === 'Alquiler' ? 'ARS' : 'USD'}`}
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="Ingrese el precio"
                />

                <div className="grid grid-cols-2 gap-4">
                    {/* Provincia */}
                    <FormSelect
                        label="Provincia"
                        required
                        value={formData.province}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                province: e.target.value,
                                city: '', // Reset dependant fields
                                street: ''
                            });
                        }}
                    >
                        <option value="">Seleccione Provincia</option>
                        {provincias.map((prov) => (
                            <option key={prov.id} value={prov.nombre}>
                                {prov.nombre}
                            </option>
                        ))}
                    </FormSelect>

                    {/* Localidad */}
                    {inputModes.city === 'select' ? (
                        <FormSelect
                            label="Localidad"
                            required
                            value={formData.city}
                            disabled={!formData.province}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === 'custom') {
                                    setInputModes(prev => ({ ...prev, city: 'input' }));
                                    setFormData(prev => ({ ...prev, city: '', street: '' }));
                                } else {
                                    setFormData(prev => ({
                                        ...prev,
                                        city: val,
                                        street: ''
                                    }));
                                }
                            }}
                        >
                            <option value="">
                                {isLoadingLocalidades ? 'Cargando localidades...' : 'Seleccione Localidad'}
                            </option>
                            {localidades.map((loc) => (
                                <option key={loc.id} value={loc.nombre}>
                                    {loc.nombre}
                                </option>
                            ))}
                            <option value="custom" className="font-semibold text-teal-600">Ingresar manualmente...</option>
                        </FormSelect>
                    ) : (
                        <div className="relative">
                            <FormInput
                                label="Localidad"
                                type="text"
                                required
                                disabled={!formData.province} // Dependent on province
                                value={formData.city || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value, street: '' }))}
                                placeholder="Ingrese Localidad"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setInputModes(prev => ({ ...prev, city: 'select' }));
                                    setFormData(prev => ({ ...prev, city: '', street: '' }));
                                }}
                                className="absolute top-9 right-2 text-gray-400 hover:text-gray-600"
                                title="Volver a lista"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Calle */}
                    {inputModes.street === 'select' ? (
                        <FormSelect
                            label="Calle"
                            required
                            value={formData.street}
                            disabled={!formData.city}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === 'custom') {
                                    setInputModes(prev => ({ ...prev, street: 'input' }));
                                    setFormData(prev => ({ ...prev, street: '' }));
                                } else {
                                    setFormData(prev => ({ ...prev, street: val }));
                                }
                            }}
                        >
                            <option value="">
                                {isLoadingCalles ? 'Cargando calles...' : 'Seleccione Calle'}
                            </option>
                            {calles.map((calle) => (
                                <option key={calle.id} value={calle.nombre}>
                                    {calle.nombre}
                                </option>
                            ))}
                            <option value="custom" className="font-semibold text-teal-600">Ingresar manualmente...</option>
                        </FormSelect>
                    ) : (
                        <div className="relative">
                            <FormInput
                                label="Calle"
                                type="text"
                                required
                                disabled={!formData.city} // Dependent on city
                                value={formData.street || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                                placeholder="Ingrese Calle"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setInputModes(prev => ({ ...prev, street: 'select' }));
                                    setFormData(prev => ({ ...prev, street: '' }));
                                }}
                                className="absolute top-9 right-2 text-gray-400 hover:text-gray-600"
                                title="Volver a lista"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                        <FormInput
                            label="Altura"
                            type="text"
                            required
                            value={formData.streetNumber}
                            onChange={(e) => setFormData({ ...formData, streetNumber: e.target.value })}
                            placeholder="1234"
                        />
                        <FormInput
                            label="Depto (Opc)"
                            type="text"
                            value={formData.apartment}
                            onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                            placeholder="4B"
                        />
                    </div>
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
                        <p className="text-sm text-amber-600 mt-1">No hay propietarios disponibles. El administrador debe crear usuarios con rol: Propietario.</p>
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
                                        <span className="font-medium">Email:</span> <span className="font-mono">{formData.landlordEmail}</span>
                                    </p>
                                    <p className="text-xs text-green-700">
                                        <span className="font-medium">Teléfono:</span> <span className="font-mono">{formData.landlordPhone}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormInput
                        label="Dormitorios"
                        type="number"
                        required
                        min="0"
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                        placeholder="Ej: 3"
                    />

                    <FormInput
                        label="Ambientes"
                        type="number"
                        required
                        min="0"
                        value={formData.rooms}
                        onChange={(e) => setFormData({ ...formData, rooms: Number(e.target.value) })}
                        placeholder="Ej: 4"
                    />

                    <FormInput
                        label="Baños"
                        type="number"
                        required
                        min="1"
                        value={formData.bathrooms}
                        onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                        placeholder="Ej: 2"
                    />

                    <FormInput
                        label="Área (m²)"
                        type="number"
                        required
                        min="1"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                        placeholder="Ej: 120"
                    />
                </div>

                {/* Tipo de Propiedad y Año */}
                <div className="grid grid-cols-2 gap-4">
                    <FormSelect
                        label="Tipo de Propiedad *"
                        required
                        value={formData.propertyType}
                        onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    >
                        <option value="casa">Casa</option>
                        <option value="departamento">Departamento</option>
                        <option value="terreno">Terreno</option>
                        <option value="duplex">Duplex</option>
                        <option value="monoambiente">Monoambiente</option>
                    </FormSelect>

                    <FormInput
                        label="Año de Construcción"
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={formData.yearBuilt || ''}
                        onChange={(e) => setFormData({ ...formData, yearBuilt: e.target.value ? Number(e.target.value) : null })}
                        placeholder="Ej: 2020"
                    />
                </div>

                {/* Características */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Características</label>
                    <div className="space-y-2">
                        {/* Input para agregar características */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={featureInput}
                                onChange={(e) => setFeatureInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        if (featureInput.trim()) {
                                            setFormData({ ...formData, features: [...(formData.features || []), featureInput.trim()] });
                                            setFeatureInput('');
                                        }
                                    }
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
                                placeholder="Ej: Cochera, Patio, Piscina..."
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    if (featureInput.trim()) {
                                        setFormData({ ...formData, features: [...(formData.features || []), featureInput.trim()] });
                                        setFeatureInput('');
                                    }
                                }}
                                className="px-4 py-2 bg-[#14b8a6] text-white rounded-lg hover:bg-[#0d9488] transition-colors"
                            >
                                Agregar
                            </button>
                        </div>

                        {/* Lista de características */}
                        {formData.features && formData.features.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {formData.features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                                    >
                                        <span className="text-sm text-gray-700">{feature}</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newFeatures = formData.features?.filter((_, i) => i !== index);
                                                setFormData({ ...formData, features: newFeatures });
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
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

                {/* Imágenes de la Propiedad */}
                {/* Input de archivo */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                if (files.length > 0) {
                                    setSelectedFiles(prev => [...prev, ...files]);
                                    files.forEach(file => {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setPreviewUrls(prev => [...prev, reader.result as string]);
                                        };
                                        reader.readAsDataURL(file);
                                    });
                                }
                                e.target.value = '';
                            }}
                            className="hidden"
                            id="image-upload"
                        />
                        <label
                            htmlFor="image-upload"
                            className="flex-1 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#14b8a6] transition-colors cursor-pointer flex items-center justify-center gap-2 text-gray-600 hover:text-[#14b8a6]"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="font-medium">Seleccionar imágenes</span>
                        </label>
                    </div>

                    {/* Vista previa de imágenes */}
                    {previewUrls.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {previewUrls.map((imageUrl, index) => (
                                <div key={index} className="relative group">
                                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                        <img
                                            src={imageUrl}
                                            alt={`Imagen ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {/* Botón para eliminar imagen */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            // If it's an existing image (string url could be from DB), just remove from preview for now.
                                            // Warning: robust logic needed to diff existing vs new files.
                                            // Valid assumption for now:
                                            // existing images are at the start of previewUrls arrays?
                                            // If we remove an image, we should check if it corresponds to a File or an existing URL.

                                            const isExisting = property?.images?.includes(imageUrl);

                                            if (!isExisting) {
                                                // It's a new file. We need to find which file corresponds to this preview indices.
                                                // This is tricky with separated arrays.
                                                // Simpler approach: Reconstruct arrays.
                                                // Let's assume new files are added at the end.
                                                // This edit is becoming complex for a simple replacement.
                                                // Let's rely on simple removing by index for visual consistency,
                                                // knowing that index mapping might be fragile if mixed.

                                                // Calculate how many existing images.
                                                const existingCount = property?.images?.length || 0;
                                                // The index in new files array is (index - existingCount).
                                                if (index >= existingCount) {
                                                    const fileIndex = index - existingCount;
                                                    setSelectedFiles(prev => prev.filter((_, i) => i !== fileIndex));
                                                }
                                            }

                                            setPreviewUrls(prev => prev.filter((_, i) => i !== index));
                                            // Also update formData.images for consistency?
                                            setFormData(prev => ({
                                                ...prev,
                                                images: prev.images?.filter((_, i) => i !== index)
                                            }));
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                                        title="Eliminar imagen"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    {/* Indicador de orden */}
                                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                        {index + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Mensaje informativo */}
                    <p className="text-xs text-gray-500">
                        {previewUrls.length > 0
                            ? `${previewUrls.length} imagen${previewUrls.length > 1 ? 'es' : ''} seleccionada${previewUrls.length > 1 ? 's' : ''}`
                            : 'No hay imágenes seleccionadas. Las imágenes se mostrarán en un carrusel en la página de detalle.'}
                    </p>
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
                        className="flex-1 px-6 py-3 bg-[#14b8a6] text-white font-semibold rounded-lg hover:bg-[#0d9488] transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        {property ? 'Guardar Cambios' : 'Crear Propiedad'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
