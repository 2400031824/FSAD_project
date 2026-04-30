import { useState } from "react";
import { useJobs, useCreateJob } from "@/hooks/use-jobs";
import { useApplications, useApplyForJob } from "@/hooks/use-applications";
import { useJobRecommendations } from "@/hooks/use-recommendations";
import { useUser } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Clock, Loader2, MapPin, Plus, Search, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScheduleInterviewDialog } from "@/components/ScheduleInterviewDialog";

const emptyJob = { title: "", description: "", requirements: "", location: "", salary: "" };

export default function JobsPage() {
  const { data: user } = useUser();
  const { data: jobs, isLoading } = useJobs();
  const { data: myApplications } = useApplications();
  const { data: recommendations } = useJobRecommendations();
  const { mutate: apply, isPending: isApplying } = useApplyForJob();
  const { mutate: createJob, isPending: isCreating } = useCreateJob();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newJob, setNewJob] = useState(emptyJob);

  const filteredJobs = jobs?.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.location.toLowerCase().includes(search.toLowerCase()),
  );

  const getApplication = (jobId: number) => myApplications?.find((app) => app.jobId === jobId);
  const hasApplied = (jobId: number) => !!getApplication(jobId);

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    createJob(newJob, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setNewJob(emptyJob);
      },
    });
  };

  const handleApply = (jobId: number) => {
    if (hasApplied(jobId)) {
      toast({
        title: "Application Sent",
        description: "You've already submitted an application for this role",
      });
      return;
    }
    apply(jobId);
  };

  if (!user) return null;

  return (
    <div className="space-y-8 text-[#f0ede8]">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="pis-kicker mb-3">Roles</p>
          <h1 className="pis-page-title mb-3">Available Roles</h1>
          <p className="font-mono-ui text-sm text-[#f0ede8]/45">
            {user.role === "student" ? `Explore and apply to ${jobs?.length || 0} roles` : "Recruit top talent"}
          </p>
        </div>

        {user.role === "employer" && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="pis-button px-4 py-2 hover:opacity-85">
                <Plus className="mr-2 h-4 w-4" />
                Create Opening
              </Button>
            </DialogTrigger>
            <DialogContent className="border-white/[0.08] bg-[#0e0e0e] text-[#f0ede8] sm:max-w-[520px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-extrabold tracking-[-0.03em]">Create Job Opening</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateJob} className="mt-4 space-y-4">
                <Field label="Job Title" id="title" value={newJob.title} onChange={(value) => setNewJob({ ...newJob, title: value })} placeholder="e.g., Software Engineer" />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Location" id="location" value={newJob.location} onChange={(value) => setNewJob({ ...newJob, location: value })} placeholder="Bengaluru" />
                  <Field label="Salary" id="salary" value={newJob.salary} onChange={(value) => setNewJob({ ...newJob, salary: value })} placeholder="8 LPA" />
                </div>
                <Area label="Description" id="description" value={newJob.description} onChange={(value) => setNewJob({ ...newJob, description: value })} />
                <Area label="Requirements" id="requirements" value={newJob.requirements} onChange={(value) => setNewJob({ ...newJob, requirements: value })} />
                <Button type="submit" className="pis-button w-full hover:opacity-85" disabled={isCreating}>
                  {isCreating ? "Posting..." : "Post Job"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {user.role === "student" && recommendations && recommendations.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-[#f0ede8]">Top Matches For You</h2>
            <Badge className="pis-status">AI Powered</Badge>
          </div>
          <div className="grid grid-cols-1 gap-px border border-white/[0.08] bg-white/[0.08] md:grid-cols-2 xl:grid-cols-3">
            {recommendations.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                matchScore={job.matchScore}
                app={getApplication(job.id)}
                isApplying={isApplying}
                onApply={handleApply}
                role={user.role}
              />
            ))}
          </div>
        </section>
      )}

      {user.role === "student" && (
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[#c8f04a]" />
          <Input
            placeholder="Search roles by title or location"
            className="pis-input pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-px border border-white/[0.08] bg-white/[0.08] md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 animate-pulse bg-[#0e0e0e]" />
          ))}
        </div>
      ) : !filteredJobs || filteredJobs.length === 0 ? (
        <div className="border border-dashed border-white/[0.12] bg-[#0e0e0e] py-16 text-center">
          <p className="mb-2 font-bold text-[#f0ede8]">No matching roles found</p>
          <p className="font-mono-ui text-sm text-[#f0ede8]/42">
            {search ? "Refine your search or explore broader criteria" : "Check back soon for new openings"}
          </p>
        </div>
      ) : (
        <div className="grid gap-px border border-white/[0.08] bg-white/[0.08]">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              app={getApplication(job.id)}
              isApplying={isApplying}
              onApply={handleApply}
              role={user.role}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function JobCard({ job, app, matchScore, isApplying, onApply, role }: any) {
  return (
    <Card className="relative overflow-hidden rounded-none border-0 bg-[#080808] transition-colors hover:bg-[#141414]">
      {matchScore ? (
        <div className="absolute right-0 top-0 bg-[#c8f04a] px-3 py-1 font-mono-ui text-xs font-bold text-[#080808]">
          {matchScore}% Match
        </div>
      ) : null}
      <CardContent className="p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="pr-16 text-2xl font-extrabold tracking-[-0.03em] text-[#f0ede8]">{job.title}</h3>
            <p className="mt-1 font-mono-ui text-xs text-[#f0ede8]/45">
              {job.employer?.companyName || job.employer?.name || "Company Information"}
            </p>
          </div>
          {app && <Badge className="pis-status flex-shrink-0">Applied</Badge>}
        </div>

        <div className="mb-6 flex flex-wrap gap-4 font-mono-ui text-xs text-[#f0ede8]/50">
          <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-[#c8f04a]" />{job.location}</span>
          <span>{job.salary}</span>
          <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-[#c8f04a]" />Active</span>
        </div>

        <div className="mb-6 border-t border-white/[0.08] pt-6">
          <p className="line-clamp-2 font-mono-ui text-sm leading-7 text-[#f0ede8]/55">{job.description}</p>
          <p className="mt-3 font-mono-ui text-xs uppercase tracking-[0.12em] text-[#f0ede8]/35">Requirements</p>
          <p className="line-clamp-2 font-mono-ui text-sm leading-7 text-[#f0ede8]/55">{job.requirements}</p>
        </div>

        {role === "student" ? (
          app ? (
            <div className="flex w-full gap-2">
              <Button disabled className="w-1/2 bg-[#141414] font-mono-ui text-[#f0ede8]/45 opacity-70">Applied</Button>
              <ScheduleInterviewDialog jobId={job.id} applicationId={app.id}>
                <Button className="pis-button w-1/2">
                  <Video className="mr-2 h-4 w-4" />
                  Schedule
                </Button>
              </ScheduleInterviewDialog>
            </div>
          ) : (
            <Button onClick={() => onApply(job.id)} disabled={isApplying} className="pis-button w-full hover:opacity-85">
              {isApplying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Apply
            </Button>
          )
        ) : (
          <Button variant="outline" className="pis-button-ghost w-full hover:border-[#c8f04a]/60">
            Review Candidates
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function Field({ label, id, value, onChange, placeholder }: { label: string; id: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="pis-label">{label}</Label>
      <Input id={id} required value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="pis-input" />
    </div>
  );
}

function Area({ label, id, value, onChange }: { label: string; id: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="pis-label">{label}</Label>
      <Textarea id={id} required value={value} onChange={(e) => onChange(e.target.value)} className="pis-input min-h-24" />
    </div>
  );
}
