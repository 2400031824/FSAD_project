import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

export function useInterviewSlots(jobId: number) {
  return useQuery({
    queryKey: [api.interviews.listSlots.path, jobId],
    queryFn: async () => {
      const url = buildUrl(api.interviews.listSlots.path, { id: jobId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch interview slots");
      return api.interviews.listSlots.responses[200].parse(await res.json());
    },
    enabled: !!jobId,
  });
}

export function useMySchedule() {
  return useQuery({
    queryKey: [api.interviews.mySchedule.path],
    queryFn: async () => {
      const res = await fetch(api.interviews.mySchedule.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch schedule");
      return api.interviews.mySchedule.responses[200].parse(await res.json());
    },
  });
}

export function useCreateSlot(jobId: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: z.infer<typeof api.interviews.createSlot.input>) => {
      const url = buildUrl(api.interviews.createSlot.path, { id: jobId });
      const res = await fetch(url, {
        method: api.interviews.createSlot.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.message || "Failed to create slot");
      }
      return api.interviews.createSlot.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.interviews.listSlots.path, jobId] });
      queryClient.invalidateQueries({ queryKey: [api.interviews.mySchedule.path] });
      toast({ title: "Slot created", description: "Interview slot added." });
    },
    onError: (error) => {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    },
  });
}

export function useBookSlot() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ slotId, applicationId }: { slotId: number; applicationId: number }) => {
      const url = buildUrl(api.interviews.bookSlot.path, { id: slotId });
      const res = await fetch(url, {
        method: api.interviews.bookSlot.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ applicationId }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.message || "Failed to book slot");
      }
      return api.interviews.bookSlot.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.interviews.mySchedule.path] });
      // Invalidate applications to update the status
      queryClient.invalidateQueries({ queryKey: [api.applications.list.path] });
      toast({ title: "Interview Booked!", description: "Meeting link generated." });
    },
    onError: (error) => {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    },
  });
}
