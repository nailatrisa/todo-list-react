import { useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import useLocalStorage from "../hooks/useLocalStorage";

function Milestone({ user, onLogout, onNavigate, activeMenu, sidebarOpen, setSidebarOpen, onSearch, searchQuery }) {
  const [todos] = useLocalStorage("taskflow_todos", []);
  const [tasks] = useLocalStorage("taskflow_tasks", []);
  const activeState = activeMenu || "Milestone";

  const summary = useMemo(() => {
    const allTasks = [...todos, ...tasks];
    const completed = allTasks.filter((item) => item.completed || item.status === "Completed").length;
    const total = allTasks.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, remaining: total - completed, progress };
  }, [todos, tasks]);

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

        <div className="mx-auto max-w-[1500px] p-5 sm:p-8">
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">MILESTONE</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Milestone</h1>
            <p className="mt-2 text-sm text-slate-600">Pantau target utama dan progres pencapaian project Anda.</p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs text-slate-600">Current Milestone</p>
                <h2 className="mt-2 text-xl font-semibold">Project Planning Sprint</h2>
              </div>
              <span className="rounded-full bg-indigo-500/10 px-3 py-1.5 text-sm font-bold text-indigo-400">
                {summary.progress}%
              </span>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex justify-between text-xs text-slate-600">
                <span>Progress</span>
                <span>{summary.completed} / {summary.total} items</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
                <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${summary.progress}%` }} />
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Metric label="Total" value={summary.total} />
              <Metric label="Completed" value={summary.completed} tone="emerald" />
              <Metric label="Remaining" value={summary.remaining} tone="amber" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Metric({ label, value, tone = "slate" }) {
  const toneClass = {
    slate: "text-white",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
  }[tone];

  return (
    <div className="rounded-xl border border-white/[0.05] bg-black/20 p-4">
      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">{label}</p>
      <p className={`mt-2 text-xl font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}

export default Milestone;