import { useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import useLocalStorage from "../hooks/useLocalStorage";

function CalendarPage({ user, onLogout, onNavigate, activeMenu, sidebarOpen, setSidebarOpen, onSearch, searchQuery }) {
  const [tasks] = useLocalStorage("taskflow_tasks", []);
  const activeState = activeMenu || "Calendar";

  const upcoming = useMemo(() => {
    return tasks
      .filter((task) => task.deadline)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 6);
  }, [tasks]);

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
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">SCHEDULE</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Calendar</h1>
            <p className="mt-2 text-sm text-slate-600">Lihat jadwal tugas yang paling dekat dengan deadline.</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Upcoming Deadlines</h2>
                <span className="text-xs text-slate-600">{upcoming.length} agenda</span>
              </div>

              <div className="space-y-3">
                {upcoming.map((task) => (
                  <div key={task.id} className="rounded-xl border border-white/[0.05] bg-black/20 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{task.title}</p>
                        <p className="mt-1 text-xs text-slate-600">{task.project || "No Project"}</p>
                      </div>
                      <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] text-amber-400">
                        {task.deadline}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-br from-indigo-500/15 to-violet-500/10 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">Today</p>
              <h3 className="mt-3 text-3xl font-bold">{new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</h3>
              <p className="mt-3 text-sm text-slate-400">Fokus hari ini: pantau progress, selesaikan task penting, dan pastikan deadline aman.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CalendarPage;
