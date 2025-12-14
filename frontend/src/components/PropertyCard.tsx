import Image from 'next/image';

interface PropertyCardProps {
  id: number;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: 'venta' | 'alquiler';
  image: string;
}

export default function PropertyCard({
  title,
  price,
  location,
  bedrooms,
  bathrooms,
  area,
  type,
  image,
}: PropertyCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
        {/* Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-[#C69B56] text-white px-3 py-1 rounded text-sm font-semibold">
            {type === 'venta' ? 'Venta' : 'Alquiler'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-semibold text-[#0A2647] mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Price */}
        <p className="text-2xl font-bold text-[#0A2647] mb-3">
          USD {price.toLocaleString('es-AR')}
        </p>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-4">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">{location}</span>
        </div>

        {/* Features */}
        <div className="flex items-center justify-between text-gray-700 border-t pt-3">
          {/* Bedrooms */}
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-sm">{bedrooms} Dorm.</span>
          </div>

          {/* Bathrooms */}
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
            <span className="text-sm">{bathrooms} Baños</span>
          </div>

          {/* Area */}
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <span className="text-sm">{area} m²</span>
          </div>
        </div>
      </div>
    </div>
  );
}
