import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-8 text-slate-50">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-violet-300 uppercase tracking-[0.2em] mb-2">
            Reports
          </p>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            Analytics Engine
          </h1>
          <p className="text-sm text-slate-400">
            Detailed placement reports and trend analysis for the current
            academic year.
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
            Detailed placement reports and trend analysis for the current
            academic year are being compiled.
          </p>
        </CardHeader>
        <CardContent className="flex justify-center pb-10">
          <Button className="bg-violet-600 hover:bg-violet-500 text-white px-6">
            Generate PDF Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

