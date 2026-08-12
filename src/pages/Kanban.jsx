import { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import useLocalStorage from "../hooks/useLocalStorage";

const columns = ["Todo", "In Progress", "Completed"];

function Kanban({ user, onLogout, onNavigate, activeMenu, sidebarOpen, setSidebarOpen, onSearch, searchQuery }) {
  const [tasks, setTasks] = useLocalStorage("taskflow_tasks", []);
  const activeState = activeMenu || "Kanban Board";
  const [draggedId, setDraggedId] = useState(null);

  const groupedTasks = useMemo(() => {
    return columns.reduce((acc, column) => {
      acc[column] = tasks.filter((task) => task.status === column);
      return acc;
    }, {});
  }, [tasks]);

  const onDrop = (status) => {
    if (!draggedId) return;

    setTasks((current) =>
      current.map((task) =>
        task.id === draggedId ? { ...task, status } : task
      )
    );
    setDraggedId(null);
  };

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

        <div className="mx-auto max-w-[1600px] p-5 sm:p-8">
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
              WORKFLOW
            </p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Kanban Board</h1>
            <p className="mt-2 text-sm text-slate-600">
              Seret task antar kolom untuk mengatur prioritas dan progres kerja.
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {columns.map((column) => (
              <div
                key={column}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(column)}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-semibold">{column}</h2>
                  <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-[10px] text-indigo-400">
                    {groupedTasks[column].length}
                  </span>
                </div>

                <div className="space-y-3">
                  {groupedTasks[column].length === 0 ? (
                    <div className="rounded-xl border border-dashed border-white/[0.08] p-4 text-center text-xs text-slate-600">
                      Tidak ada task di kolom ini.
                    </div>
                  ) : (
                    groupedTasks[column].map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={() => setDraggedId(task.id)}
                        className="rounded-xl border border-white/[0.05] bg-black/20 p-4 shadow-sm"
                      >
                        <p className="text-sm font-semibold text-white">{task.title}</p>
                        <p className="mt-1 text-xs text-slate-600">
                          {task.project || "No project"}
                        </p>
                        <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
                          <span>{task.assignee || "Unassigned"}</span>
                          <span>{task.priority || "Medium"}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Kanban;
