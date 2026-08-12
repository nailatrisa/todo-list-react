import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import useLocalStorage from "../hooks/useLocalStorage";
import { STORAGE_KEYS } from "../utils/storage";

function Dashboard({ user, onLogout, onNavigate, activeMenu, sidebarOpen, setSidebarOpen, onSearch, searchQuery }) {
  const [todos] = useLocalStorage(STORAGE_KEYS.TODOS, []);

  const total = todos.length;

  const completed = todos.filter(
    (todo) => todo.completed
  ).length;

  const inProgress = todos.filter(
    (todo) => !todo.completed
  ).length;

  const overdue = todos.filter((todo) => {
    if (!todo.deadline || todo.completed) return false;

    return new Date(todo.deadline) < new Date();
  }).length;

  const progress =
    total > 0
      ? Math.round((completed / total) * 100)
      : 0;

  const stats = [
    {
      title: "TOTAL TASK",
      value: total,
      icon: "▦",
      description: "Semua pekerjaan",
      className: "text-indigo-400",
    },
    {
      title: "COMPLETED",
      value: completed,
      icon: "✓",
      description: "Task selesai",
      className: "text-emerald-400",
    },
    {
      title: "IN PROGRESS",
      value: inProgress,
      icon: "◷",
      description: "Sedang dikerjakan",
      className: "text-amber-400",
    },
    {
      title: "OVERDUE",
      value: overdue,
      icon: "!",
      description: "Melewati deadline",
      className: "text-red-400",
    },
  ];

  return (
    <div className="min-h-screen bg-[#080b16] text-white">

      <Sidebar
        user={user}
        activeMenu={activeMenu}
        setActiveMenu={onNavigate}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        onLogout={onLogout}
        onNavigate={onNavigate}
      />

      <div className="lg:ml-[270px]">

        <Topbar
          user={user}
          activeMenu={activeMenu}
          onOpenSidebar={() => setSidebarOpen(true)}
          onToggleSidebar={() => setSidebarOpen(true)}
          onSearch={onSearch}
          searchQuery={searchQuery || ""}
          onLogout={onLogout}
        />

        <main className="p-4 sm:p-6 lg:p-8">

          {/* HEADER */}

          <div className="mb-8">

            <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-400">
              Overview
            </p>

            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Good morning, {user?.name || "User"} 👋
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Here's what's happening with your workspace today.
            </p>

          </div>

          {/* STATS */}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {stats.map((stat) => (

              <div
                key={stat.title}
                className="group rounded-2xl border border-white/[0.07] bg-[#0d1220] p-5 transition duration-300 hover:-translate-y-1 hover:border-indigo-500/20"
              >

                <div className="flex items-center justify-between">

                  <span className="text-[10px] font-bold tracking-[0.15em] text-slate-600">
                    {stat.title}
                  </span>

                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-sm font-bold ${stat.className}`}
                  >
                    {stat.icon}
                  </span>

                </div>

                <div className="mt-5">

                  <p className="text-3xl font-bold">
                    {stat.value}
                  </p>

                  <p className="mt-2 text-xs text-slate-600">
                    {stat.description}
                  </p>

                </div>

              </div>

            ))}

          </div>

          {/* MAIN GRID */}

          <div className="mt-6 grid gap-6 xl:grid-cols-3">

            {/* PROJECT PROGRESS */}

            <div className="rounded-2xl border border-white/[0.07] bg-[#0d1220] p-6 xl:col-span-2">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-bold text-slate-300">
                    Project Progress
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Overall task completion
                  </p>

                </div>

                <span className="text-2xl font-bold text-indigo-400">
                  {progress}%
                </span>

              </div>

              <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/[0.05]">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">

                <ProgressItem
                  label="Completed"
                  value={completed}
                  className="text-emerald-400"
                />

                <ProgressItem
                  label="In Progress"
                  value={inProgress}
                  className="text-amber-400"
                />

                <ProgressItem
                  label="Overdue"
                  value={overdue}
                  className="text-red-400"
                />

              </div>

            </div>

            {/* TASK DISTRIBUTION */}

            <div className="rounded-2xl border border-white/[0.07] bg-[#0d1220] p-6">

              <p className="text-xs font-bold text-slate-300">
                Task Distribution
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Current workload
              </p>

              <div className="mt-6 space-y-5">

                <Distribution
                  label="Completed"
                  value={completed}
                  total={total}
                  className="bg-emerald-400"
                />

                <Distribution
                  label="In Progress"
                  value={inProgress}
                  total={total}
                  className="bg-amber-400"
                />

                <Distribution
                  label="Overdue"
                  value={overdue}
                  total={total}
                  className="bg-red-400"
                />

              </div>

            </div>

          </div>

          {/* QUICK ACTIONS */}

          <div className="mt-6 rounded-2xl border border-white/[0.07] bg-[#0d1220] p-6">

            <div className="mb-5">

              <p className="text-xs font-bold text-slate-300">
                Quick Actions
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Manage your workspace
              </p>

            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

              <ActionButton
                icon="+"
                title="Create Todo"
                onClick={() => onNavigate("Todo")}
              />

              <ActionButton
                icon="✓"
                title="My Tasks"
                onClick={() => onNavigate("My Tasks")}
              />

              <ActionButton
                icon="◈"
                title="Task Management"
                onClick={() =>
                  onNavigate("Task Management")
                }
              />

              <ActionButton
                icon="▦"
                title="Projects"
                onClick={() =>
                  onNavigate("Project Management")
                }
              />

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

function ProgressItem({
  label,
  value,
  className,
}) {
  return (
    <div>

      <p className="text-[10px] uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className={`mt-1 text-xl font-bold ${className}`}>
        {value}
      </p>

    </div>
  );
}

function Distribution({
  label,
  value,
  total,
  className,
}) {
  const percentage =
    total > 0
      ? Math.round((value / total) * 100)
      : 0;

  return (
    <div>

      <div className="mb-2 flex justify-between">

        <span className="text-xs text-slate-500">
          {label}
        </span>

        <span className="text-xs font-semibold text-slate-300">
          {value}
        </span>

      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">

        <div
          className={`h-full rounded-full ${className}`}
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}

function ActionButton({
  icon,
  title,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left transition hover:border-indigo-500/30 hover:bg-indigo-500/[0.06]"
    >

      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
        {icon}
      </span>

      <span className="text-xs font-semibold text-slate-300">
        {title}
      </span>

    </button>
  );
}

export default Dashboard;