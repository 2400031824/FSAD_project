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
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateStudent, useStudentDetails, useStudents } from "@/hooks/use-students";
import { useState } from "react";

function statusVariant(status: string) {
  if (status === "PLACED") return "bg-emerald-500/15 text-emerald-300 border-emerald-500/40";
  if (status === "IN-PROGRESS") return "bg-amber-500/10 text-amber-300 border-amber-500/40";
  return "bg-slate-500/10 text-slate-300 border-slate-500/40";
}

export default function StudentsPage() {
  const { data: students, isLoading } = useStudents();
  const { mutate: createStudent, isPending } = useCreateStudent();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number>();
  const { data: selectedStudent, isLoading: detailLoading } = useStudentDetails(selectedId);
  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    department: "",
    cgpa: "",
    graduationYear: "",
    resumeUrl: "",
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    createStudent(
      {
        ...form,
        graduationYear: form.graduationYear ? Number(form.graduationYear) : undefined,
      },
      {
        onSuccess: () => {
          setIsAddOpen(false);
          setForm({
            username: "",
            password: "",
            name: "",
            email: "",
            department: "",
            cgpa: "",
            graduationYear: "",
            resumeUrl: "",
          });
        },
      },
    );
  };

  return (
    <div className="space-y-8 text-slate-50">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-violet-300 uppercase tracking-[0.2em] mb-2">Students</p>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Student Directory</h1>
          <p className="text-sm text-slate-400">Track placement status across branches.</p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="rounded-full bg-violet-600 px-4 py-2 text-xs font-medium shadow-lg shadow-violet-500/40 hover:bg-violet-500"
        >
          + Add Student
        </Button>
      </div>

      <Card className="bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 border border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Student Directory</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <p className="text-slate-400">Loading students...</p>
          ) : (
            <Table className="text-sm">
              <TableHeader>
                <TableRow className="border-slate-800">
                  <TableHead className="text-slate-400">Name</TableHead>
                  <TableHead className="text-slate-400">Branch</TableHead>
                  <TableHead className="text-slate-400">CGPA</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400">Applications</TableHead>
                  <TableHead className="text-slate-400 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(students || []).map((s) => (
                  <TableRow key={s.userId} className="border-slate-800/80 hover:bg-slate-900/70">
                    <TableCell className="text-slate-100">{s.name}</TableCell>
                    <TableCell className="text-slate-300">{s.department || "-"}</TableCell>
                    <TableCell className="text-slate-300">{s.cgpa || "-"}</TableCell>
                    <TableCell>
                      <Badge className={`uppercase text-[10px] tracking-wide ${statusVariant(s.status)}`} variant="outline">
                        {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">{s.applicationsCount}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => setSelectedId(s.userId)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption className="text-[11px] text-slate-500">
                Showing {(students || []).length} students
              </TableCaption>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Add Student</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="student-name">Name</Label>
                <Input
                  id="student-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-email">Email</Label>
                <Input
                  id="student-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="student-username">Username</Label>
                <Input
                  id="student-username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-password">Password</Label>
                <Input
                  id="student-password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="student-department">Department</Label>
                <Input
                  id="student-department"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-cgpa">CGPA</Label>
                <Input id="student-cgpa" value={form.cgpa} onChange={(e) => setForm({ ...form, cgpa: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="student-grad-year">Graduation Year</Label>
                <Input
                  id="student-grad-year"
                  type="number"
                  value={form.graduationYear}
                  onChange={(e) => setForm({ ...form, graduationYear: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-resume">Resume URL</Label>
                <Input
                  id="student-resume"
                  value={form.resumeUrl}
                  onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-500" disabled={isPending}>
              {isPending ? "Adding..." : "Create Student"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(undefined)}>
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>Student Profile</DialogTitle>
          </DialogHeader>
          {detailLoading || !selectedStudent ? (
            <p className="text-sm text-slate-500">Loading details...</p>
          ) : (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-500">Name</p>
                  <p className="font-medium">{selectedStudent.student.name}</p>
                </div>
                <div>
                  <p className="text-slate-500">Email</p>
                  <p className="font-medium">{selectedStudent.student.email}</p>
                </div>
                <div>
                  <p className="text-slate-500">Department</p>
                  <p className="font-medium">{selectedStudent.student.department || "-"}</p>
                </div>
                <div>
                  <p className="text-slate-500">CGPA</p>
                  <p className="font-medium">{selectedStudent.student.cgpa || "-"}</p>
                </div>
              </div>
              <div>
                <p className="font-semibold mb-2">Application History</p>
                {selectedStudent.applications.length === 0 ? (
                  <p className="text-slate-500">No applications yet.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedStudent.applications.map((app) => (
                      <div key={app.id} className="rounded-md border border-slate-200 px-3 py-2">
                        <p className="font-medium">Job ID: {app.jobId}</p>
                        <p className="text-slate-500">Status: {app.status}</p>
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
