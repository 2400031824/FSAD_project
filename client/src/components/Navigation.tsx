import { Link, useLocation } from "wouter";
import { useUser, useLogout } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CalendarDays,
  BarChart3,
  Settings2,
  LogOut,
} from "lucide-react";

export function Navigation() {
  const { data: user } = useUser();
  const { mutate: logout } = useLogout();
  const [location] = useLocation();

  if (!user) return null;

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Students", href: "/students", icon: Users },
    { label: "Recruiters", href: "/recruiters", icon: Briefcase },
    { label: "Drives", href: "/drives", icon: CalendarDays },
    { label: "Reports", href: "/reports", icon: BarChart3 },
    { label: "Settings", href: "/settings", icon: Settings2 },
  ];

  const initials =
    user.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("") || user.username.charAt(0).toUpperCase();

  return (
    <aside className="hidden md:flex w-64 xl:w-72 flex-col border-r border-slate-800 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900/80">
      {/* Brand / User */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-violet-600/80 flex items-center justify-center shadow-lg shadow-violet-600/40">
            <div className="h-5 w-5 rounded-md bg-slate-950 flex items-center justify-center text-xs font-semibold text-violet-400">
              PM
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide">
              PlacementMaster
            </p>
            <p className="text-[11px] text-slate-400">
              Campus Placement Console
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-slate-900/80 border border-slate-800 px-3 py-3">
          <div className="h-9 w-9 rounded-full bg-violet-500/90 flex items-center justify-center text-sm font-semibold">
            {initials}
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium leading-tight">
              {user.name || user.username}
            </p>
            <p className="text-[11px] text-slate-400 capitalize">
              {user.role || "Placement Officer"}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm transition-colors ${
                  isActive
                    ? "bg-violet-600 text-white shadow-[0_0_20px_rgba(129,140,248,0.45)]"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-white" : "text-slate-400 group-hover:text-violet-300"
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 pb-6 pt-2 border-t border-slate-800">
        <button
          onClick={() => logout()}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:border-violet-500/70 hover:text-white transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
        <p className="mt-3 text-[10px] text-slate-500 text-center">
          Authorized Personnel Only
        </p>
      </div>
    </aside>
  );
}
