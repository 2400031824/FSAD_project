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
    return "border-[#c8f04a]/40 bg-[#c8f04a]/10 text-[#c8f04a]";
  return "border-white/[0.16] bg-white/[0.06] text-[#f0ede8]/70";
}

export default function DrivesPage() {
  return (
    <div className="space-y-8 text-[#f0ede8]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="pis-kicker mb-3">
            Drives
          </p>
          <h1 className="pis-page-title mb-3">
            Placement Drives
          </h1>
          <p className="font-mono-ui text-sm text-[#f0ede8]/45">
            Upcoming and completed placement activities.
          </p>
        </div>
        <button className="pis-button px-4 py-2 transition-opacity hover:opacity-85">
          + Schedule New Drive
        </button>
      </div>

      <div className="grid grid-cols-1 gap-px border border-white/[0.08] bg-white/[0.08] lg:grid-cols-2">
        {DRIVES.map((d) => (
          <Card
            key={d.company + d.role}
            className="rounded-none border-0 bg-[#080808] transition-colors hover:bg-[#141414]"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center bg-[#141414] text-sm font-extrabold text-[#c8f04a]">
                  {d.company[0]}
                </div>
                <div>
                  <CardTitle className="mb-0.5 text-base text-[#f0ede8]">
                    {d.company}
                  </CardTitle>
                  <p className="font-mono-ui text-[11px] text-[#f0ede8]/42">{d.role}</p>
                </div>
              </div>
              <Badge
                className={`rounded-[2px] font-mono-ui text-[10px] uppercase tracking-wide ${statusStyles(
                  d.status,
                )}`}
                variant="outline"
              >
                {d.status}
              </Badge>
            </CardHeader>
            <CardContent className="flex items-center justify-between pt-0 text-sm">
              <div>
                <p className="font-mono-ui text-[11px] uppercase tracking-[0.1em] text-[#f0ede8]/40">Package</p>
                <p className="font-medium text-[#f0ede8]">{d.package}</p>
              </div>
              <div>
                <p className="font-mono-ui text-[11px] uppercase tracking-[0.1em] text-[#f0ede8]/40">Date</p>
                <p className="font-medium text-[#f0ede8]">{d.date}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

