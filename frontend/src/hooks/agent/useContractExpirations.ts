import { useQuery } from "@tanstack/react-query";
import { contratosService } from "@/lib/api/services/contratos";
import { ContractActivity } from "@/types/api";

export function useContractExpirations(filters?: {
    type?: "all" | "end_contract" | "adjustment";
    search?: string;
    role?: "tenant" | "landlord";
}) {
    const {
        data: activities = [],
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ["contracts", "dashboard", "expirations", filters],
        queryFn: () => contratosService.getDashboardExpirations(filters),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Helper to get expiring contracts
    const expiringContracts = (activities as ContractActivity[]).filter(
        (a) => a.eventType === "end_contract" || a.eventType === "both"
    );

    // Helper to get adjustment contracts
    const adjustmentContracts = (activities as ContractActivity[]).filter(
        (a) => a.eventType === "adjustment" || a.eventType === "both"
    );

    return {
        activities: activities as ContractActivity[],
        expiringContracts,
        adjustmentContracts,
        isLoading,
        error,
        refetch
    };
}
