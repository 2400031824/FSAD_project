import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DRIVES = [
  {
    company: "Microsoft",
    role: "SDE Role",
    status: "UPCOMING",
    package: "42 LPA",
    date: "10/24/2024",
  },
  {
    company: "Amazon",
    role: "Cloud Engineer",
    status: "UPCOMING",
    package: "30 LPA",
    date: "10/24/2024",
  },
  {
    company: "Accenture",
    role: "System Analyst",
    status: "UPCOMING",
    package: "6.5 LPA",
    date: "11/2/2024",
  },
  {
    company: "Google",
    role: "Data Scientist",
    status: "COMPLETED",
    package: "24 LPA",
    date: "9/15/2024",
  },
];

function statusStyles(status: string) {
  if (status === "COMPLETED")
    return "bg-emerald-500/15 text-emerald-300 border-emerald-500/40";
  return "bg-slate-700/40 text-slate-100 border-slate-500/60";
}

export default function DrivesPage() {
  return (
    <div className="space-y-8 text-slate-50">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-violet-300 uppercase tracking-[0.2em] mb-2">
            Drives
          </p>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            Placement Drives
          </h1>
          <p className="text-sm text-slate-400">
            Upcoming and completed placement activities.
          </p>
        </div>
        <button className="rounded-full bg-violet-600 px-4 py-2 text-xs font-medium shadow-lg shadow-violet-500/40 hover:bg-violet-500 transition-colors">
          + Schedule New Drive
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {DRIVES.map((d) => (
          <Card
            key={d.company + d.role}
            className="bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 border border-slate-800"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-sm font-semibold">
                  {d.company[0]}
                </div>
                <div>
                  <CardTitle className="text-base mb-0.5">
                    {d.company}
                  </CardTitle>
                  <p className="text-[11px] text-slate-400">{d.role}</p>
                </div>
              </div>
              <Badge
                className={`uppercase text-[10px] tracking-wide ${statusStyles(
                  d.status,
                )}`}
                variant="outline"
              >
                {d.status}
              </Badge>
            </CardHeader>
            <CardContent className="pt-0 flex items-center justify-between text-sm">
              <div>
                <p className="text-slate-400 text-[11px]">Package</p>
                <p className="text-slate-100 font-medium">{d.package}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[11px]">Date</p>
                <p className="text-slate-100 font-medium">{d.date}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

