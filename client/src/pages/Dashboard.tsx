import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Briefcase,
  BarChart3,
  Bell,
  CalendarDays,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const BRANCH_PERFORMANCE = [
  { branch: "CSE", value: 92 },
  { branch: "ME", value: 78 },
  { branch: "CE", value: 74 },
  { branch: "IT", value: 88 },
  { branch: "EEE", value: 69 },
];

const UPCOMING_DRIVES = [
  {
    company: "Microsoft",
    role: "SDE Role • 42 LPA",
    status: "UPCOMING",
    date: "OCT 24",
    applied: 240,
    closes: "closes soon",
  },
  {
    company: "Amazon",
    role: "Cloud Engineer • 30 LPA",
    status: "UPCOMING",
    date: "OCT 24",
    applied: 120,
    closes: "closes soon",
  },
  {
    company: "Accenture",
    role: "System Analyst • 6.5 LPA",
    status: "UPCOMING",
    date: "NOV 2",
    applied: 45,
    closes: "closes soon",
  },
];

const RECENT_ACTIVITIES = [
  {
    title: "Rahul Verma (CSE) got placed at Google",
    meta: "Package: 24 LPA • 2 hours ago",
    color: "bg-emerald-500",
  },
  {
    title: "New drive scheduled: Infosys",
    meta: "Date: 15 Oct, 2024 • Eligible: CSE, IT, ECE • 4 hours ago",
    color: "bg-sky-500",
  },
  {
    title: "15 new resumes pending approval",
    meta: "Action required • 5 hours ago",
    color: "bg-amber-500",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 text-slate-50">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-violet-300 uppercase tracking-[0.2em] mb-2">
            Dashboard
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Welcome back, here's the latest in campus placements.
          </h1>
        </div>
        <button className="hidden md:inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs font-medium text-slate-200 hover:border-violet-500/70 hover:text-white transition-colors">
          <Bell className="w-4 h-4" />
          Alerts
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Placed */}
        <Card className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl shadow-violet-500/10">
          <CardHeader className="flex flex-row items-start justify-between pb-4">
            <div>
              <p className="text-xs font-medium text-slate-400 mb-2">
                Total Placed
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">1,245</span>
              </div>
            </div>
            <div className="h-9 w-9 rounded-xl bg-violet-600/80 flex items-center justify-center shadow-lg shadow-violet-600/40">
              <Users className="w-4 h-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ArrowUpRight className="w-3 h-3" />
              <span>+12% vs last year</span>
            </div>
            <Progress value={78} className="h-1.5 bg-slate-800" />
            <p className="text-[11px] text-slate-400">Target Progress • 78%</p>
          </CardContent>
        </Card>

        {/* Average CTC */}
        <Card className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800">
          <CardHeader className="flex flex-row items-start justify-between pb-4">
            <div>
              <p className="text-xs font-medium text-slate-400 mb-2">
                Average CTC
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">₹8.5 LPA</span>
              </div>
            </div>
            <div className="h-9 w-9 rounded-xl bg-sky-500/80 flex items-center justify-center shadow-lg shadow-sky-500/40">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ArrowUpRight className="w-3 h-3" />
              <span>+2.5% growth</span>
            </div>
            <Progress value={65} className="h-1.5 bg-slate-800" />
            <p className="text-[11px] text-slate-400">Target Progress • 65%</p>
          </CardContent>
        </Card>

        {/* Active Recruiters */}
        <Card className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800">
          <CardHeader className="flex flex-row items-start justify-between pb-4">
            <div>
              <p className="text-xs font-medium text-slate-400 mb-2">
                Active Recruiters
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">42</span>
              </div>
            </div>
            <div className="h-9 w-9 rounded-xl bg-amber-500/80 flex items-center justify-center shadow-lg shadow-amber-500/40">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="flex items-center gap-2 text-xs text-rose-400">
              <ArrowDownRight className="w-3 h-3" />
              <span>-2% this week</span>
            </div>
            <Progress value={40} className="h-1.5 bg-slate-800" />
            <p className="text-[11px] text-slate-400">Target Progress • 40%</p>
          </CardContent>
        </Card>
      </div>

      {/* Middle Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1.1fr)] gap-6">
        {/* Branch-wise Performance */}
        <Card className="bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 border border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">
                Branch-wise Performance
              </CardTitle>
              <p className="text-[11px] text-slate-400 mt-1">
                Placement percentage across branches
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="hidden sm:inline">Batch</span>
              <button className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 border border-slate-700 px-3 py-1 text-[11px] font-medium">
                Batch 2024
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-end gap-6 h-52">
              {BRANCH_PERFORMANCE.map((b) => (
                <div key={b.branch} className="flex-1 flex flex-col items-center">
                  <div className="relative w-full bg-slate-900 rounded-lg overflow-hidden h-40 flex items-end">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-violet-500 via-violet-400 to-sky-400 shadow-[0_0_25px_rgba(129,140,248,0.7)]"
                      style={{ height: `${b.value}%` }}
                    />
                  </div>
                  <p className="mt-3 text-xs font-medium text-slate-300">
                    {b.branch}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Drives */}
        <Card className="bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 border border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">
                Upcoming Drives
              </CardTitle>
              <p className="text-[11px] text-slate-400 mt-1">
                Drives scheduled for this month
              </p>
            </div>
            <button className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-3 py-1 text-[11px] text-slate-200 hover:border-violet-500/80 hover:text-white transition-colors">
              <CalendarDays className="w-3 h-3" />
              Schedule New
            </button>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            {UPCOMING_DRIVES.map((drive) => (
              <div
                key={drive.company}
                className="flex items-center gap-3 rounded-xl bg-slate-900/80 border border-slate-800 px-3 py-3"
              >
                <div className="h-9 w-9 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-semibold">
                  {drive.company[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-slate-100">
                      {drive.company}
                    </p>
                    <span className="text-[10px] font-semibold text-violet-300">
                      {drive.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">{drive.role}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{drive.applied} Applied</span>
                    <span className="text-violet-300">{drive.closes}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-medium">
                      {drive.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 border border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-semibold">
              Recent Activities
            </CardTitle>
            <p className="text-[11px] text-slate-400 mt-1">
              Live feed from placement desk
            </p>
          </div>
          <button className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-3 py-1 text-[11px] text-slate-200 hover:border-violet-500/80 hover:text-white transition-colors">
            <Download className="w-3 h-3" />
            Export Log
          </button>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-2">
            {RECENT_ACTIVITIES.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-lg px-3 py-3 hover:bg-slate-900/80 transition-colors"
              >
                <div
                  className={`mt-1 h-6 w-6 rounded-full flex items-center justify-center ${item.color}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-100">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {item.meta}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}