import { useQuery } from "@tanstack/react-query";
import { healthApi } from "@/entities/health";

export function useAppBootstrap() {
  const readiness = useQuery({
    queryKey: ["health", "readiness"],
    queryFn: ({ signal }) => healthApi.getApiHealth(signal),
    staleTime: 15_000,
    retry: 2,
  });

  return {
    isLoading: readiness.isPending,
    isUnavailable: readiness.isError,
    retry: readiness.refetch,
    isRetrying: readiness.isFetching,
  };
}
