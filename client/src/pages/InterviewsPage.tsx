import { useState } from "react";
import { useUser } from "@/hooks/use-auth";
import { useMySchedule, useCreateSlot } from "@/hooks/use-interviews";
import { useJobs } from "@/hooks/use-jobs";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Video, CalendarDays, Clock, Plus } from "lucide-react";

export default function InterviewsPage() {
  const { data: user } = useUser();
  const { data: schedule, isLoading } = useMySchedule();
  const { data: jobs } = useJobs();
  const employerJobs = jobs?.filter(j => j.employerId === user?.id) || [];

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | "">("");
  const [newSlot, setNewSlot] = useState({ startTime: "", endTime: "", roundType: "Technical" });

  // Use a dummy hook when selectedJobId is empty; we handle the null case manually in handleCreate
  const { mutate: createSlot, isPending: isCreating } = useCreateSlot(Number(selectedJobId) || 0);

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobId) return;
    createSlot({
      startTime: new Date(newSlot.startTime).toISOString(),
      endTime: new Date(newSlot.endTime).toISOString(),
      roundType: newSlot.roundType
    }, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setNewSlot({ startTime: "", endTime: "", roundType: "Technical" });
      }
    });
  };

  if (isLoading) return <p className="font-mono-ui text-sm text-[#f0ede8]/45">Loading schedule...</p>;

  const upcoming = schedule?.filter((s: any) => new Date(s.startTime) > new Date() && s.status !== "cancelled") || [];
  const past = schedule?.filter((s: any) => new Date(s.startTime) <= new Date() || s.status === "cancelled") || [];

  return (
    <div className="space-y-8 text-[#f0ede8]">
      <div className="flex items-start justify-between">
        <div>
          <p className="pis-kicker mb-3">My Interviews</p>
          <h1 className="pis-page-title mb-3">Interview Schedule</h1>
          <p className="font-mono-ui text-sm text-[#f0ede8]/45">Manage your upcoming technical and HR rounds.</p>
        </div>

        {user?.role === "employer" && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="pis-button hover:opacity-85">
                <Plus className="w-4 h-4 mr-2" />
                Add Time Slot
              </Button>
            </DialogTrigger>
            <DialogContent className="border-white/[0.08] bg-[#0e0e0e] text-[#f0ede8] sm:max-w-[420px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-extrabold tracking-[-0.03em]">Create Interview Slot</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateSlot} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label className="pis-label">Job Posting</Label>
                  <select 
                    className="pis-input h-10 w-full px-3 text-sm"
                    value={selectedJobId} 
                    onChange={e => setSelectedJobId(Number(e.target.value))} 
                    required
                  >
                    <option value="">Select a job...</option>
                    {employerJobs.map(job => (
                      <option key={job.id} value={job.id}>{job.title}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="pis-label">Round Type</Label>
                  <select 
                    className="pis-input h-10 w-full px-3 text-sm"
                    value={newSlot.roundType} 
                    onChange={e => setNewSlot({...newSlot, roundType: e.target.value})}
                  >
                    <option>Technical</option>
                    <option>HR</option>
                    <option>Aptitude</option>
                    <option>Managerial</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="pis-label">Start Time</Label>
                    <Input type="datetime-local" className="pis-input" required value={newSlot.startTime} onChange={e => setNewSlot({...newSlot, startTime: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="pis-label">End Time</Label>
                    <Input type="datetime-local" className="pis-input" required value={newSlot.endTime} onChange={e => setNewSlot({...newSlot, endTime: e.target.value})} />
                  </div>
                </div>
                <Button type="submit" className="pis-button mt-4 w-full hover:opacity-85" disabled={isCreating}>
                  {isCreating ? "Adding..." : "Add Slot"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-extrabold tracking-[-0.03em]">Upcoming Interviews</h2>
        {upcoming.length === 0 ? (
          <Card className="border-dashed border-white/[0.12] bg-[#0e0e0e]">
            <CardContent className="flex flex-col items-center justify-center py-12 text-[#f0ede8]/45">
              <CalendarDays className="mb-4 h-12 w-12 text-[#c8f04a] opacity-70" />
              <p className="font-mono-ui text-sm">No upcoming interviews scheduled.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-px border border-white/[0.08] bg-white/[0.08] md:grid-cols-2 xl:grid-cols-3">
            {upcoming.map((slot: any) => (
              <Card key={slot.id} className="relative overflow-hidden rounded-none border-0 bg-[#080808] transition-colors hover:bg-[#141414]">
                <div className="absolute left-0 top-0 h-full w-1 bg-[#c8f04a]" />
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-semibold text-lg">{slot.roundType} Round</p>
                      <p className="font-mono-ui text-sm font-medium text-[#c8f04a]">
                        {user?.role === 'student' ? slot.employer?.companyName : slot.student?.name}
                      </p>
                    </div>
                    <span className="pis-status px-2 py-1">
                      {slot.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center font-mono-ui text-sm text-[#f0ede8]/60">
                      <CalendarDays className="mr-3 h-4 w-4 text-[#c8f04a]" />
                      {new Date(slot.startTime).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="flex items-center font-mono-ui text-sm text-[#f0ede8]/60">
                      <Clock className="mr-3 h-4 w-4 text-[#c8f04a]" />
                      {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {slot.meetingLink && (
                    <a href={slot.meetingLink} target="_blank" rel="noreferrer" className="pis-button flex w-full items-center justify-center py-2 transition-opacity hover:opacity-85">
                      <Video className="w-4 h-4 mr-2" />
                      Join Meeting
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-extrabold tracking-[-0.03em] opacity-80">Past Interviews</h2>
        {past.length === 0 ? (
          <p className="font-mono-ui text-sm text-[#f0ede8]/42">No past interviews.</p>
        ) : (
          <div className="space-y-3">
            {past.map((slot: any) => (
              <div key={slot.id} className="flex items-center justify-between border border-white/[0.08] bg-[#0e0e0e] p-4 opacity-75">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center bg-[#141414]">
                    <Video className="h-4 w-4 text-[#c8f04a]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#f0ede8]">{slot.roundType} Round</p>
                    <p className="font-mono-ui text-xs text-[#f0ede8]/42">
                      {new Date(slot.startTime).toLocaleDateString()} with {user?.role === 'student' ? slot.employer?.companyName : slot.student?.name}
                    </p>
                  </div>
                </div>
                <div className="pis-status px-2 py-1">
                  {slot.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
