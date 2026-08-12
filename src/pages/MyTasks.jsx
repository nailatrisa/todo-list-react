import { useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import useLocalStorage from "../hooks/useLocalStorage";
import { STORAGE_KEYS } from "../utils/storage";

function MyTasks({ user, onLogout, onNavigate, activeMenu, sidebarOpen, setSidebarOpen, onSearch, searchQuery }) {
  const [todos] = useLocalStorage(STORAGE_KEYS.TODOS, []);
  const [tasks] = useLocalStorage("taskflow_tasks", []);
  const activeState = activeMenu || "My Tasks";

  const assignedTasks = useMemo(() => {
    const currentName = (user?.name || "").toLowerCase();

    return tasks.filter((task) => {
      const assignee = (task.assignee || "").toLowerCase();
      return assignee.includes(currentName) || currentName.includes(assignee);
    });
  }, [tasks, user?.name]);

  const pendingTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  const stats = [
    { title: "Assigned Tasks", value: assignedTasks.length, icon: "▣" },
    { title: "Pending", value: pendingTodos.length, icon: "◷" },
    { title: "Completed", value: completedTodos.length, icon: "✓" },
  ];

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
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
              MY WORK
            </p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">My Tasks</h1>
            <p className="mt-2 text-sm text-slate-600">
              Ringkasan tugas yang relevan dengan Anda hari ini.
            </p>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.title} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                    {stat.title}
                  </p>
                  <span className="text-indigo-400">{stat.icon}</span>
                </div>
                <p className="mt-4 text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Assigned Tasks</h2>
                <span className="text-xs text-slate-600">{assignedTasks.length} items</span>
              </div>

              {assignedTasks.length === 0 ? (
                <p className="text-sm text-slate-600">Belum ada tugas yang ditugaskan ke Anda.</p>
              ) : (
                <div className="space-y-3">
                  {assignedTasks.map((task) => (
                    <div key={task.id} className="rounded-xl border border-white/[0.05] bg-black/20 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">{task.title}</p>
                          <p className="mt-1 text-xs text-slate-600">{task.project || "No Project"}</p>
                        </div>
                        <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-[10px] text-indigo-400">
                          {task.priority || "Medium"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Todo Queue</h2>
                <span className="text-xs text-slate-600">{pendingTodos.length} pending</span>
              </div>

              <div className="space-y-3">
                {pendingTodos.length === 0 ? (
                  <p className="text-sm text-slate-600">Tidak ada todo yang tertunda.</p>
                ) : (
                  pendingTodos.map((todo) => (
                    <div key={todo.id} className="rounded-xl border border-white/[0.05] bg-black/20 p-4">
                      <p className="text-sm font-semibold text-white">{todo.title}</p>
                      <p className="mt-1 text-xs text-slate-600">
                        {todo.deadline ? `Deadline: ${todo.deadline}` : "Tanpa deadline"}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MyTasks;