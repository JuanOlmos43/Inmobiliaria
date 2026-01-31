import { Dispatch, SetStateAction, useEffect } from "react";
import { useLandlordSearch } from "@/hooks/useLandlordSearch";
import { type UserProfile } from "@/types/api";
import { Property } from "@/types/property";

interface LandlordSectionProps {
  formData: Omit<Property, "id">;
  setFormData: Dispatch<SetStateAction<Omit<Property, "id">>>;
  initialSearchName?: string;
}

export default function LandlordSection({
  formData,
  setFormData,
  initialSearchName = "",
}: LandlordSectionProps) {
  const {
    landlordSearch,
    setLandlordSearch,
    showLandlordDropdown,
    setShowLandlordDropdown,
    landlords,
  } = useLandlordSearch(initialSearchName);

  useEffect(() => {
    if (initialSearchName) {
      setLandlordSearch(initialSearchName);
    }
  }, [initialSearchName, setLandlordSearch]);

  const handleSelect = (landlord: UserProfile) => {
    setFormData((prev) => ({
      ...prev,
      landlordEmail: landlord.email,
      landlordName: landlord.name || landlord.email,
      landlordPhone: landlord.phone || "No especificado",
      ownerId: landlord.id,
    }));
    setLandlordSearch(landlord.name || landlord.email);
    setShowLandlordDropdown(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Propietario *
      </label>
      <div className="relative">
        <input
          type="text"
          required
          value={landlordSearch}
          onChange={(e) => {
            const val = e.target.value;
            setLandlordSearch(val);
            setShowLandlordDropdown(true);
            if (!val) {
              setFormData((prev) => ({
                ...prev,
                landlordEmail: "",
                landlordName: "",
                landlordPhone: "",
                ownerId: "",
              }));
            }
          }}
          onFocus={() => setShowLandlordDropdown(true)}
          className="w-full px-4 py-2 border rounded-lg transition-all duration-300 border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-(--accent) focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
          placeholder="Buscar propietario..."
          maxLength={100}
        />
      </div>

      {showLandlordDropdown && landlordSearch && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {landlords.length > 0 ? (
            landlords.map((landlord) => (
              <button
                key={landlord.id}
                type="button"
                onClick={() => handleSelect(landlord)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b last:border-0"
              >
                <div className="font-medium">
                  {landlord.name || landlord.email}
                </div>
                <div className="text-sm text-gray-500">{landlord.email}</div>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 italic">
              No se encontraron propietarios
            </div>
          )}
        </div>
      )}

      {formData.ownerId && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
          <div className="font-semibold text-green-800">
            {formData.landlordName}
          </div>
          <div className="text-green-700">{formData.landlordEmail}</div>
          <div className="text-green-700">{formData.landlordPhone}</div>
        </div>
      )}
    </div>
  );
}
