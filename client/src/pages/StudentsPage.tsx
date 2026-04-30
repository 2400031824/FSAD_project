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
  if (status === "PLACED") return "border-[#c8f04a]/40 bg-[#c8f04a]/10 text-[#c8f04a]";
  if (status === "IN-PROGRESS") return "border-[#f0c84a]/40 bg-[#f0c84a]/10 text-[#f0c84a]";
  return "border-white/[0.12] bg-white/[0.04] text-[#f0ede8]/65";
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
    <div className="space-y-8 text-[#f0ede8]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="pis-kicker mb-3">Students</p>
          <h1 className="pis-page-title mb-3">Student Directory</h1>
          <p className="font-mono-ui text-sm text-[#f0ede8]/45">Track placement status across branches.</p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="pis-button px-4 py-2 hover:opacity-85"
        >
          + Add Student
        </Button>
      </div>

      <Card className="rounded-[2px] border-white/[0.08] bg-[#0e0e0e]">
        <CardHeader className="border-b border-white/[0.08] pb-4">
          <CardTitle className="text-xl font-bold text-[#f0ede8]">Student Directory</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <p className="py-6 font-mono-ui text-sm text-[#f0ede8]/45">Loading students...</p>
          ) : (
            <Table className="text-sm">
              <TableHeader>
                <TableRow className="border-white/[0.08]">
                  <TableHead className="pis-table-head">Name</TableHead>
                  <TableHead className="pis-table-head">Branch</TableHead>
                  <TableHead className="pis-table-head">CGPA</TableHead>
                  <TableHead className="pis-table-head">Status</TableHead>
                  <TableHead className="pis-table-head">Applications</TableHead>
                  <TableHead className="pis-table-head text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(students || []).map((s) => (
                  <TableRow key={s.userId} className="border-white/[0.08] hover:bg-[#141414]">
                    <TableCell className="font-semibold text-[#f0ede8]">{s.name}</TableCell>
                    <TableCell className="font-mono-ui text-[#f0ede8]/60">{s.department || "-"}</TableCell>
                    <TableCell className="font-mono-ui text-[#f0ede8]/60">{s.cgpa || "-"}</TableCell>
                    <TableCell>
                      <Badge className={`rounded-[2px] font-mono-ui text-[10px] uppercase tracking-wide ${statusVariant(s.status)}`} variant="outline">
                        {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono-ui text-[#f0ede8]/60">{s.applicationsCount}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="pis-button-ghost hover:border-[#c8f04a]/60" onClick={() => setSelectedId(s.userId)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption className="font-mono-ui text-[11px] text-[#f0ede8]/35">
                Showing {(students || []).length} students
              </TableCaption>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="border-white/[0.08] bg-[#0e0e0e] text-[#f0ede8] sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold tracking-[-0.03em]">Add Student</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="student-name" className="pis-label">Name</Label>
                <Input
                  id="student-name"
                  className="pis-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-email" className="pis-label">Email</Label>
                <Input
                  id="student-email"
                  type="email"
                  className="pis-input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="student-username" className="pis-label">Username</Label>
                <Input
                  id="student-username"
                  className="pis-input"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-password" className="pis-label">Password</Label>
                <Input
                  id="student-password"
                  type="password"
                  className="pis-input"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="student-department" className="pis-label">Department</Label>
                <Input
                  id="student-department"
                  className="pis-input"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-cgpa" className="pis-label">CGPA</Label>
                <Input id="student-cgpa" className="pis-input" value={form.cgpa} onChange={(e) => setForm({ ...form, cgpa: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="student-grad-year" className="pis-label">Graduation Year</Label>
                <Input
                  id="student-grad-year"
                  type="number"
                  className="pis-input"
                  value={form.graduationYear}
                  onChange={(e) => setForm({ ...form, graduationYear: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-resume" className="pis-label">Resume URL</Label>
                <Input
                  id="student-resume"
                  className="pis-input"
                  value={form.resumeUrl}
                  onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
                />
              </div>
            </div>
            <Button type="submit" className="pis-button w-full hover:opacity-85" disabled={isPending}>
              {isPending ? "Adding..." : "Create Student"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(undefined)}>
        <DialogContent className="border-white/[0.08] bg-[#0e0e0e] text-[#f0ede8] sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold tracking-[-0.03em]">Student Profile</DialogTitle>
          </DialogHeader>
          {detailLoading || !selectedStudent ? (
            <p className="font-mono-ui text-sm text-[#f0ede8]/45">Loading details...</p>
          ) : (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="pis-label">Name</p>
                  <p className="font-medium">{selectedStudent.student.name}</p>
                </div>
                <div>
                  <p className="pis-label">Email</p>
                  <p className="font-medium">{selectedStudent.student.email}</p>
                </div>
                <div>
                  <p className="pis-label">Department</p>
                  <p className="font-medium">{selectedStudent.student.department || "-"}</p>
                </div>
                <div>
                  <p className="pis-label">CGPA</p>
                  <p className="font-medium">{selectedStudent.student.cgpa || "-"}</p>
                </div>
              </div>
              <div>
                <p className="font-semibold mb-2">Application History</p>
                {selectedStudent.applications.length === 0 ? (
                  <p className="font-mono-ui text-sm text-[#f0ede8]/42">No applications yet.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedStudent.applications.map((app) => (
                      <div key={app.id} className="border border-white/[0.08] bg-[#080808] px-3 py-2">
                        <p className="font-medium">Job ID: {app.jobId}</p>
                        <p className="font-mono-ui text-xs text-[#f0ede8]/42">Status: {app.status}</p>
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
