import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STUDENTS = [
  {
    name: "Rahul Verma",
    branch: "CSE",
    cgpa: "9.2",
    status: "PLACED",
    placement: "Google • 24 LPA",
  },
  {
    name: "Priya Singh",
    branch: "ECE",
    cgpa: "8.8",
    status: "PLACED",
    placement: "Microsoft • 42 LPA",
  },
  {
    name: "Amit Kumar",
    branch: "ME",
    cgpa: "8.5",
    status: "IN-PROGRESS",
    placement: "Tata Motors",
  },
  {
    name: "Sneha Reddy",
    branch: "IT",
    cgpa: "9.0",
    status: "PLACED",
    placement: "Amazon • 30 LPA",
  },
  {
    name: "Vikram Das",
    branch: "CE",
    cgpa: "7.9",
    status: "UNPLACED",
    placement: "-",
  },
  {
    name: "Ananya Iyer",
    branch: "EEE",
    cgpa: "8.2",
    status: "IN-PROGRESS",
    placement: "Accenture",
  },
];

function statusVariant(status: string) {
  if (status === "PLACED") return "bg-emerald-500/15 text-emerald-300 border-emerald-500/40";
  if (status === "IN-PROGRESS")
    return "bg-amber-500/10 text-amber-300 border-amber-500/40";
  return "bg-slate-500/10 text-slate-300 border-slate-500/40";
}

export default function StudentsPage() {
  return (
    <div className="space-y-8 text-slate-50">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-violet-300 uppercase tracking-[0.2em] mb-2">
            Students
          </p>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            Student Directory
          </h1>
          <p className="text-sm text-slate-400">
            Track placement status across branches.
          </p>
        </div>
        <button className="rounded-full bg-violet-600 px-4 py-2 text-xs font-medium shadow-lg shadow-violet-500/40 hover:bg-violet-500 transition-colors">
          + Add Student
        </button>
      </div>

      <Card className="bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 border border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Student Directory</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Table className="text-sm">
            <TableHeader>
              <TableRow className="border-slate-800">
                <TableHead className="text-slate-400">Name</TableHead>
                <TableHead className="text-slate-400">Branch</TableHead>
                <TableHead className="text-slate-400">CGPA</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-slate-400">Placement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {STUDENTS.map((s) => (
                <TableRow
                  key={s.name}
                  className="border-slate-800/80 hover:bg-slate-900/70"
                >
                  <TableCell className="text-slate-100">{s.name}</TableCell>
                  <TableCell className="text-slate-300">{s.branch}</TableCell>
                  <TableCell className="text-slate-300">{s.cgpa}</TableCell>
                  <TableCell>
                    <Badge
                      className={`uppercase text-[10px] tracking-wide ${statusVariant(
                        s.status,
                      )}`}
                      variant="outline"
                    >
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-300">{s.placement}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption className="text-[11px] text-slate-500">
              Showing {STUDENTS.length} students • Batch 2024
            </TableCaption>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

