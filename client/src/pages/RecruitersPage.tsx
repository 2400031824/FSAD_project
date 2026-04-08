import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateRecruiter, useRecruiterDetails, useRecruiters } from "@/hooks/use-recruiters";

export default function RecruitersPage() {
  const { data: recruiters, isLoading } = useRecruiters();
  const { mutate: createRecruiter, isPending } = useCreateRecruiter();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number>();
  const { data: selectedRecruiter, isLoading: isDetailLoading } = useRecruiterDetails(selectedId);

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
    <div className="space-y-8 text-slate-50">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-violet-300 uppercase tracking-[0.2em] mb-2">Recruiters</p>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Recruiter Directory</h1>
          <p className="text-sm text-slate-400">Manage relationships with hiring partners.</p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="rounded-full bg-violet-600 px-4 py-2 text-xs font-medium shadow-lg shadow-violet-500/40 hover:bg-violet-500"
        >
          + Add Recruiter
        </Button>
      </div>

      {isLoading ? (
        <p className="text-slate-400">Loading recruiters...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedRecruiters.map((r) => (
            <Card
              key={r.userId}
              className="bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 border border-slate-800"
            >
              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-sm font-semibold">
                  {r.companyName[0]}
                </div>
                <div>
                  <CardTitle className="text-base mb-0.5">{r.companyName}</CardTitle>
                  <p className="text-[11px] text-slate-400">{r.industry || "General"}</p>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-slate-400 text-[11px]">Active Drives</p>
                    <p className="text-slate-100 font-medium">{r.activeDrives}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[11px]">Applications</p>
                    <p className="text-slate-100 font-medium">{r.totalApplications}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedId(r.userId)}
                  className="w-full border-slate-700 text-slate-100 hover:border-violet-500/70 hover:text-white"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Add Recruiter</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddRecruiter} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company</Label>
                <Input
                  id="companyName"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-500" disabled={isPending}>
              {isPending ? "Adding..." : "Create Recruiter"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(undefined)}>
        <DialogContent className="sm:max-w-[620px]">
          <DialogHeader>
            <DialogTitle>Recruiter Details</DialogTitle>
          </DialogHeader>
          {isDetailLoading || !selectedRecruiter ? (
            <p className="text-sm text-slate-500">Loading details...</p>
          ) : (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-500">Company</p>
                  <p className="font-medium">{selectedRecruiter.recruiter.companyName}</p>
                </div>
                <div>
                  <p className="text-slate-500">Contact</p>
                  <p className="font-medium">{selectedRecruiter.recruiter.name}</p>
                </div>
                <div>
                  <p className="text-slate-500">Email</p>
                  <p className="font-medium">{selectedRecruiter.recruiter.email}</p>
                </div>
                <div>
                  <p className="text-slate-500">Website</p>
                  <p className="font-medium">{selectedRecruiter.recruiter.website || "-"}</p>
                </div>
              </div>

              <div>
                <p className="font-semibold mb-2">Posted Jobs</p>
                {selectedRecruiter.jobs.length === 0 ? (
                  <p className="text-slate-500">No jobs posted yet.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedRecruiter.jobs.map((job) => (
                      <div key={job.id} className="rounded-md border border-slate-200 px-3 py-2">
                        <p className="font-medium">{job.title}</p>
                        <p className="text-slate-500">{job.location}</p>
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
