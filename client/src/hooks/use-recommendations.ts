import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useJobRecommendations() {
  return useQuery({
    queryKey: [api.jobs.getRecommendations.path],
    queryFn: async () => {
      const res = await fetch(api.jobs.getRecommendations.path, { credentials: "include" });
      if (!res.ok) {
        // If the user isn't a student, it returns 403, which is fine, just return empty array
        if (res.status === 403) return [];
        throw new Error("Failed to fetch recommendations");
      }
      return api.jobs.getRecommendations.responses[200].parse(await res.json());
    },
  });
}
