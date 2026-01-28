import { useQuery } from "@tanstack/react-query";
import { propertiesService } from "@/lib/api/services/properties";

export function useLocationLogic(provinciaId?: string, localidadId?: string) {
    // Fetch provinces
    const { data: provincias = [] } = useQuery({
        queryKey: ["ubicaciones", "provincias"],
        queryFn: () => propertiesService.getProvincias(),
        staleTime: 1000 * 60 * 60,
    });

    // Fetch localities dependent on province
    const { data: localidades = [], isLoading: isLoadingLocalidades } = useQuery({
        queryKey: ["ubicaciones", "localidades", provinciaId],
        queryFn: () => propertiesService.getLocalidades(provinciaId!),
        enabled: !!provinciaId,
    });

    // Fetch streets dependent on locality
    const { data: calles = [], isLoading: isLoadingCalles } = useQuery({
        queryKey: ["ubicaciones", "calles", localidadId],
        queryFn: () => propertiesService.getCalles(localidadId!),
        enabled: !!localidadId,
    });

    return {
        provincias,
        localidades,
        calles,
        isLoadingLocalidades,
        isLoadingCalles,
    };
}
