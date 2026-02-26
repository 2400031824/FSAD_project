import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import AuthPage from "@/pages/AuthPage";
import Dashboard from "@/pages/Dashboard";
import JobsPage from "@/pages/JobsPage";
import StudentsPage from "@/pages/StudentsPage";
import RecruitersPage from "@/pages/RecruitersPage";
import DrivesPage from "@/pages/DrivesPage";
import ReportsPage from "@/pages/ReportsPage";
import SettingsPage from "@/pages/SettingsPage";
import { Navigation } from "@/components/Navigation";
import { useUser } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

function PrivateRoute({
  component: Component,
}: {
  component: React.ComponentType;
}) {
  const { data: user, isLoading } = useUser();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (!user) {
    setLocation("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 flex">
      <Navigation />
      <main className="flex-1 px-8 py-8 overflow-y-auto">
        <Component />
      </main>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />

      {/* Protected Routes */}
      <Route path="/dashboard">
        <PrivateRoute component={Dashboard} />
      </Route>
      <Route path="/jobs">
        <PrivateRoute component={JobsPage} />
      </Route>
      <Route path="/students">
        <PrivateRoute component={StudentsPage} />
      </Route>
      <Route path="/recruiters">
        <PrivateRoute component={RecruitersPage} />
      </Route>
      <Route path="/drives">
        <PrivateRoute component={DrivesPage} />
      </Route>
      <Route path="/reports">
        <PrivateRoute component={ReportsPage} />
      </Route>
      <Route path="/settings">
        <PrivateRoute component={SettingsPage} />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
