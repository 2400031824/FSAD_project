import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateRecruiter, useRecruiterDetails, useRecruiters, useApproveRecruiter } from "@/hooks/use-recruiters";

export default function RecruitersPage() {
  const { data: recruiters, isLoading } = useRecruiters();
  const { mutate: createRecruiter, isPending } = useCreateRecruiter();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number>();
  const { data: selectedRecruiter, isLoading: isDetailLoading } = useRecruiterDetails(selectedId);
  const { mutate: approveRecruiter, isPending: isApprovePending } = useApproveRecruiter();

  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    companyName: "",
    industry: "",
    website: "",
  });

  const sortedRecruiters = useMemo(
    () => (recruiters || []).slice().sort((a, b) => b.activeDrives - a.activeDrives),
    [recruiters],
  );

  const handleAddRecruiter = (e: React.FormEvent) => {
    e.preventDefault();
    createRecruiter(form, {
      onSuccess: () => {
        setIsAddOpen(false);
        setForm({
          username: "",
          password: "",
          name: "",
          email: "",
          companyName: "",
          industry: "",
          website: "",
        });
      },
    });
  };

  return (
    <div className="space-y-8 text-[#f0ede8]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="pis-kicker mb-3">Recruiters</p>
          <h1 className="pis-page-title mb-3">Recruiter Directory</h1>
          <p className="font-mono-ui text-sm text-[#f0ede8]/45">Manage relationships with hiring partners.</p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="pis-button px-4 py-2 hover:opacity-85"
        >
          + Add Recruiter
        </Button>
      </div>

      {isLoading ? (
        <p className="font-mono-ui text-sm text-[#f0ede8]/45">Loading recruiters...</p>
      ) : (
        <div className="grid grid-cols-1 gap-px border border-white/[0.08] bg-white/[0.08] md:grid-cols-2 xl:grid-cols-3">
          {sortedRecruiters.map((r) => (
            <Card
              key={r.userId}
              className="rounded-none border-0 bg-[#080808] transition-colors hover:bg-[#141414]"
            >
              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                <div className="flex h-10 w-10 items-center justify-center bg-[#141414] text-sm font-extrabold text-[#c8f04a]">
                  {r.companyName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <CardTitle className="m-0 text-base text-[#f0ede8]">{r.companyName}</CardTitle>
                    {r.isApproved ? (
                      <span className="pis-status px-2 py-0.5">Approved</span>
                    ) : (
                      <span className="pis-status border-[#f0c84a]/40 bg-[#f0c84a]/10 px-2 py-0.5 text-[#f0c84a]">Pending</span>
                    )}
                  </div>
                  <p className="font-mono-ui text-[11px] text-[#f0ede8]/42">{r.industry || "General"}</p>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-mono-ui text-[11px] uppercase tracking-[0.1em] text-[#f0ede8]/40">Active Drives</p>
                    <p className="font-semibold text-[#f0ede8]">{r.activeDrives}</p>
                  </div>
                  <div>
                    <p className="font-mono-ui text-[11px] uppercase tracking-[0.1em] text-[#f0ede8]/40">Applications</p>
                    <p className="font-semibold text-[#f0ede8]">{r.totalApplications}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedId(r.userId)}
                  className="pis-button-ghost w-full hover:border-[#c8f04a]/60 hover:text-[#f0ede8]"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="border-white/[0.08] bg-[#0e0e0e] text-[#f0ede8] sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold tracking-[-0.03em]">Add Recruiter</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddRecruiter} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="name" className="pis-label">Name</Label>
                <Input id="name" className="pis-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName" className="pis-label">Company</Label>
                <Input
                  id="companyName"
                  className="pis-input"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="username" className="pis-label">Username</Label>
                <Input
                  id="username"
                  className="pis-input"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="pis-label">Password</Label>
                <Input
                  id="password"
                  type="password"
                  className="pis-input"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="pis-label">Email</Label>
              <Input
                id="email"
                type="email"
                className="pis-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="industry" className="pis-label">Industry</Label>
                <Input
                  id="industry"
                  className="pis-input"
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website" className="pis-label">Website</Label>
                <Input
                  id="website"
                  className="pis-input"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
              </div>
            </div>
            <Button type="submit" className="pis-button w-full hover:opacity-85" disabled={isPending}>
              {isPending ? "Adding..." : "Create Recruiter"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(undefined)}>
        <DialogContent className="border-white/[0.08] bg-[#0e0e0e] text-[#f0ede8] sm:max-w-[620px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold tracking-[-0.03em]">Recruiter Details</DialogTitle>
          </DialogHeader>
          {isDetailLoading || !selectedRecruiter ? (
            <p className="font-mono-ui text-sm text-[#f0ede8]/45">Loading details...</p>
          ) : (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="pis-label">Company</p>
                  <p className="font-medium">{selectedRecruiter.recruiter.companyName}</p>
                </div>
                <div>
                  <p className="pis-label">Contact</p>
                  <p className="font-medium">{selectedRecruiter.recruiter.name}</p>
                </div>
                <div>
                  <p className="pis-label">Email</p>
                  <p className="font-medium">{selectedRecruiter.recruiter.email}</p>
                </div>
                <div>
                  <p className="pis-label">Website</p>
                  <p className="font-medium">{selectedRecruiter.recruiter.website || "-"}</p>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between border border-white/[0.08] bg-[#080808] p-3">
                <div>
                  <p className="font-medium text-[#f0ede8]">Account Status</p>
                  <p className="font-mono-ui text-xs text-[#f0ede8]/42">
                    {selectedRecruiter.recruiter.isApproved 
                      ? "This employer is verified and can post jobs."
                      : "This employer is awaiting verification."}
                  </p>
                </div>
                {!selectedRecruiter.recruiter.isApproved && (
                  <Button 
                    onClick={() => approveRecruiter(selectedRecruiter.recruiter.userId)}
                    disabled={isApprovePending}
                    className="pis-button"
                  >
                    {isApprovePending ? "Approving..." : "Approve Employer"}
                  </Button>
                )}
              </div>

              <div>
                <p className="mb-2 mt-4 font-semibold">Posted Jobs</p>
                {selectedRecruiter.jobs.length === 0 ? (
                  <p className="font-mono-ui text-sm text-[#f0ede8]/42">No jobs posted yet.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedRecruiter.jobs.map((job) => (
                      <div key={job.id} className="border border-white/[0.08] bg-[#080808] px-3 py-2">
                        <p className="font-medium">{job.title}</p>
                        <p className="font-mono-ui text-xs text-[#f0ede8]/42">{job.location}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
