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
import InterviewsPage from "@/pages/InterviewsPage";
import IngestionPage from "@/pages/IngestionPage";
import ProfilePage from "@/pages/ProfilePage";
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
      <div className="flex min-h-screen items-center justify-center bg-[#080808]">
        <Loader2 className="h-8 w-8 animate-spin text-[#c8f04a]" />
      </div>
    );
  }

  if (!user) {
    setLocation("/auth");
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#080808] text-[#f0ede8]">
      <Navigation />
      <main className="flex-1 overflow-y-auto px-5 py-6 md:px-8 md:py-8">
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
      <Route path="/profile">
        <PrivateRoute component={ProfilePage} />
      </Route>
      <Route path="/ingestion">
        <PrivateRoute component={IngestionPage} />
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
      <Route path="/interviews">
        <PrivateRoute component={InterviewsPage} />
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
