import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";
import { api } from "@shared/routes";

type SummaryStats = {
  totalStudents: number;
  totalEmployers: number;
  totalJobs: number;
  placements: number;
};

type ApplicationItem = {
  id: number;
  status: string;
  job: { title: string; location: string };
  student: { name: string };
};

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generatePdf = async () => {
    try {
      setIsGenerating(true);

      const [statsRes, appsRes] = await Promise.all([
        fetch(api.stats.get.path, { credentials: "include" }),
        fetch(api.applications.list.path, { credentials: "include" }),
      ]);

      if (!statsRes.ok) {
        throw new Error("Could not fetch report statistics.");
      }
      if (!appsRes.ok) {
        throw new Error("Could not fetch application data.");
      }

      const stats = (await statsRes.json()) as SummaryStats;
      const applications = (await appsRes.json()) as ApplicationItem[];

      const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const generatedAt = new Date().toLocaleString();

      doc.setFontSize(20);
      doc.text("Placement Summary Report", 40, 52);
      doc.setFontSize(10);
      doc.text(`Generated: ${generatedAt}`, 40, 72);

      doc.setFontSize(13);
      doc.text("Overview", 40, 106);
      doc.setFontSize(11);
      doc.text(`Total Students: ${stats.totalStudents}`, 40, 128);
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
          const line = `${index + 1}. ${app.student?.name || "Student"} - ${app.job?.title || "Role"} (${app.status})`;
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
    <div className="space-y-8 text-slate-50">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-violet-300 uppercase tracking-[0.2em] mb-2">Reports</p>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Analytics Engine</h1>
          <p className="text-sm text-slate-400">
            Detailed placement reports and trend analysis for the current academic year.
          </p>
        </div>
      </div>

      <Card className="bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 border border-slate-800">
        <CardHeader className="flex flex-col items-center text-center space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-violet-600/80 flex items-center justify-center shadow-lg shadow-violet-500/40">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-xl">Analytics Engine</CardTitle>
          <p className="text-sm text-slate-400 max-w-xl">
            Generate a downloadable PDF with current placement metrics and recent applications.
          </p>
        </CardHeader>
        <CardContent className="flex justify-center pb-10">
          <Button
            onClick={generatePdf}
            disabled={isGenerating}
            className="bg-violet-600 hover:bg-violet-500 text-white px-6"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Generate PDF Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
