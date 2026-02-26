import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { TrendingUp, Lock, Clock } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-50 flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-violet-600/90 flex items-center justify-center shadow-lg shadow-violet-600/50">
              <div className="h-5 w-5 rounded-md bg-slate-950 flex items-center justify-center text-[10px] font-bold tracking-tight text-violet-300">
                PM
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-lg font-bold tracking-tight">PlacementMaster</div>
              <div className="text-[10px] text-slate-400">Campus Placement Console</div>
            </div>
          </div>
          <div className="space-x-3 flex items-center">
            <Link href="/auth">
              <Button
                variant="ghost"
                className="text-slate-300 hover:text-white hover:bg-slate-800/50"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/40">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center max-w-7xl mx-auto w-full px-6 py-20 md:py-32">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-violet-400 uppercase tracking-widest mb-4">Welcome to PlacementMaster</p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Match talent with <span className="bg-gradient-to-r from-violet-500 to-purple-400 bg-clip-text text-transparent">purpose.</span>
          </h1>
          <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-2xl">
            PlacementMaster powers structured campus placements. Students reach employers. Employers find talent. Built for universities that mean business.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link href="/auth?role=student">
              <Button className="w-full sm:w-auto bg-violet-600 hover:bg-violet-500 text-white px-8 py-3 text-base font-semibold shadow-lg shadow-violet-600/40 transition-all">
                I'm a Student
              </Button>
            </Link>
            <Link href="/auth?role=employer">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-slate-700 text-slate-100 hover:border-violet-500/60 hover:text-white hover:bg-slate-800/40 px-8 py-3 text-base font-semibold"
              >
                I'm an Employer
              </Button>
            </Link>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-8 border-t border-slate-700/50 pt-10">
            <div>
              <div className="text-3xl font-bold text-white mb-2">1200+</div>
              <div className="text-xs text-slate-400 uppercase tracking-wide font-medium">Active Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">85%</div>
              <div className="text-xs text-slate-400 uppercase tracking-wide font-medium">Placement Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-xs text-slate-400 uppercase tracking-wide font-medium">Recruiting Partners</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-slate-800 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900/80">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Built for placement that works.
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl">
              Everything you need to manage campus placements efficiently and at scale.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 hover:border-violet-500/30 p-8 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/30 to-violet-500/10 flex items-center justify-center mb-6 group-hover:from-violet-600/40 group-hover:to-violet-500/20 transition-all">
                <TrendingUp className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Full Visibility</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Every step tracked in real-time. No surprises, no bottlenecks, and complete transparency for stakeholders.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 hover:border-emerald-500/30 p-8 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600/30 to-emerald-500/10 flex items-center justify-center mb-6 group-hover:from-emerald-600/40 group-hover:to-emerald-500/20 transition-all">
                <Lock className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Enterprise Security</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Modern security standards and role-based controls keep student, recruiter, and institutional data protected.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 hover:border-blue-500/30 p-8 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/30 to-blue-500/10 flex items-center justify-center mb-6 group-hover:from-blue-600/40 group-hover:to-blue-500/20 transition-all">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Your Systems First</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Works alongside your existing workflows and policies, keeping compliance and governance at the center.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Ready to transform your placements?
          </h2>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
            Leading universities and employers rely on PlacementMaster to execute campus placements at scale and with confidence.
          </p>
          <Link href="/auth">
            <Button className="bg-violet-600 hover:bg-violet-500 text-white px-10 py-3 text-base font-semibold shadow-lg shadow-violet-600/40 transition-all">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
