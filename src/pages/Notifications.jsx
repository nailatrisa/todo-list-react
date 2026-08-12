import { useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import useLocalStorage from "../hooks/useLocalStorage";

function Notifications({ user, onLogout, onNavigate, activeMenu, sidebarOpen, setSidebarOpen, onSearch, searchQuery }) {
  const [tasks] = useLocalStorage("taskflow_tasks", []);
  const activeState = activeMenu || "Notifications";

  const alerts = useMemo(() => {
    return [
      { id: 1, title: "Deadline mendekati", detail: "3 task akan jatuh tempo dalam 2 hari." },
      { id: 2, title: "Review proyek", detail: `${tasks.filter((task) => task.status === "In Progress").length} task sedang berjalan.` },
      { id: 3, title: "Pekerjaan siap ditinjau", detail: "Cek task yang telah selesai dan siapkan approval." },
    ];
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

        <div className="mx-auto max-w-[1200px] p-5 sm:p-8">
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">ALERTS</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Notifications</h1>
            <p className="mt-2 text-sm text-slate-600">Pantau notifikasi penting untuk mencegah keterlambatan kerja.</p>
          </div>

          <div className="space-y-3">
            {alerts.map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
                  </div>
                  <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-[10px] text-indigo-400">New</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Notifications;
