import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="space-y-8 text-[#f0ede8]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="pis-kicker mb-3">
            Settings
          </p>
          <h1 className="pis-page-title mb-3">
            Account Settings
          </h1>
          <p className="font-mono-ui text-sm text-[#f0ede8]/45">
            Configure notification and security preferences.
          </p>
        </div>
      </div>

      <Card className="max-w-xl rounded-[2px] border-white/[0.08] bg-[#0e0e0e]">
        <CardHeader className="border-b border-white/[0.08] pb-4">
          <CardTitle className="text-xl font-bold text-[#f0ede8]">Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-px bg-white/[0.08] p-0">
          <div className="flex items-center justify-between bg-[#080808] p-5">
            <div>
              <p className="text-sm font-bold text-[#f0ede8]">
                Email Notifications
              </p>
              <p className="font-mono-ui text-[11px] text-[#f0ede8]/42">
                Receive daily summaries of placement activities.
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between bg-[#080808] p-5">
            <div>
              <p className="text-sm font-bold text-[#f0ede8]">
                Two-Factor Authentication
              </p>
              <p className="font-mono-ui text-[11px] text-[#f0ede8]/42">
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

