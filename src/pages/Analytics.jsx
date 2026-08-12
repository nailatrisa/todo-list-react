import { useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import useLocalStorage from "../hooks/useLocalStorage";

function Analytics({ user, onLogout, onNavigate, activeMenu, sidebarOpen, setSidebarOpen, onSearch, searchQuery }) {
  const [todos] = useLocalStorage("taskflow_todos", []);
  const [tasks] = useLocalStorage("taskflow_tasks", []);
  const activeState = activeMenu || "Analytics";

  const analytics = useMemo(() => {
    const total = todos.length + tasks.length;
    const completed = [...todos, ...tasks].filter((item) => item.completed || item.status === "Completed").length;
    const pending = total - completed;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, progress };
  }, [tasks, todos]);

  return (
    <div className="min-h-screen bg-[#080b16] text-white">
      <Sidebar
        user={user}
        activeMenu={activeState}
        setActiveMenu={onNavigate}
        open={sidebarOpen ?? false}
        setOpen={setSidebarOpen}
        onLogout={onLogout}
        onNavigate={onNavigate}
      />

      <main className="min-h-screen lg:ml-[270px]">
        <Topbar
          user={user}
          activeMenu={activeState}
          onOpenSidebar={() => setSidebarOpen(true)}
          onToggleSidebar={() => setSidebarOpen(true)}
          onSearch={onSearch}
          searchQuery={searchQuery || ""}
          onLogout={onLogout}
        />

        <div className="mx-auto max-w-[1400px] p-5 sm:p-8">
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">REPORT</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Analytics & Report</h1>
            <p className="mt-2 text-sm text-slate-600">Pantau performa pekerjaan dan progress tim dalam satu tampilan yang ringkas.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard label="Total Items" value={analytics.total} tone="indigo" />
            <MetricCard label="Completed" value={analytics.completed} tone="emerald" />
            <MetricCard label="Pending" value={analytics.pending} tone="amber" />
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Performance Overview</h2>
                <span className="text-sm font-semibold text-indigo-400">{analytics.progress}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/[0.05]">
                <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${analytics.progress}%` }} />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <SummaryBox title="Productivity" value="High" />
                <SummaryBox title="Deadline Status" value="On Track" />
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-br from-indigo-500/15 to-violet-500/10 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">Insight</p>
              <h3 className="mt-3 text-xl font-semibold">Tim Anda bekerja dengan konsistensi yang baik.</h3>
              <p className="mt-3 text-sm text-slate-400">Analitik ini membantu melihat apakah target selesai tepat waktu atau butuh perhatian lebih.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ label, value, tone }) {
  const toneClass = {
    indigo: "text-indigo-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
  }[tone];

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">{label}</p>
      <p className={`mt-4 text-2xl font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}

function SummaryBox({ title, value }) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-black/20 p-4">
      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">{title}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

export default Analytics;
