import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  Send,
  Sparkles,
  Users,
  Video,
} from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/hooks/use-auth";
import { useApplications } from "@/hooks/use-applications";
import { useJobRecommendations } from "@/hooks/use-recommendations";
import { useJobs } from "@/hooks/use-jobs";
import { useMySchedule } from "@/hooks/use-interviews";
import { useStats } from "@/hooks/use-stats";
import { useStudents } from "@/hooks/use-students";
import { useRecruiters } from "@/hooks/use-recruiters";
import { ResumeUpload } from "@/components/ResumeUpload";
import { useNotifications } from "@/hooks/use-notifications";

const placedStatuses = new Set(["Joined", "Offer_Accepted", "Offer_Released", "selected"]);
const activeStatuses = new Set(["Applied", "Screening", "Aptitude", "Technical", "HR", "interview"]);

export default function Dashboard() {
  const { data: user } = useUser();

  if (!user) return null;
  if (user.role === "student") return <StudentDashboard user={user as any} />;
  if (user.role === "employer") return <EmployerDashboard user={user as any} />;
  return <AdminDashboard user={user as any} />;
}

function StudentDashboard({ user }: { user: any }) {
  const { data: applications = [] } = useApplications();
  const { data: recommendations = [] } = useJobRecommendations();
  const { data: schedule = [] } = useMySchedule();
  const studentDetails = user.studentDetails;
  const profileFields = [studentDetails?.skills, studentDetails?.education, studentDetails?.projects, studentDetails?.resumeUrl].filter(Boolean).length;
  const profileScore = Math.round((profileFields / 4) * 100);
  const activeApps = applications.filter((app: any) => activeStatuses.has(app.status));
  const placed = applications.filter((app: any) => placedStatuses.has(app.status));
  const upcoming = schedule.filter((slot: any) => new Date(slot.startTime) > new Date());

  return (
    <DashboardShell
      kicker="Student cockpit"
      title={`Hi ${firstName(user.name)}. Your placement runway is live.`}
      subtitle="Track your profile readiness, applications, interviews, and best-fit roles from one student-first workspace."
      action={{ href: "/jobs", label: "Explore roles" }}
    >
      <MetricGrid
        items={[
          { label: "Profile readiness", value: `${profileScore}%`, icon: FileText, note: "Resume, skills, education, projects", progress: profileScore },
          { label: "Applications", value: applications.length, icon: Send, note: `${activeApps.length} active pipelines`, progress: Math.min(applications.length * 20, 100) },
          { label: "Interviews", value: upcoming.length, icon: Video, note: "Upcoming confirmed slots", progress: Math.min(upcoming.length * 35, 100) },
          { label: "Placements", value: placed.length, icon: CheckCircle2, note: "Offers joined or accepted", progress: placed.length ? 100 : 12 },
        ]}
      />

      <Tabs defaultValue="journey" className="space-y-6">
        <TabsList className="rounded-[2px] border border-white/[0.08] bg-[#080808]">
          <TabsTrigger value="journey" className="rounded-[2px] font-mono-ui text-xs data-[state=active]:bg-[#c8f04a] data-[state=active]:text-[#080808]">Journey</TabsTrigger>
          <TabsTrigger value="profile" className="rounded-[2px] font-mono-ui text-xs data-[state=active]:bg-[#c8f04a] data-[state=active]:text-[#080808]">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="journey" className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
            <Panel title="Application Pipeline" sub="Every role you have applied to, grouped as live placement movement.">
              <div className="space-y-px border border-white/[0.08] bg-white/[0.08]">
                {applications.length === 0 ? (
                  <EmptyLine text="No applications yet. Start from matching roles." />
                ) : applications.map((app: any) => (
                  <Row key={app.id} title={app.job?.title || `Job ${app.jobId}`} meta={`${app.job?.location || "Location pending"} / ${app.status}`} right={app.currentRound || "Pipeline"} />
                ))}
              </div>
            </Panel>

            <Panel title="Top Matches" sub="Recommended roles based on your parsed profile and job requirements.">
              <div className="space-y-3">
                {recommendations.length === 0 ? (
                  <EmptyLine text="Upload resume details to improve recommendations." />
                ) : recommendations.slice(0, 4).map((job: any) => (
                  <Link key={job.id} href="/jobs" className="block border border-white/[0.08] bg-[#080808] p-4 hover:border-[#c8f04a]/60">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-[#f0ede8]">{job.title}</p>
                        <p className="font-mono-ui text-xs text-[#f0ede8]/42">{job.location} / {job.salary}</p>
                      </div>
                      <span className="pis-status px-2 py-1">{job.matchScore}%</span>
                    </div>
                  </Link>
                ))}
              </div>
            </Panel>
          </div>

          <Panel title="Upcoming Interviews" sub="Confirmed communication layer events for your placement journey.">
            <div className="grid gap-px border border-white/[0.08] bg-white/[0.08] md:grid-cols-2">
              {upcoming.length === 0 ? (
                <EmptyLine text="No upcoming interviews scheduled." />
              ) : upcoming.map((slot: any) => (
                <Row key={slot.id} title={`${slot.roundType} Round`} meta={new Date(slot.startTime).toLocaleString()} right={slot.status} />
              ))}
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="profile" className="grid gap-6 lg:grid-cols-2">
          <ResumeUpload />
          <Panel title="Extracted Candidate Data" sub="This is what the matching engine can use for scoring.">
            {studentDetails ? (
              <div className="space-y-4">
                <Detail label="Skills" value={studentDetails.skills || "No skills parsed yet."} />
                <Detail label="Education" value={studentDetails.education || "No education parsed yet."} />
                <Detail label="Projects" value={studentDetails.projects || "No projects parsed yet."} />
              </div>
            ) : <EmptyLine text="Student profile is still loading." />}
          </Panel>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}

function EmployerDashboard({ user }: { user: any }) {
  const { data: jobs = [] } = useJobs();
  const { data: applications = [] } = useApplications();
  const { data: schedule = [] } = useMySchedule();
  const myJobs = jobs.filter((job: any) => job.employerId === user.id);
  const activeApps = applications.filter((app: any) => !["Rejected", "Withdrawn", "Joined"].includes(app.status));
  const interviews = schedule.filter((slot: any) => new Date(slot.startTime) > new Date());
  const offers = applications.filter((app: any) => ["Offer_Released", "Offer_Accepted", "Joined"].includes(app.status));

  return (
    <DashboardShell
      kicker="Employer portal"
      title={`${user.name || "Employer"} hiring pipeline.`}
      subtitle="Manage open roles, candidate movement, interviews, feedback loops, and offer-stage decisions."
      action={{ href: "/jobs", label: "Create opening" }}
    >
      <MetricGrid
        items={[
          { label: "Open roles", value: myJobs.length, icon: Briefcase, note: "Posted by your company", progress: Math.min(myJobs.length * 25, 100) },
          { label: "Candidates", value: applications.length, icon: Users, note: `${activeApps.length} active`, progress: Math.min(activeApps.length * 12, 100) },
          { label: "Interviews", value: interviews.length, icon: CalendarDays, note: "Upcoming slots", progress: Math.min(interviews.length * 30, 100) },
          { label: "Offer motion", value: offers.length, icon: CheckCircle2, note: "Released, accepted, joined", progress: Math.min(offers.length * 30, 100) },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Panel title="Role Fill Progress" sub="Your jobs with current application volume.">
          <div className="space-y-px border border-white/[0.08] bg-white/[0.08]">
            {myJobs.length === 0 ? <EmptyLine text="No jobs posted yet." /> : myJobs.map((job: any) => {
              const count = applications.filter((app: any) => app.jobId === job.id).length;
              return <Row key={job.id} title={job.title} meta={`${job.location} / ${job.salary}`} right={`${count} candidates`} />;
            })}
          </div>
        </Panel>

        <Panel title="Candidate Pipeline" sub="Latest applicants requiring recruiter action.">
          <div className="space-y-px border border-white/[0.08] bg-white/[0.08]">
            {applications.length === 0 ? <EmptyLine text="No candidates in pipeline." /> : applications.slice(0, 8).map((app: any) => (
              <Row key={app.id} title={app.student?.name || "Candidate"} meta={app.job?.title || "Role"} right={app.status} />
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Interview & Feedback Layer" sub="Scheduled conversations, status tracker, and response obligations.">
        <div className="grid gap-px border border-white/[0.08] bg-white/[0.08] md:grid-cols-3">
          {interviews.length === 0 ? <EmptyLine text="No upcoming interviews." /> : interviews.slice(0, 6).map((slot: any) => (
            <Row key={slot.id} title={`${slot.roundType} Round`} meta={new Date(slot.startTime).toLocaleString()} right={slot.status} />
          ))}
        </div>
      </Panel>
    </DashboardShell>
  );
}

function AdminDashboard({ user }: { user: any }) {
  const { data: stats } = useStats();
  const { data: students = [] } = useStudents();
  const { data: recruiters = [] } = useRecruiters();
  const { data: applications = [] } = useApplications();
  const pendingRecruiters = recruiters.filter((r: any) => !r.isApproved);
  const placedStudents = students.filter((s: any) => s.status === "PLACED");
  const inProgress = students.filter((s: any) => s.status === "IN-PROGRESS");

  return (
    <DashboardShell
      kicker={user.role === "admin" ? "Admin command center" : "Officer command center"}
      title="Placement operations, governance, and analytics."
      subtitle="Run student intake, employer approval, drives, compliance, reports, and system-level placement intelligence."
      action={{ href: "/ingestion", label: "View system layers" }}
    >
      <MetricGrid
        items={[
          { label: "Students", value: stats?.totalStudents ?? students.length, icon: Users, note: `${inProgress.length} in progress`, progress: Math.min(students.length * 8, 100) },
          { label: "Recruiters", value: stats?.totalEmployers ?? recruiters.length, icon: Briefcase, note: `${pendingRecruiters.length} pending approval`, progress: Math.min(recruiters.length * 12, 100) },
          { label: "Jobs", value: stats?.totalJobs ?? 0, icon: BarChart3, note: "Active role inventory", progress: Math.min((stats?.totalJobs ?? 0) * 12, 100) },
          { label: "Placements", value: stats?.placements ?? placedStudents.length, icon: CheckCircle2, note: "Confirmed outcomes", progress: students.length ? Math.round((placedStudents.length / students.length) * 100) : 0 },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Placement Funnel" sub="Student status distribution from the operations layer.">
          <div className="grid gap-px border border-white/[0.08] bg-white/[0.08] md:grid-cols-3">
            <StatusBlock label="Unplaced" value={students.filter((s: any) => s.status === "UNPLACED").length} />
            <StatusBlock label="In progress" value={inProgress.length} />
            <StatusBlock label="Placed" value={placedStudents.length} />
          </div>
        </Panel>

        <Panel title="Approval Queue" sub="Employer accounts waiting for validation.">
          <div className="space-y-px border border-white/[0.08] bg-white/[0.08]">
            {pendingRecruiters.length === 0 ? <EmptyLine text="No pending recruiter approvals." /> : pendingRecruiters.map((r: any) => (
              <Row key={r.userId} title={r.companyName} meta={r.email} right="Pending" />
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Live Activity Feed" sub="Latest applications across the campus placement system.">
        <div className="space-y-px border border-white/[0.08] bg-white/[0.08]">
          {applications.length === 0 ? <EmptyLine text="No applications recorded yet." /> : applications.slice(0, 10).map((app: any) => (
            <Row key={app.id} title={app.student?.name || "Student"} meta={app.job?.title || `Job ${app.jobId}`} right={app.status} />
          ))}
        </div>
      </Panel>
    </DashboardShell>
  );
}

function DashboardShell({ kicker, title, subtitle, action, children }: any) {
  const { data: notifications = [] } = useNotifications();

  return (
    <div className="space-y-8 text-[#f0ede8]">
      <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] pb-8">
        <div>
          <p className="pis-kicker mb-3">{kicker}</p>
          <h1 className="max-w-5xl text-4xl font-extrabold leading-tight tracking-[-0.04em] md:text-6xl">{title}</h1>
          <p className="mt-5 max-w-3xl font-mono-ui text-sm leading-7 text-[#f0ede8]/45">{subtitle}</p>
        </div>
        <Link href={action.href} className="hidden items-center gap-2 border border-white/[0.08] bg-[#0e0e0e] px-4 py-2 font-mono-ui text-[0.7rem] uppercase tracking-[0.1em] text-[#f0ede8]/70 transition-colors hover:border-[#c8f04a]/60 hover:text-[#f0ede8] md:inline-flex">
          {action.label}
          <ArrowUpRight className="h-4 w-4 text-[#c8f04a]" />
        </Link>
      </div>
      {notifications.length > 0 && (
        <div className="grid gap-px border border-white/[0.08] bg-white/[0.08] md:grid-cols-2">
          {notifications.slice(0, 2).map((notice: any) => (
            <div key={notice.id} className="flex gap-3 bg-[#080808] p-4">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#c8f04a]" />
              <div>
                <p className="text-sm font-bold text-[#f0ede8]">{notice.title}</p>
                <p className="mt-1 font-mono-ui text-xs leading-6 text-[#f0ede8]/42">{notice.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {children}
    </div>
  );
}

function MetricGrid({ items }: { items: any[] }) {
  return (
    <div className="grid grid-cols-1 gap-px border border-white/[0.08] bg-white/[0.08] lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className="rounded-none border-0 bg-[#080808] transition-colors hover:bg-[#141414]">
            <CardHeader className="flex flex-row items-start justify-between pb-4">
              <div>
                <p className="font-mono-ui text-[0.68rem] uppercase tracking-[0.14em] text-[#f0ede8]/42">{item.label}</p>
                <div className="mt-3 text-4xl font-extrabold tracking-[-0.04em] text-[#f0ede8]">{item.value}</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center bg-[#c8f04a] text-[#080808]">
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <Progress value={item.progress} className="h-1.5 rounded-none bg-[#141414]" />
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.1em] text-[#f0ede8]/36">{item.note}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function Panel({ title, sub, children }: any) {
  return (
    <Card className="rounded-[2px] border-white/[0.08] bg-[#0e0e0e]">
      <CardHeader className="border-b border-white/[0.08] pb-4">
        <CardTitle className="text-xl font-bold tracking-tight text-[#f0ede8]">{title}</CardTitle>
        <p className="mt-1 font-mono-ui text-[11px] text-[#f0ede8]/42">{sub}</p>
      </CardHeader>
      <CardContent className="pt-5">{children}</CardContent>
    </Card>
  );
}

function Row({ title, meta, right }: { title: string; meta: string; right: string }) {
  return (
    <div className="flex items-center justify-between gap-4 bg-[#080808] px-4 py-4 transition-colors hover:bg-[#141414]">
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-[#f0ede8]">{title}</p>
        <p className="truncate font-mono-ui text-[11px] text-[#f0ede8]/42">{meta}</p>
      </div>
      <span className="pis-status shrink-0 px-2 py-1">{right}</span>
    </div>
  );
}

function StatusBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[#080808] p-6">
      <p className="font-mono-ui text-[0.68rem] uppercase tracking-[0.14em] text-[#f0ede8]/42">{label}</p>
      <p className="mt-3 text-4xl font-extrabold tracking-[-0.04em] text-[#c8f04a]">{value}</p>
    </div>
  );
}

function EmptyLine({ text }: { text: string }) {
  return <div className="bg-[#080808] p-4 font-mono-ui text-sm text-[#f0ede8]/42">{text}</div>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-2 font-mono-ui text-[0.68rem] uppercase tracking-[0.12em] text-[#f0ede8]/42">{label}</p>
      <p className="whitespace-pre-wrap border border-white/[0.08] bg-[#080808] p-3 font-mono-ui text-sm text-[#f0ede8]/70">{value}</p>
    </div>
  );
}

function firstName(name?: string) {
  return name?.split(" ")[0] || "there";
}
