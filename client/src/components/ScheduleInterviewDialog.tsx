import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useInterviewSlots, useBookSlot } from "@/hooks/use-interviews";
import { Clock, Video } from "lucide-react";

export function ScheduleInterviewDialog({
  jobId,
  applicationId,
  children,
}: {
  jobId: number;
  applicationId: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { data: slots, isLoading } = useInterviewSlots(jobId);
  const { mutate: bookSlot, isPending } = useBookSlot();

  const handleBook = (slotId: number) => {
    bookSlot({ slotId, applicationId }, { onSuccess: () => setOpen(false) });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="border-white/[0.08] bg-[#0e0e0e] text-[#f0ede8] sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold tracking-[-0.03em]">
            Select Interview Slot
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="mb-4 font-mono-ui text-sm leading-7 text-[#f0ede8]/45">
            Choose a time slot below. Times are automatically converted to your local timezone.
          </p>

          {isLoading ? (
            <p className="font-mono-ui text-sm text-[#f0ede8]/42">Loading available slots...</p>
          ) : slots?.length === 0 ? (
            <p className="border border-[#f0c84a]/30 bg-[#f0c84a]/10 p-3 font-mono-ui text-sm text-[#f0c84a]">
              No open slots available for this job at the moment.
            </p>
          ) : (
            <div className="max-h-[300px] space-y-2 overflow-y-auto pr-2">
              {slots?.map((slot: any) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between border border-white/[0.08] bg-[#080808] p-3 transition-colors hover:border-[#c8f04a]/60"
                >
                  <div>
                    <p className="font-medium text-[#f0ede8]">{slot.roundType} Round</p>
                    <div className="mt-1 flex items-center font-mono-ui text-xs text-[#f0ede8]/42">
                      <Clock className="mr-1 h-3 w-3 text-[#c8f04a]" />
                      {new Date(slot.startTime).toLocaleDateString()} / {new Date(slot.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleBook(slot.id)} disabled={isPending} className="pis-button">
                    <Video className="mr-1 h-3 w-3" />
                    Book Slot
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
