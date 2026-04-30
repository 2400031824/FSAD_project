import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

export function useRecruiters() {
  return useQuery({
    queryKey: [api.recruiters.list.path],
    queryFn: async () => {
      const res = await fetch(api.recruiters.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch recruiters");
      return api.recruiters.list.responses[200].parse(await res.json());
    },
  });
}

export function useRecruiterDetails(id?: number) {
  return useQuery({
    queryKey: [api.recruiters.details.path, id],
    queryFn: async () => {
      const url = buildUrl(api.recruiters.details.path, { id: id as number });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch recruiter details");
      return api.recruiters.details.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateRecruiter() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: z.infer<typeof api.recruiters.create.input>) => {
      const res = await fetch(api.recruiters.create.path, {
        method: api.recruiters.create.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.message || "Failed to create recruiter");
      }
      return api.recruiters.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.recruiters.list.path] });
      toast({ title: "Recruiter added", description: "New recruiter account created." });
    },
    onError: (error) => {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    },
  });
}

export function useApproveRecruiter() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.users.approveEmployer.path, { id });
      const res = await fetch(url, {
        method: api.users.approveEmployer.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.message || "Failed to approve recruiter");
      }
      return api.users.approveEmployer.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.recruiters.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.recruiters.details.path] });
      toast({ title: "Approved", description: "Recruiter has been approved." });
    },
    onError: (error) => {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    },
  });
}
