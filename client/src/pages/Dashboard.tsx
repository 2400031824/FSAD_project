import { useUser } from "@/hooks/use-auth";
import { useStats } from "@/hooks/use-stats";
import { useApplications } from "@/hooks/use-applications";
import { useJobs } from "@/hooks/use-jobs";
import { api, type ApplicationStatus } from "@shared/routes";
import {
  Users,
  Briefcase,
  CheckCircle,
  Zap,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useState } from "react";
import { useUpdateApplicationStatus } from "@/hooks/use-applications";

/* -------------------- STAT CARD -------------------- */

function StatCard({
  label,
  value,
  icon,
  variant = "neutral",
  subtext,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "neutral";
  subtext?: string;
}) {
  const variantStyles = {
    primary: "bg-blue-50 border-blue-200",
    success: "bg-green-50 border-green-200",
    warning: "bg-amber-50 border-amber-200",
    neutral: "bg-slate-50 border-slate-200",
  };

  return (
    <div className={`border rounded-lg p-6 ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">{label}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          {subtext && (
            <p className="text-xs text-slate-600 mt-2">{subtext}</p>
          )}
        </div>
        <div className="opacity-60">{icon}</div>
      </div>
    </div>
  );
}

/* -------------------- STUDENT DASHBOARD -------------------- */

function StudentDashboard() {
  const { data: applications } = useApplications();
  const { data: jobs } = useJobs();

  const activeApplications =
    applications?.filter((a) => a.status === "applied").length || 0;
  const shortlisted =
    applications?.filter((a) => a.status === "shortlisted").length || 0;
  const offers =
    applications?.filter((a) => a.status === "selected").length || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-page-title text-slate-900 mb-1">
          Your Pipeline
        </h1>
        <p className="text-base text-slate-600">
          Track applications. Land offers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Applications Active"
          value={activeApplications}
          icon={<Briefcase className="w-6 h-6" />}
          variant="primary"
        />
        <StatCard
          label="Shortlisted"
          value={shortlisted}
          icon={<Zap className="w-6 h-6" />}
          variant="warning"
        />
        <StatCard
          label="Offers Received"
          value={offers}
          icon={<CheckCircle className="w-6 h-6" />}
          variant="success"
        />
      </div>

      <Card className="card-base">
        <CardHeader>
          <CardTitle>Your Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {!applications || applications.length === 0 ? (
            <p>No applications yet.</p>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-semibold">
                        {app.job.title}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {app.job.location}
                      </p>
                    </div>
                    <Badge>{app.status}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Applied on{" "}
                    {app.appliedAt &&
                      format(new Date(app.appliedAt), "MMM d, yyyy")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* -------------------- EMPLOYER DASHBOARD -------------------- */

function EmployerDashboard() {
  const { data: user } = useUser();
  const { data: applications } = useApplications();
  const { data: jobs } = useJobs();
  const updateMutation = useUpdateApplicationStatus();

  const activeJobs =
    jobs?.filter((j) => j.employerId === user?.id).length || 0;

  const handleUpdate = (
    id: number,
    status: ApplicationStatus,
    currentRound: string,
    remarks: string
  ) => {
    updateMutation.mutate({
      id,
      status,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-page-title text-slate-900 mb-1">
          Your Candidates
        </h1>
        <p className="text-base text-slate-600">
          Manage openings. Review applications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Active Job Postings"
          value={activeJobs}
          icon={<Briefcase className="w-6 h-6" />}
          variant="primary"
        />
        <StatCard
          label="Total Applications"
          value={applications?.length || 0}
          icon={<Users className="w-6 h-6" />}
        />
      </div>

      <Card className="card-base">
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>

        <CardContent>
          {!applications || applications.length === 0 ? (
            <p>No applications yet.</p>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  app={app}
                  onUpdate={handleUpdate}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


function ApplicationCard({
  app,
  onUpdate,
}: {
  app: any;
  onUpdate: (
    id: number,
    status: ApplicationStatus,
    currentRound: string,
    remarks: string
  ) => void;
}) {
  const [status, setStatus] = useState(app.status);
  const [round, setRound] = useState(app.currentRound || "");
  const [remarks, setRemarks] = useState(app.remarks || "");

  return (
    <div className="p-4 border rounded-lg space-y-3">
      <h4 className="font-semibold">{app.student.name}</h4>
      <p className="text-sm text-slate-600">
        Applied for: {app.job.title}
      </p>

      <div className="grid md:grid-cols-3 gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
          aria-label="Application status"
        >
          <option value="applied">Applied</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
          <option value="selected">Selected</option>
        </select>

        <input
          type="text"
          placeholder="Current Round"
          value={round}
          onChange={(e) => setRound(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        />

        <input
          type="text"
          placeholder="Remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        />
      </div>

      <button
        onClick={() => onUpdate(app.id, status, round, remarks)}
        className="bg-blue-600 text-white px-4 py-1 rounded text-sm"
      >
        Update Application
      </button>

      <p className="text-xs text-slate-500">
        Last Updated:{" "}
        {app.updatedAt &&
          format(new Date(app.updatedAt), "MMM d, yyyy HH:mm")}
      </p>
    </div>
  );
}

/* -------------------- ADMIN DASHBOARD -------------------- */

function AdminDashboard() {
  const { data: stats } = useStats();

  return (
    <div className="space-y-8">
      <h1 className="text-page-title">Platform Status</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          label="Total Students"
          value={stats?.totalStudents || 0}
          icon={<Users className="w-6 h-6" />}
        />
        <StatCard
          label="Employers"
          value={stats?.totalEmployers || 0}
          icon={<Briefcase className="w-6 h-6" />}
        />
        <StatCard
          label="Open Jobs"
          value={stats?.totalJobs || 0}
          icon={<TrendingUp className="w-6 h-6" />}
        />
        <StatCard
          label="Placements"
          value={stats?.placements || 0}
          icon={<CheckCircle className="w-6 h-6" />}
        />
      </div>
    </div>
  );
}

/* -------------------- MAIN ROUTER -------------------- */

export default function Dashboard() {
  const { data: user } = useUser();

  if (!user) return null;

  if (user.role === "student") return <StudentDashboard />;
  if (user.role === "employer") return <EmployerDashboard />;
  if (user.role === "admin" || user.role === "officer")
    return <AdminDashboard />;

  return null;
}