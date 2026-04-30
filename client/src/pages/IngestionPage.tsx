import { Link } from "wouter";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  ClipboardCheck,
  Coins,
  Database,
  KeyRound,
  Layers3,
  FileArchive,
  FileSignature,
  FileCheck2,
  FileText,
  Filter,
  Gauge,
  ListChecks,
  Mail,
  MessageSquareText,
  Receipt,
  Repeat,
  Search,
  ServerCog,
  Scale,
  ShieldCheck,
  Sparkles,
  Timer,
  Video,
  Workflow,
} from "lucide-react";
import { useUser } from "@/hooks/use-auth";

const modules = [
  {
    title: "Profile builder",
    icon: FileText,
    text: "Multi-step onboarding. Resume parser (PDF/DOC/LinkedIn). Auto-fill from parsed data. Manual override on every field.",
  },
  {
    title: "Employer intake",
    icon: Database,
    text: "Company profile, JD upload, bulk role import via CSV/API. Auto-extract skills, salary band, location from JD text.",
  },
  {
    title: "Data enrichment",
    icon: FileCheck2,
    text: "LinkedIn scrape consent, GitHub activity, portfolio links. Skill taxonomy normalization (Python > Python 3.x).",
  },
  {
    title: "Validation engine",
    icon: ShieldCheck,
    text: "Email/phone verification. Duplicate detection. Completeness score. Blocks sub-threshold profiles from entering pipeline.",
  },
];

const edgeCases = [
  "Duplicate candidate emails",
  "Corrupted resume PDF",
  "Non-English CVs",
  "Same employer multi-org",
  "Partial profile submit",
  "Name mismatch ID docs",
  "Gap in work history",
  "Unverifiable degree",
];

const scoringModules = [
  {
    title: "Skill vector match",
    icon: Sparkles,
    text: "Semantic embedding of candidate skills vs JD requirements. Cosine similarity score. Handles synonyms, adjacent skills, future potential.",
  },
  {
    title: "Multi-factor scorer",
    icon: Scale,
    text: "Weighted score across: skills (40%), experience (25%), location/remote fit (15%), salary fit (10%), culture signals (10%). Configurable weights per employer.",
  },
  {
    title: "Bias filter",
    icon: Filter,
    text: "Strips name, gender, age signals from scoring pass. Adverse impact monitoring. Disparate impact flagging. Audit log on every score.",
  },
  {
    title: "Rank & shortlist",
    icon: ListChecks,
    text: "Top-N candidate list per role. Tie-breaking rules (recency, activity). Employer can adjust weights and re-rank live.",
  },
  {
    title: "Feedback loop",
    icon: MessageSquareText,
    text: "Every hire/reject teaches the model. Employer rejection reasons feed back into weights. Model versioning - rollback if accuracy drops.",
  },
  {
    title: "Explainability",
    icon: FileCheck2,
    text: 'Every match score has a plain-English reason. "Strong match: 4/5 skills, 2 yrs relevant exp, remote-ok." Shown to both sides.',
  },
];

const matchFlow = [
  "JD ingested",
  "Skill extraction",
  "Candidate pool query",
  "Vector similarity",
  "Multi-factor score",
  "Bias check",
  "Ranked shortlist",
];

const scoringEdgeCases = [
  "Zero candidates match",
  "All candidates equal score",
  "Overqualified candidate",
  "JD with contradictory requirements",
  "Candidate active in 3 pipelines",
  "Skill listed but unverified",
  "Expired certification",
  "Role salary below market",
];

const communicationModules = [
  {
    title: "Messaging hub",
    icon: MessageSquareText,
    text: "In-platform chat. Employer <-> candidate, recruiter <-> all. Threaded conversations. Rich text, file attachments. Read receipts.",
  },
  {
    title: "Notification engine",
    icon: Mail,
    text: "Email, SMS, push, in-app. Configurable per user. Digest mode, instant mode. Anti-spam throttle. Unsubscribe per type.",
  },
  {
    title: "Interview scheduler",
    icon: ListChecks,
    text: "Availability sync (Google/Outlook). Propose 3 slots, candidate picks. Auto-confirm, auto-remind. Reschedule and cancel flows.",
  },
  {
    title: "Video integration",
    icon: Video,
    text: "Zoom/Meet/Teams links auto-generated. Pre-recorded async video interviews. Playback for employer with timestamped notes.",
  },
  {
    title: "Status tracker",
    icon: FileCheck2,
    text: "Kanban per role: Shortlisted -> Contacted -> Interviewing -> Offered -> Placed / Rejected / Withdrawn. Candidate sees their own status.",
  },
  {
    title: "Feedback collection",
    icon: ClipboardCheck,
    text: "Post-interview structured feedback form (employer). Post-process survey (candidate). NPS. All feeds analytics layer.",
  },
];

const communicationEdgeCases = [
  "Candidate ghosts interview",
  "Employer no-show",
  "Timezone mismatch",
  "Calendar double-book",
  "Video link broken",
  "Message not delivered",
  "Candidate withdraws mid-interview",
  "Offer expires unread",
  "Recruiter out of office",
];

const workflowModules = [
  {
    title: "Stage automations",
    icon: Workflow,
    text: 'Trigger actions on stage change. "When moved to Interview -> send calendar invite + remind after 24h if no confirm." Configurable per client.',
  },
  {
    title: "SLA monitor",
    icon: Timer,
    text: "Time-in-stage tracking. Alert recruiter at 48h inaction. Escalate to manager at 96h. Log breach for analytics.",
  },
  {
    title: "Bulk actions",
    icon: ListChecks,
    text: "Move 50 candidates to rejected with one template message. Stage all interviewed candidates. Bulk reschedule on holiday.",
  },
  {
    title: "Offer workflow",
    icon: FileSignature,
    text: "Offer letter generator (template + custom fields). Approval chain (recruiter -> manager -> legal). E-sign via DocuSign/HelloSign. Counter-offer flow.",
  },
  {
    title: "Rejection flow",
    icon: MessageSquareText,
    text: 'Staged rejection: soft ("role filled"), detailed ("skill gap: X"). Opt-in talent pool - rejected candidates held for future roles. Feedback email template.',
  },
  {
    title: "Compliance checks",
    icon: ShieldCheck,
    text: "Right to work verification trigger. GDPR data consent at each stage. Equal opportunity monitoring. Automatic purge of GDPR-expired data.",
  },
];

const workflowEdgeCases = [
  "Offer retracted post-sign",
  "Counter-offer loop",
  "Approval chain member leaves",
  "Candidate accepts then backs out",
  "Role cancelled mid-pipeline",
  "SLA breach on public holiday",
  "DocuSign timeout",
  "GDPR deletion request mid-process",
  "Duplicate offer sent",
];

const onboardingModules = [
  {
    title: "Document collection",
    icon: FileArchive,
    text: "Pre-start checklist: ID, right-to-work, bank details, contracts. Upload portal. Status per document. Chase reminders on incomplete.",
  },
  {
    title: "Day-1 pack",
    icon: FileCheck2,
    text: "Auto-generate welcome pack on confirmed start. IT access request trigger. Manager intro email. First-week schedule template.",
  },
  {
    title: "Check-in cadence",
    icon: Timer,
    text: "Automated 1-week, 30-day, 90-day check-in emails to both candidate and employer. CSAT survey. Flags at-risk placements early.",
  },
  {
    title: "Retention tracking",
    icon: ListChecks,
    text: "6-month and 12-month still-employed verification. Churn risk score. Triggers recruiter outreach if risk > threshold.",
  },
  {
    title: "Invoice & billing",
    icon: Receipt,
    text: "Placement fee calculation (% salary / flat). Contingency vs retained billing logic. Invoice generation. Credit note on early leaver.",
  },
  {
    title: "Re-engagement pool",
    icon: Repeat,
    text: "Early leavers return to talent pool flagged. Employer opens replacement requisition automatically. Recruiter alerted. SLA clock restarts.",
  },
];

const onboardingEdgeCases = [
  "Candidate leaves day 1",
  "Employer disputes fee",
  "Start date pushed back",
  "Visa delay blocks start",
  "Role made redundant post-start",
  "Candidate on sick leave week 1",
  "Manager changes before start",
  "Salary error in offer letter",
];

const intelligenceModules = [
  {
    title: "Recruiter dashboard",
    icon: Gauge,
    text: "Live pipeline view. Tasks due today. Roles at SLA risk. My placements this month vs target. Conversion rates by stage.",
  },
  {
    title: "Employer portal",
    icon: Database,
    text: "Role fill progress. Candidate pipeline Kanban. Interview schedule. Time-to-fill benchmark vs market. Feedback history.",
  },
  {
    title: "Funnel analytics",
    icon: BarChart3,
    text: "Drop-off by stage. Source attribution (LinkedIn/job board/referral). Offer-to-accept rate. Interview-to-offer rate. Best-performing recruiter report.",
  },
  {
    title: "Financial reporting",
    icon: Coins,
    text: "Revenue per placement. Forecast vs actual. Aged receivables. Margin per client. YTD vs prior year. Exportable to Xero/QuickBooks.",
  },
  {
    title: "Match quality report",
    icon: Scale,
    text: "90-day retention by match score band. Score calibration report. Model drift alerts. A/B test results for scoring changes.",
  },
  {
    title: "Compliance audit log",
    icon: ShieldCheck,
    text: "Every score, every decision, every stage change logged with user + timestamp. GDPR retention audit trail. Equal opportunity report exportable for regulators.",
  },
];

const intelligencePills = [
  { label: "Real-time", className: "bg-[#185f14] text-[#93f06c]" },
  { label: "Exportable CSV/PDF", className: "bg-[#24456f] text-[#9fc7ff]" },
  { label: "Role-based access", className: "bg-[#6b5007] text-[#ffd66d]" },
  { label: "API-first data model", className: "bg-[#24456f] text-[#9fc7ff]" },
];

const infrastructureModules = [
  {
    title: "Auth & RBAC",
    icon: KeyRound,
    text: "SSO (Google/Microsoft). MFA. Roles: SuperAdmin, Recruiter, Client, Candidate, ReadOnly. Permission matrix per object. Session management.",
  },
  {
    title: "Multi-tenancy",
    icon: Layers3,
    text: "Isolated data per client org. White-label sub-domains. Custom branding per tenant. Per-tenant feature flags.",
  },
  {
    title: "API layer",
    icon: ServerCog,
    text: "REST + webhooks. Rate limiting. API key management. Job board integrations (Reed, Indeed, LinkedIn). ATS integrations (Workday, Greenhouse).",
  },
  {
    title: "Data & privacy",
    icon: ShieldCheck,
    text: "GDPR / PDPA / CCPA compliance. Data residency config. Right-to-erasure workflow. Encrypted at rest + in transit. Data retention policies.",
  },
  {
    title: "Search & indexing",
    icon: Search,
    text: "Full-text search across all candidates. Faceted filters (skill, location, salary, availability). Instant results. Saved searches with alerts.",
  },
  {
    title: "Scale & reliability",
    icon: Gauge,
    text: "Queue-based async jobs. Horizontal scaling. 99.9% SLA. DB read replicas. CDN for assets. Disaster recovery. Monitoring + alerting (PagerDuty).",
  },
];

const infrastructureEdgeCases = [
  "Tenant data leak between orgs",
  "SSO provider down",
  "GDPR deletion race condition",
  "API rate limit exceeded",
  "Job board sync failure",
  "DB replication lag",
  "Search index stale",
  "Feature flag rollback",
  "Webhook delivery failure",
  "Multi-region failover",
];

export default function IngestionPage() {
  const { data: user } = useUser();
  const actionHref = user?.role === "employer" ? "/jobs" : "/students";

  return (
    <div className="space-y-8 text-[#f0ede8]">
      <div>
        <p className="pis-kicker mb-3">Layer 1</p>
        <h1 className="pis-page-title mb-3">Candidate & Employer Ingestion</h1>
        <p className="font-mono-ui text-sm text-[#f0ede8]/45">
          The intake layer for candidate profiles, employer data, resume parsing, and validation before records enter the placement pipeline.
        </p>
      </div>

      <section className="max-w-5xl rounded-[14px] border border-white/[0.12] bg-[#171715] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.24)] md:p-5">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="rounded-[5px] bg-[#24456f] px-2.5 py-1 font-mono-ui text-xs font-bold text-[#9fc7ff]">
              L1
            </span>
            <h2 className="text-xl font-extrabold tracking-[-0.03em] text-[#f0ede8]">
              Candidate & Employer Ingestion
            </h2>
          </div>
          <button className="inline-flex items-center gap-24 font-semibold text-[#f0ede8]/68">
            <span>The brick</span>
            <ChevronDown className="h-4 w-4 text-[#f0ede8]/50" />
          </button>
        </div>

        <div className="mb-3 font-mono-ui text-sm font-bold uppercase tracking-[0.12em] text-[#f0ede8]/50">
          Core modules
        </div>

        <div className="grid gap-2.5 md:grid-cols-3">
          {modules.slice(0, 3).map((module) => (
            <ModuleCard key={module.title} {...module} />
          ))}
          <ModuleCard {...modules[3]} />
        </div>

        <div className="mt-3 rounded-[8px] bg-[#232321] p-4">
          <div className="mb-2 font-mono-ui text-sm font-bold uppercase tracking-[0.1em] text-[#f0ede8]/58">
            Edge cases handled
          </div>
          <div className="flex flex-wrap gap-2">
            {edgeCases.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/25 px-3 py-1 font-semibold text-sm text-[#f0ede8]/72"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <Link
          href={actionHref}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-[8px] border border-white/25 bg-transparent px-4 py-3 text-center text-base font-extrabold text-[#f0ede8] transition-colors hover:border-[#c8f04a]/70 hover:text-[#c8f04a]"
        >
          Build this module in detail
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="max-w-5xl rounded-[14px] border border-white/[0.12] bg-[#171715] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.24)] md:p-5">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="rounded-[5px] bg-[#24456f] px-2.5 py-1 font-mono-ui text-xs font-bold text-[#9fc7ff]">
              L2
            </span>
            <h2 className="text-xl font-extrabold tracking-[-0.03em] text-[#f0ede8]">
              Matching & Scoring Engine
            </h2>
          </div>
          <button className="inline-flex items-center gap-24 font-semibold text-[#f0ede8]/68">
            <span>The brain</span>
            <ChevronDown className="h-4 w-4 text-[#f0ede8]/50" />
          </button>
        </div>

        <div className="mb-3 font-mono-ui text-sm font-bold uppercase tracking-[0.12em] text-[#f0ede8]/50">
          Core modules
        </div>

        <div className="grid gap-2.5 md:grid-cols-3">
          {scoringModules.map((module) => (
            <ModuleCard key={module.title} {...module} />
          ))}
        </div>

        <div className="mt-4">
          <div className="mb-2 font-mono-ui text-sm font-bold uppercase tracking-[0.12em] text-[#f0ede8]/50">
            Match flow
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {matchFlow.map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <span className="rounded-[6px] border border-white/20 bg-[#2a2a27] px-3 py-1.5 text-sm font-extrabold text-[#f0ede8]/82">
                  {step}
                </span>
                {index < matchFlow.length - 1 && <ArrowRight className="h-4 w-4 text-[#f0ede8]/35" />}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 rounded-[8px] bg-[#232321] p-4">
          <div className="mb-2 font-mono-ui text-sm font-bold uppercase tracking-[0.1em] text-[#f0ede8]/58">
            Edge cases handled
          </div>
          <div className="flex flex-wrap gap-2">
            {scoringEdgeCases.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/25 px-3 py-1 font-semibold text-sm text-[#f0ede8]/72"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <Link
          href="/jobs"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-[8px] border border-white/25 bg-transparent px-4 py-3 text-center text-base font-extrabold text-[#f0ede8] transition-colors hover:border-[#c8f04a]/70 hover:text-[#c8f04a]"
        >
          Design full schema
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="max-w-5xl rounded-[14px] border border-white/[0.12] bg-[#171715] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.24)] md:p-5">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="rounded-[5px] bg-[#1e6427] px-2.5 py-1 font-mono-ui text-xs font-bold text-[#9dffae]">
              L3
            </span>
            <h2 className="text-xl font-extrabold tracking-[-0.03em] text-[#f0ede8]">
              Interaction & Communication Layer
            </h2>
          </div>
          <button className="inline-flex items-center gap-24 font-semibold text-[#f0ede8]/68">
            <span>The nervous system</span>
            <ChevronDown className="h-4 w-4 text-[#f0ede8]/50" />
          </button>
        </div>

        <div className="grid gap-2.5 md:grid-cols-3">
          {communicationModules.map((module) => (
            <ModuleCard key={module.title} {...module} />
          ))}
        </div>

        <div className="mt-3 rounded-[8px] bg-[#232321] p-4">
          <div className="mb-2 font-mono-ui text-sm font-bold uppercase tracking-[0.1em] text-[#f0ede8]/58">
            Edge cases handled
          </div>
          <div className="flex flex-wrap gap-2">
            {communicationEdgeCases.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/25 px-3 py-1 font-semibold text-sm text-[#f0ede8]/72"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <Link
          href="/interviews"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-[8px] border border-white/25 bg-transparent px-4 py-3 text-center text-base font-extrabold text-[#f0ede8] transition-colors hover:border-[#c8f04a]/70 hover:text-[#c8f04a]"
        >
          Build communication module
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="max-w-5xl rounded-[14px] border border-white/[0.12] bg-[#171715] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.24)] md:p-5">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="rounded-[5px] bg-[#1e6427] px-2.5 py-1 font-mono-ui text-xs font-bold text-[#9dffae]">
              L4
            </span>
            <h2 className="text-xl font-extrabold tracking-[-0.03em] text-[#f0ede8]">
              Pipeline & Workflow Automation
            </h2>
          </div>
          <button className="inline-flex items-center gap-24 font-semibold text-[#f0ede8]/68">
            <span>The engine room</span>
            <ChevronDown className="h-4 w-4 text-[#f0ede8]/50" />
          </button>
        </div>

        <div className="grid gap-2.5 md:grid-cols-3">
          {workflowModules.map((module) => (
            <ModuleCard key={module.title} {...module} />
          ))}
        </div>

        <div className="mt-3 rounded-[8px] bg-[#232321] p-4">
          <div className="mb-2 font-mono-ui text-sm font-bold uppercase tracking-[0.1em] text-[#f0ede8]/58">
            Edge cases handled
          </div>
          <div className="flex flex-wrap gap-2">
            {workflowEdgeCases.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/25 px-3 py-1 font-semibold text-sm text-[#f0ede8]/72"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <Link
          href="/drives"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-[8px] border border-white/25 bg-transparent px-4 py-3 text-center text-base font-extrabold text-[#f0ede8] transition-colors hover:border-[#c8f04a]/70 hover:text-[#c8f04a]"
        >
          Design state machines
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="max-w-5xl rounded-[14px] border border-white/[0.12] bg-[#171715] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.24)] md:p-5">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="rounded-[5px] bg-[#6b5007] px-2.5 py-1 font-mono-ui text-xs font-bold text-[#ffd66d]">
              L5
            </span>
            <h2 className="text-xl font-extrabold tracking-[-0.03em] text-[#f0ede8]">
              Onboarding & Post-Placement
            </h2>
          </div>
          <button className="inline-flex items-center gap-24 font-semibold text-[#f0ede8]/68">
            <span>The handoff</span>
            <ChevronDown className="h-4 w-4 text-[#f0ede8]/50" />
          </button>
        </div>

        <div className="grid gap-2.5 md:grid-cols-3">
          {onboardingModules.map((module) => (
            <ModuleCard key={module.title} {...module} />
          ))}
        </div>

        <div className="mt-3 rounded-[8px] bg-[#232321] p-4">
          <div className="mb-2 font-mono-ui text-sm font-bold uppercase tracking-[0.1em] text-[#f0ede8]/58">
            Edge cases handled
          </div>
          <div className="flex flex-wrap gap-2">
            {onboardingEdgeCases.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/25 px-3 py-1 font-semibold text-sm text-[#f0ede8]/72"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <Link
          href="/reports"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-[8px] border border-white/25 bg-transparent px-4 py-3 text-center text-base font-extrabold text-[#f0ede8] transition-colors hover:border-[#c8f04a]/70 hover:text-[#c8f04a]"
        >
          Build onboarding module
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="max-w-5xl rounded-[14px] border border-white/[0.12] bg-[#171715] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.24)] md:p-5">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="rounded-[5px] bg-[#6b5007] px-2.5 py-1 font-mono-ui text-xs font-bold text-[#ffd66d]">
              L6
            </span>
            <h2 className="text-xl font-extrabold tracking-[-0.03em] text-[#f0ede8]">
              Analytics & Intelligence Dashboard
            </h2>
          </div>
          <button className="inline-flex items-center gap-24 font-semibold text-[#f0ede8]/68">
            <span>The command center</span>
            <ChevronDown className="h-4 w-4 text-[#f0ede8]/50" />
          </button>
        </div>

        <div className="grid gap-2.5 md:grid-cols-3">
          {intelligenceModules.map((module) => (
            <ModuleCard key={module.title} {...module} />
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {intelligencePills.map((pill) => (
            <span key={pill.label} className={`rounded-full px-3 py-1 font-mono-ui text-sm font-semibold ${pill.className}`}>
              {pill.label}
            </span>
          ))}
        </div>

        <Link
          href="/dashboard"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-[8px] border border-white/25 bg-transparent px-4 py-3 text-center text-base font-extrabold text-[#f0ede8] transition-colors hover:border-[#c8f04a]/70 hover:text-[#c8f04a]"
        >
          Design the dashboard
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="max-w-5xl rounded-[14px] border border-white/[0.12] bg-[#171715] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.24)] md:p-5">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="rounded-[5px] bg-[#7a3434] px-2.5 py-1 font-mono-ui text-xs font-bold text-[#ffaaa7]">
              L7
            </span>
            <h2 className="text-xl font-extrabold tracking-[-0.03em] text-[#f0ede8]">
              Platform & Infrastructure (The Empire)
            </h2>
          </div>
          <button className="inline-flex items-center gap-24 font-semibold text-[#f0ede8]/68">
            <span>The foundation</span>
            <ChevronDown className="h-4 w-4 text-[#f0ede8]/50" />
          </button>
        </div>

        <div className="grid gap-2.5 md:grid-cols-3">
          {infrastructureModules.map((module) => (
            <ModuleCard key={module.title} {...module} />
          ))}
        </div>

        <div className="mt-3 rounded-[8px] bg-[#232321] p-4">
          <div className="mb-2 font-mono-ui text-sm font-bold uppercase tracking-[0.1em] text-[#f0ede8]/58">
            Edge cases handled
          </div>
          <div className="flex flex-wrap gap-2">
            {infrastructureEdgeCases.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/25 px-3 py-1 font-semibold text-sm text-[#f0ede8]/72"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <Link
          href="/settings"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-[8px] border border-white/25 bg-transparent px-4 py-3 text-center text-base font-extrabold text-[#f0ede8] transition-colors hover:border-[#c8f04a]/70 hover:text-[#c8f04a]"
        >
          Design infrastructure
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}

function ModuleCard({
  title,
  text,
  icon: Icon,
}: {
  title: string;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <article className="rounded-[8px] bg-[#232321] p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#c8f04a]" />
        <h3 className="text-base font-extrabold tracking-[-0.02em] text-[#f0ede8]">{title}</h3>
      </div>
      <p className="text-sm font-semibold leading-6 text-[#f0ede8]/65">{text}</p>
    </article>
  );
}
