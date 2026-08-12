import { useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import useLocalStorage from "../hooks/useLocalStorage";

function TeamManagement({ user, onLogout, onNavigate, activeMenu, sidebarOpen, setSidebarOpen, onSearch, searchQuery }) {
  const [tasks] = useLocalStorage("taskflow_tasks", []);
  const activeState = activeMenu || "Team Management";

  const teamMembers = useMemo(() => {
    const members = [
      { name: "Alya", role: "Product Lead", focus: "Strategy" },
      { name: "Rian", role: "Developer", focus: "Frontend" },
      { name: "Nadia", role: "Designer", focus: "UI/UX" },
      { name: "Doni", role: "QA", focus: "Testing" },
    ];

    return members.map((member) => ({
      ...member,
      workload: tasks.filter((task) => (task.assignee || "").toLowerCase() === member.name.toLowerCase()).length,
    }));
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

        <div className="mx-auto max-w-[1500px] p-5 sm:p-8">
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">TEAM</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Team Management</h1>
            <p className="mt-2 text-sm text-slate-600">Pantau pembagian pekerjaan dan beban kerja tim secara jelas.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {teamMembers.map((member) => (
              <div key={member.name} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-sm font-bold text-indigo-400">
                    {member.name.charAt(0)}
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] text-emerald-400">
                    {member.workload} tasks
                  </span>
                </div>
                <h2 className="mt-4 text-base font-semibold">{member.name}</h2>
                <p className="mt-1 text-xs text-slate-600">{member.role}</p>
                <p className="mt-3 text-xs text-slate-500">Focus: {member.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default TeamManagement;