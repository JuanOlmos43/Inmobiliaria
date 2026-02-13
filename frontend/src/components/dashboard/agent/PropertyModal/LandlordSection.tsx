import { Dispatch, SetStateAction, useEffect } from "react";
import { useLandlordSearch } from "@/hooks/useLandlordSearch";
import { type UserProfile } from "@/types/api";
import { Property } from "@/types/property";
import { Icon } from "@/components/ui";

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
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Propietario *
      </label>
      <div className="relative">
        <Icon
          name="user"
          className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400"
        />
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
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-gray-900 placeholder-gray-500 transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-(--accent) focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
          placeholder="Buscar propietario..."
          maxLength={100}
        />
      </div>

      {showLandlordDropdown && landlordSearch && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg">
          {landlords.length > 0 ? (
            landlords.map((landlord) => (
              <button
                key={landlord.id}
                type="button"
                onClick={() => handleSelect(landlord)}
                className="w-full border-b px-4 py-3 text-left last:border-0 hover:bg-gray-50"
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
        <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3 text-sm">
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
