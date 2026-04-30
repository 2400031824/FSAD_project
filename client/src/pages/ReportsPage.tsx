import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";
import { api } from "@shared/routes";
import { useUser } from "@/hooks/use-auth";

type SummaryStats = {
  totalStudents: number;
  totalEmployers: number;
  totalJobs: number;
  placements: number;
};

type ApplicationItem = {
  id: number;
  status: string;
  job?: { title: string; location: string; employerId?: number };
  student?: { name: string };
};

const placedStatuses = new Set(["Joined", "Offer_Accepted", "Offer_Released", "selected"]);

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { data: user } = useUser();

  const generatePdf = async () => {
    try {
      setIsGenerating(true);

      const [statsRes, appsRes] = await Promise.all([
        fetch(api.stats.get.path, { credentials: "include" }),
        fetch(api.applications.list.path, { credentials: "include" }),
      ]);

      if (!appsRes.ok) {
        throw new Error("Could not fetch application data.");
      }

      const applications = (await appsRes.json()) as ApplicationItem[];
      const stats = statsRes.ok
        ? ((await statsRes.json()) as SummaryStats)
        : buildScopedStats(applications, user?.role);

      const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const generatedAt = new Date().toLocaleString();
      const title = user?.role === "student" ? "My Placement Report" : "Placement Summary Report";

      doc.setFontSize(20);
      doc.text(title, 40, 52);
      doc.setFontSize(10);
      doc.text(`Generated: ${generatedAt}`, 40, 72);

      doc.setFontSize(13);
      doc.text("Overview", 40, 106);
      doc.setFontSize(11);
      doc.text(`${user?.role === "student" ? "Student Scope" : "Total Students"}: ${stats.totalStudents}`, 40, 128);
      doc.text(`Total Recruiters: ${stats.totalEmployers}`, 40, 146);
      doc.text(`Total Jobs: ${stats.totalJobs}`, 40, 164);
      doc.text(`Placements: ${stats.placements}`, 40, 182);

      doc.setFontSize(13);
      doc.text("Recent Applications", 40, 220);
      doc.setFontSize(10);

      let y = 244;
      const recent = applications.slice(0, 18);
      if (recent.length === 0) {
        doc.text("No applications available.", 40, y);
      } else {
        recent.forEach((app, index) => {
          const line = `${index + 1}. ${app.student?.name || user?.name || "Student"} - ${app.job?.title || "Role"} (${app.status})`;
          doc.text(line, 40, y);
          y += 16;
          if (y > 770) {
            doc.addPage();
            y = 48;
          }
        });
      }

      doc.save(`placement-report-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast({ title: "PDF generated", description: "Report downloaded successfully." });
    } catch (error) {
      toast({
        title: "PDF generation failed",
        description: error instanceof Error ? error.message : "Unexpected error",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 text-[#f0ede8]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="pis-kicker mb-3">Reports</p>
          <h1 className="pis-page-title mb-3">Analytics Engine</h1>
          <p className="font-mono-ui text-sm text-[#f0ede8]/45">
            Detailed placement reports and trend analysis for the current academic year.
          </p>
        </div>
      </div>

      <Card className="rounded-[2px] border-white/[0.08] bg-[#0e0e0e]">
        <CardHeader className="flex flex-col items-center text-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center bg-[#c8f04a] shadow-[0_0_30px_rgba(200,240,74,0.24)]">
            <BarChart3 className="h-6 w-6 text-[#080808]" />
          </div>
          <CardTitle className="text-2xl font-extrabold tracking-[-0.03em] text-[#f0ede8]">Analytics Engine</CardTitle>
          <p className="max-w-xl font-mono-ui text-sm leading-7 text-[#f0ede8]/45">
            Generate a downloadable PDF with current placement metrics and recent applications.
          </p>
        </CardHeader>
        <CardContent className="flex justify-center pb-10">
          <Button
            onClick={generatePdf}
            disabled={isGenerating}
            className="pis-button px-6 hover:opacity-85"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Generate PDF Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function buildScopedStats(applications: ApplicationItem[], role?: string): SummaryStats {
  const uniqueJobs = new Set(applications.map((app) => app.job?.title).filter(Boolean));
  const uniqueEmployers = new Set(applications.map((app) => app.job?.employerId).filter(Boolean));

  return {
    totalStudents: role === "student" ? 1 : new Set(applications.map((app) => app.student?.name).filter(Boolean)).size,
    totalEmployers: uniqueEmployers.size || (applications.length > 0 ? 1 : 0),
    totalJobs: uniqueJobs.size,
    placements: applications.filter((app) => placedStatuses.has(app.status)).length,
  };
}
