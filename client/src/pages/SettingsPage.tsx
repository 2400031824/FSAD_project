import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="space-y-8 text-slate-50">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-violet-300 uppercase tracking-[0.2em] mb-2">
            Settings
          </p>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            Account Settings
          </h1>
          <p className="text-sm text-slate-400">
            Configure notification and security preferences.
          </p>
        </div>
      </div>

      <Card className="bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 border border-slate-800 max-w-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-100">
                Email Notifications
              </p>
              <p className="text-[11px] text-slate-400">
                Receive daily summaries of placement activities.
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-100">
                Two-Factor Authentication
              </p>
              <p className="text-[11px] text-slate-400">
                Add an extra layer of security to your account.
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

