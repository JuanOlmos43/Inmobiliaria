import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { usersService } from "@/lib/api/services/users";
import { UserRole } from "@/types/api";

export function useLandlordSearch(initialSearch: string = "") {
    const [landlordSearch, setLandlordSearch] = useState(initialSearch);
    const [showLandlordDropdown, setShowLandlordDropdown] = useState(false);
    const debouncedSearch = useDebounce(landlordSearch, 500);

    const { data: landlords = [], isLoading: isLoadingLandlords } = useQuery({
        queryKey: ["users", "landlords", debouncedSearch],
        queryFn: () =>
            usersService.getUsers({
                role: UserRole.Propietario,
                search: debouncedSearch,
            }),
        enabled: showLandlordDropdown, // Only query if dropdown is/was open
    });

    return {
        landlordSearch,
        setLandlordSearch,
        showLandlordDropdown,
        setShowLandlordDropdown,
        landlords,
        isLoadingLandlords,
    };
}
