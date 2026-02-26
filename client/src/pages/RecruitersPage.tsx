import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const RECRUITERS = [
  {
    name: "Google",
    domain: "Technology",
    activeDrives: 2,
    avgPackage: "22 LPA",
  },
  {
    name: "Microsoft",
    domain: "Software",
    activeDrives: 1,
    avgPackage: "25 LPA",
  },
  {
    name: "Amazon",
    domain: "E-commerce",
    activeDrives: 3,
    avgPackage: "28 LPA",
  },
  {
    name: "Tata Motors",
    domain: "Automotive",
    activeDrives: 1,
    avgPackage: "8 LPA",
  },
];

export default function RecruitersPage() {
  return (
    <div className="space-y-8 text-slate-50">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-violet-300 uppercase tracking-[0.2em] mb-2">
            Recruiters
          </p>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            Recruiter Directory
          </h1>
          <p className="text-sm text-slate-400">
            Manage relationships with hiring partners.
          </p>
        </div>
        <button className="rounded-full bg-violet-600 px-4 py-2 text-xs font-medium shadow-lg shadow-violet-500/40 hover:bg-violet-500 transition-colors">
          + Add Recruiter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {RECRUITERS.map((r) => (
          <Card
            key={r.name}
            className="bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 border border-slate-800"
          >
            <CardHeader className="flex flex-row items-center gap-3 pb-3">
              <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-sm font-semibold">
                {r.name[0]}
              </div>
              <div>
                <CardTitle className="text-base mb-0.5">{r.name}</CardTitle>
                <p className="text-[11px] text-slate-400">{r.domain}</p>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-slate-400 text-[11px]">Active Drives</p>
                  <p className="text-slate-100 font-medium">
                    {r.activeDrives}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-[11px]">Avg Package</p>
                  <p className="text-slate-100 font-medium">{r.avgPackage}</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full border-slate-700 text-slate-100 hover:border-violet-500/70 hover:text-white"
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

