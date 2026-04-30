import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Briefcase, CheckCircle2, FileText, Lightbulb, Save, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useProfile, useUpdateProfile } from "@/hooks/use-profile";
import { useJobRecommendations } from "@/hooks/use-recommendations";
import { ResumeUpload } from "@/components/ResumeUpload";

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const { data: recommendations = [] } = useJobRecommendations();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (!profile) return;
    setForm({
      name: profile.user.name || "",
      email: profile.user.email || "",
      department: profile.student?.department || "",
      cgpa: profile.student?.cgpa || "",
      graduationYear: profile.student?.graduationYear || "",
      skills: profile.student?.skills || "",
      education: profile.student?.education || "",
      projects: profile.student?.projects || "",
      companyName: profile.employer?.companyName || "",
      industry: profile.employer?.industry || "",
      website: profile.employer?.website || "",
    });
  }, [profile]);

  const score = useMemo(() => calculateProfileScore(profile, form), [profile, form]);
  const suggestions = useMemo(() => buildSuggestions(profile, form), [profile, form]);

  if (isLoading || !profile) {
    return <p className="font-mono-ui text-sm text-[#f0ede8]/45">Loading profile...</p>;
  }

  const isStudent = profile.user.role === "student";
  const isEmployer = profile.user.role === "employer";

  const save = () => {
    updateProfile({
      name: form.name,
      email: form.email,
      ...(isStudent
        ? {
            student: {
              department: form.department || null,
              cgpa: form.cgpa || null,
              graduationYear: form.graduationYear ? Number(form.graduationYear) : null,
              skills: form.skills || null,
              education: form.education || null,
              projects: form.projects || null,
            },
          }
        : {}),
      ...(isEmployer
        ? {
            employer: {
              companyName: form.companyName,
              industry: form.industry || null,
              website: form.website || null,
            },
          }
        : {}),
    });
  };

  return (
    <div className="space-y-8 text-[#f0ede8]">
      <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] pb-8">
        <div>
          <p className="pis-kicker mb-3">Profile center</p>
          <h1 className="max-w-5xl text-4xl font-extrabold leading-tight tracking-[-0.04em] md:text-6xl">
            {isStudent ? "Career profile that updates from your resume." : isEmployer ? "Employer profile and hiring identity." : "Account profile."}
          </h1>
          <p className="mt-5 max-w-3xl font-mono-ui text-sm leading-7 text-[#f0ede8]/45">
            Keep the profile complete so matching, recommendations, reporting, and communication workflows have the right signal.
          </p>
        </div>
        <Button onClick={save} disabled={isPending} className="pis-button hidden px-5 md:inline-flex">
          <Save className="mr-2 h-4 w-4" />
          Save profile
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.4fr]">
        <div className="space-y-6">
          <Card className="rounded-[2px] border-white/[0.08] bg-[#0e0e0e]">
            <CardHeader className="border-b border-white/[0.08]">
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-[#f0ede8]">
                <Sparkles className="h-5 w-5 text-[#c8f04a]" />
                Profile Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              <div className="text-6xl font-extrabold tracking-[-0.05em] text-[#c8f04a]">{score}%</div>
              <Progress value={score} className="h-2 rounded-none bg-[#141414]" />
              <div className="space-y-2">
                {suggestions.map((item) => (
                  <div key={item} className="flex gap-3 border border-white/[0.08] bg-[#080808] p-3">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#f0c84a]" />
                    <p className="font-mono-ui text-xs leading-6 text-[#f0ede8]/58">{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {isStudent && <ResumeUpload />}
        </div>

        <div className="space-y-6">
          <Panel title="Identity" sub="Basic account data used across the platform.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full name" value={form.name} onChange={(value: string) => setForm({ ...form, name: value })} />
              <Field label="Email" type="email" value={form.email} onChange={(value: string) => setForm({ ...form, email: value })} />
            </div>
          </Panel>

          {isStudent && (
            <>
              <Panel title="Candidate Profile" sub="The matching engine uses this data to score your role fit.">
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="Department" value={form.department} onChange={(value: string) => setForm({ ...form, department: value })} />
                  <Field label="CGPA" value={form.cgpa} onChange={(value: string) => setForm({ ...form, cgpa: value })} />
                  <Field label="Graduation year" type="number" value={String(form.graduationYear || "")} onChange={(value: string) => setForm({ ...form, graduationYear: value })} />
                </div>
                <Area label="Skills" value={form.skills} onChange={(value: string) => setForm({ ...form, skills: value })} />
                <Area label="Education" value={form.education} onChange={(value: string) => setForm({ ...form, education: value })} />
                <Area label="Projects" value={form.projects} onChange={(value: string) => setForm({ ...form, projects: value })} />
              </Panel>

              <Panel title="Recommended Jobs" sub="Dummy/demo jobs remain available for new registrations and demos.">
                <div className="grid gap-px border border-white/[0.08] bg-white/[0.08]">
                  {recommendations.length === 0 ? (
                    <EmptyLine text="Add skills or upload a resume to unlock recommendations." />
                  ) : recommendations.slice(0, 5).map((job: any) => (
                    <Link key={job.id} href="/jobs" className="flex items-center justify-between bg-[#080808] p-4 hover:bg-[#141414]">
                      <div>
                        <p className="font-bold text-[#f0ede8]">{job.title}</p>
                        <p className="font-mono-ui text-xs text-[#f0ede8]/42">{job.location} / {job.salary}</p>
                      </div>
                      <span className="pis-status px-2 py-1">{job.matchScore}% Match</span>
                    </Link>
                  ))}
                </div>
              </Panel>
            </>
          )}

          {isEmployer && (
            <Panel title="Employer Intake" sub="Company profile data used for job postings and candidate communication.">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Company name" value={form.companyName} onChange={(value: string) => setForm({ ...form, companyName: value })} />
                <Field label="Industry" value={form.industry} onChange={(value: string) => setForm({ ...form, industry: value })} />
              </div>
              <Field label="Website" value={form.website} onChange={(value: string) => setForm({ ...form, website: value })} />
              <Link href="/jobs" className="pis-button mt-4 inline-flex items-center px-5 py-3">
                <Briefcase className="mr-2 h-4 w-4" />
                Manage openings
              </Link>
            </Panel>
          )}

          <Button onClick={save} disabled={isPending} className="pis-button w-full md:hidden">
            <Save className="mr-2 h-4 w-4" />
            Save profile
          </Button>
        </div>
      </div>
    </div>
  );
}

function calculateProfileScore(profile: any, form: any) {
  const studentFields = ["name", "email", "department", "cgpa", "graduationYear", "skills", "education", "projects"];
  const employerFields = ["name", "email", "companyName", "industry", "website"];
  const fields = profile?.user?.role === "student" ? studentFields : profile?.user?.role === "employer" ? employerFields : ["name", "email"];
  return Math.round((fields.filter((field) => String(form[field] || "").trim().length > 0).length / fields.length) * 100);
}

function buildSuggestions(profile: any, form: any) {
  const items: string[] = [];
  const role = profile?.user?.role;
  if (!role) return ["Loading your profile signals..."];
  if (!form.skills && role === "student") items.push("Add skills or upload your resume so matching can score you against jobs.");
  if (!form.projects && role === "student") items.push("Add project impact, tools used, and outcomes to improve recruiter confidence.");
  if (!form.cgpa && role === "student") items.push("Add CGPA or academic score if your campus placement rules require eligibility filtering.");
  if (!form.companyName && role === "employer") items.push("Add company identity before creating public job openings.");
  if (!form.website && role === "employer") items.push("Add company website to improve candidate trust.");
  if (items.length === 0) items.push("Profile is strong. Keep it updated after every new skill, project, job, or hiring requirement.");
  return items;
}

function Panel({ title, sub, children }: any) {
  return (
    <Card className="rounded-[2px] border-white/[0.08] bg-[#0e0e0e]">
      <CardHeader className="border-b border-white/[0.08]">
        <CardTitle className="text-xl font-bold text-[#f0ede8]">{title}</CardTitle>
        <p className="font-mono-ui text-xs leading-6 text-[#f0ede8]/42">{sub}</p>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">{children}</CardContent>
    </Card>
  );
}

function Field({ label, value, onChange, type = "text" }: any) {
  return (
    <div className="space-y-2">
      <Label className="pis-label">{label}</Label>
      <Input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} className="pis-input" />
    </div>
  );
}

function Area({ label, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <Label className="pis-label">{label}</Label>
      <Textarea value={value || ""} onChange={(e) => onChange(e.target.value)} className="pis-input min-h-28" />
    </div>
  );
}

function EmptyLine({ text }: { text: string }) {
  return <div className="bg-[#080808] p-4 font-mono-ui text-sm text-[#f0ede8]/42">{text}</div>;
}
