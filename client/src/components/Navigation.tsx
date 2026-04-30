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
  Video,
  Workflow,
  UserRound,
} from "lucide-react";

export function Navigation() {
  const { data: user } = useUser();
  const { mutate: logout } = useLogout();
  const [location] = useLocation();

  if (!user) return null;

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Profile", href: "/profile", icon: UserRound },
    ...(user.role === "student"
      ? [
          { label: "Roles", href: "/jobs", icon: Briefcase },
          { label: "Interviews", href: "/interviews", icon: Video },
          { label: "Reports", href: "/reports", icon: BarChart3 },
        ]
      : user.role === "employer"
        ? [
            { label: "Openings", href: "/jobs", icon: Briefcase },
            { label: "Interviews", href: "/interviews", icon: Video },
            { label: "Reports", href: "/reports", icon: BarChart3 },
          ]
        : [
            { label: "System Layers", href: "/ingestion", icon: Workflow },
            { label: "Students", href: "/students", icon: Users },
            { label: "Recruiters", href: "/recruiters", icon: Briefcase },
            { label: "Drives", href: "/drives", icon: CalendarDays },
            { label: "Interviews", href: "/interviews", icon: Video },
            { label: "Reports", href: "/reports", icon: BarChart3 },
          ]),
    { label: "Settings", href: "/settings", icon: Settings2 },
  ];

  const initials =
    user.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("") || user.username.charAt(0).toUpperCase();

  return (
    <aside className="hidden w-64 flex-col border-r border-white/[0.08] bg-[#080808]/95 backdrop-blur md:flex xl:w-72">
      {/* Brand / User */}
      <div className="border-b border-white/[0.08] px-6 pb-5 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center border border-[#c8f04a]/50 bg-[#c8f04a] shadow-[0_0_24px_rgba(200,240,74,0.2)]">
            <div className="flex h-5 w-5 items-center justify-center bg-[#080808] text-xs font-bold text-[#c8f04a]">
              PM
            </div>
          </div>
          <div>
            <p className="text-sm font-extrabold tracking-tight text-[#f0ede8]">
              PlacementMaster
            </p>
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.12em] text-[#f0ede8]/40">
              Campus Placement Console
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 border border-white/[0.08] bg-[#0e0e0e] px-3 py-3">
          <div className="flex h-9 w-9 items-center justify-center bg-[#141414] text-sm font-bold text-[#c8f04a]">
            {initials}
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold leading-tight text-[#f0ede8]">
              {user.name || user.username}
            </p>
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.1em] text-[#f0ede8]/40">
              {user.role || "Placement Officer"}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`group flex cursor-pointer items-center gap-3 px-3 py-2.5 font-mono-ui text-[0.72rem] uppercase tracking-[0.08em] transition-colors ${
                  isActive
                    ? "bg-[#c8f04a] text-[#080808] shadow-[0_0_24px_rgba(200,240,74,0.18)]"
                    : "text-[#f0ede8]/50 hover:bg-[#141414] hover:text-[#f0ede8]"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-[#080808]" : "text-[#f0ede8]/35 group-hover:text-[#c8f04a]"
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/[0.08] px-4 pb-6 pt-4">
        <button
          onClick={() => logout()}
          className="inline-flex w-full items-center justify-center gap-2 border border-white/[0.08] bg-[#0e0e0e] px-3 py-2 font-mono-ui text-[0.7rem] uppercase tracking-[0.1em] text-[#f0ede8]/70 transition-colors hover:border-[#c8f04a]/60 hover:text-[#f0ede8]"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
        <p className="font-mono-ui mt-3 text-center text-[10px] uppercase tracking-[0.12em] text-[#f0ede8]/30">
          Authorized Personnel Only
        </p>
      </div>
    </aside>
  );
}
