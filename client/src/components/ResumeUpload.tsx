import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UploadCloud, FileText } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({ title: "No file selected", description: "Please select a PDF resume to upload.", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    setUploading(true);
    try {
      const response = await fetch("/api/students/resume/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload resume");
      }

      setParsedData(data.extracted || null);
      
      toast({
        title: "Resume uploaded",
        description: data.message || "Resume saved successfully.",
      });

      // Invalidate queries to refresh the user profile
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="rounded-[2px] border-white/[0.08] bg-[#0e0e0e] text-[#f0ede8]">
      <CardHeader className="border-b border-white/[0.08]">
        <CardTitle className="text-xl font-bold text-[#f0ede8]">Resume Parsing</CardTitle>
        <CardDescription className="font-mono-ui text-xs leading-6 text-[#f0ede8]/45">
          Upload your resume (PDF). Our AI will automatically parse your skills, education, and projects.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Input id="resume" type="file" accept=".pdf" onChange={handleFileChange} className="pis-input" />
        </div>
        
        <Button onClick={handleUpload} disabled={!file || uploading} className="pis-button w-full sm:w-auto">
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Parsing Resume...
            </>
          ) : (
            <>
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload & Parse
            </>
          )}
        </Button>

        {parsedData && (
          <div className="mt-6 space-y-4 border border-white/[0.08] bg-[#080808] p-4">
            <h3 className="flex items-center font-semibold text-[#f0ede8]"><FileText className="mr-2 h-4 w-4 text-[#c8f04a]"/> Extracted Data</h3>
            
            {parsedData.skills && (
              <div>
                <p className="pis-label">Skills</p>
                <p className="font-mono-ui text-sm text-[#f0ede8]/65">{parsedData.skills}</p>
              </div>
            )}
            
            {parsedData.education && (
              <div>
                <p className="pis-label">Education</p>
                <p className="font-mono-ui text-sm text-[#f0ede8]/65">{parsedData.education}</p>
              </div>
            )}
            
            {parsedData.projects && (
              <div>
                <p className="pis-label">Projects</p>
                <p className="font-mono-ui text-sm text-[#f0ede8]/65">{parsedData.projects}</p>
              </div>
            )}
            
            <p className="mt-4 font-mono-ui text-xs font-medium text-[#c8f04a]">
              Profile successfully updated!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
