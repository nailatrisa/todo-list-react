import { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import useLocalStorage from "../hooks/useLocalStorage";
import { createId } from "../utils/storage";
import ProjectSelector from "../components/ProjectSelector";

const initialTask = {
  title: "",
  description: "",
  project: "",
  assignee: "",
  deadline: "",
  priority: "Medium",
  status: "Todo",
};

function TaskManagement({
  user,
  onLogout,
  onNavigate,
  activeMenu,
  sidebarOpen,
  setSidebarOpen,
  onSearch,
  searchQuery,
}) {
  const [tasks, setTasks] = useLocalStorage(
    "taskflow_tasks",
    []
  );

  const [projects] = useLocalStorage(
    "taskflow_projects",
    []
  );

  const [selectedProject] = useLocalStorage("taskflow_selected_project", "");

  const [localSidebarOpen, setLocalSidebarOpen] = useState(false);
  const activeState = activeMenu || "Task Management";

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [priorityFilter, setPriorityFilter] =
    useState("All");

  const [showForm, setShowForm] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState(null);

  const [form, setForm] =
    useState(initialTask);

  /* =========================
     FORM CHANGE
  ========================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Judul task wajib diisi!");
      return;
    }

    if (editingTask) {
      setTasks((current) =>
        current.map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                ...form,
                updatedAt:
                  new Date().toISOString(),
              }
            : task
        )
      );
    } else {
      const newTask = {
        ...form,
        id: createId(),
        createdAt:
          new Date().toISOString(),
        updatedAt:
          new Date().toISOString(),
      };

      setTasks((current) => [
        newTask,
        ...current,
      ]);
    }

    setForm(initialTask);
    setEditingTask(null);
    setShowForm(false);
  };

  /* =========================
     EDIT
  ========================= */

  const handleEdit = (task) => {
    setEditingTask(task);

    setForm({
      title: task.title || "",
      description:
        task.description || "",
      project: task.project || "",
      assignee: task.assignee || "",
      deadline: task.deadline || "",
      priority:
        task.priority || "Medium",
      status:
        task.status || "Todo",
    });

    setShowForm(true);
  };

  /* =========================
     DELETE
  ========================= */

  const handleDelete = (id) => {
    const confirmed =
      window.confirm(
        "Apakah kamu yakin ingin menghapus task ini?"
      );

    if (!confirmed) return;

    setTasks((current) =>
      current.filter(
        (task) => task.id !== id
      )
    );
  };

  /* =========================
     FILTER
  ========================= */

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (selectedProject && task.project !== selectedProject) return false;
      const keyword =
        search.toLowerCase();

      const matchesSearch =
        task.title
          ?.toLowerCase()
          .includes(keyword) ||
        task.project
          ?.toLowerCase()
          .includes(keyword) ||
        task.assignee
          ?.toLowerCase()
          .includes(keyword);

      const matchesStatus =
        statusFilter === "All" ||
        task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        task.priority ===
          priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    tasks,
    search,
    statusFilter,
    priorityFilter,
  ]);

  /* =========================
     STATISTICS
  ========================= */

  const stats = useMemo(() => {
    const total = tasks.length;

    const completed = tasks.filter(
      (task) =>
        task.status === "Completed"
    ).length;

    const inProgress = tasks.filter(
      (task) =>
        task.status === "In Progress"
    ).length;

    const todo = tasks.filter(
      (task) => task.status === "Todo"
    ).length;

    const overdue = tasks.filter(
      (task) => {
        if (!task.deadline) return false;

        return (
          new Date(task.deadline) <
            new Date() &&
          task.status !== "Completed"
        );
      }
    ).length;

    return {
      total,
      completed,
      inProgress,
      todo,
      overdue,
    };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-[#080b16] text-white">

      <Sidebar
        user={user}
        activeMenu={activeState}
        setActiveMenu={onNavigate}
        open={sidebarOpen ?? localSidebarOpen}
        setOpen={setSidebarOpen || setLocalSidebarOpen}
        onLogout={onLogout}
        onNavigate={onNavigate}
      />

      <main className="min-h-screen lg:ml-[270px]">

        <Topbar
          user={user}
          activeMenu={activeState}
          onOpenSidebar={() => (setSidebarOpen ? setSidebarOpen(true) : setLocalSidebarOpen(true))}
          onToggleSidebar={() => (setSidebarOpen ? setSidebarOpen(true) : setLocalSidebarOpen(true))}
          onSearch={onSearch}
          searchQuery={searchQuery || ""}
          onLogout={onLogout}
        />

        <div className="mx-auto max-w-[1500px] p-5 sm:p-8">

          {/* HEADER */}

          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
                WORKSPACE
              </p>

              <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
                Task Management
              </h1>

              <p className="mt-2 text-sm text-slate-600">
                Kelola seluruh task,
                deadline, prioritas, dan
                anggota yang bertanggung
                jawab.
              </p>

            </div>

            <button
              onClick={() => {
                setEditingTask(null);
                setForm(initialTask);
                setShowForm(true);
              }}
              className="rounded-xl bg-indigo-600 px-5 py-3 text-xs font-semibold transition hover:bg-indigo-500"
            >
              + New Task
            </button>

          </div>

          <ProjectSelector projects={projects} />

          {/* STATISTICS */}

          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

            <StatCard
              label="TOTAL TASK"
              value={stats.total}
            />

            <StatCard
              label="COMPLETED"
              value={stats.completed}
            />

            <StatCard
              label="IN PROGRESS"
              value={stats.inProgress}
            />

            <StatCard
              label="WAITING"
              value={stats.todo}
            />

            <StatCard
              label="OVERDUE"
              value={stats.overdue}
            />

          </div>

          {/* FILTER */}

          <div className="mb-5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">

            <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px]">

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search task, project, assignee..."
                className="rounded-xl border border-white/[0.07] bg-black/20 px-4 py-3 text-xs text-white outline-none placeholder:text-slate-700 focus:border-indigo-500/50"
              />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="rounded-xl border border-white/[0.07] bg-[#101522] px-4 py-3 text-xs text-slate-400 outline-none"
              >
                <option value="All">
                  All Status
                </option>

                <option value="Todo">
                  Todo
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Completed">
                  Completed
                </option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(
                    e.target.value
                  )
                }
                className="rounded-xl border border-white/[0.07] bg-[#101522] px-4 py-3 text-xs text-slate-400 outline-none"
              >
                <option value="All">
                  All Priority
                </option>

                <option value="Low">
                  🔵 Low
                </option>

                <option value="Medium">
                  🟡 Medium
                </option>

                <option value="High">
                  🟠 High
                </option>

                <option value="Urgent">
                  🔴 Urgent
                </option>
              </select>

            </div>

          </div>

          {/* TASK LIST */}

          <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025]">

            <div className="hidden grid-cols-[2fr_1fr_130px_130px_120px] gap-4 border-b border-white/[0.06] px-5 py-4 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-700 lg:grid">

              <span>Task</span>
              <span>Project</span>
              <span>Priority</span>
              <span>Status</span>
              <span>Action</span>

            </div>

            {filteredTasks.length === 0 ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-xl text-indigo-400">
                  ◈
                </div>

                <h3 className="mt-4 text-sm font-semibold">
                  Belum ada task
                </h3>

                <p className="mt-2 text-xs text-slate-700">
                  Buat task baru untuk
                  memulai pekerjaan.
                </p>

              </div>
            ) : (
              filteredTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}

          </div>

        </div>

      </main>

      {/* MODAL */}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#0d1220] p-5 shadow-2xl sm:p-7">

            <div className="mb-6 flex justify-between">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
                  TASK
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  {editingTask
                    ? "Edit Task"
                    : "Create New Task"}
                </h2>
              </div>

              <button
                onClick={() =>
                  setShowForm(false)
                }
                className="text-xl text-slate-600 hover:text-white"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              <Input
                label="Task Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Contoh: Membuat Homepage"
              />

              <div>
                <label className="mb-2 block text-xs text-slate-400">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Deskripsi task..."
                  className="w-full resize-none rounded-xl border border-white/[0.07] bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-indigo-500/50"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <Select
                  label="Project"
                  name="project"
                  value={form.project}
                  onChange={handleChange}
                  options={[
                    "",
                    ...projects.map(
                      (project) =>
                        project.name
                    ),
                  ]}
                />

                <Input
                  label="Assignee"
                  name="assignee"
                  value={form.assignee}
                  onChange={handleChange}
                  placeholder="Nama anggota"
                />

              </div>

              <div className="grid gap-4 sm:grid-cols-3">

                <Input
                  label="Deadline"
                  name="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={handleChange}
                />

                <Select
                  label="Priority"
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  options={[
                    "Low",
                    "Medium",
                    "High",
                    "Urgent",
                  ]}
                />

                <Select
                  label="Status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  options={[
                    "Todo",
                    "In Progress",
                    "Completed",
                  ]}
                />

              </div>

              <div className="flex justify-end gap-2 pt-4">

                <button
                  type="button"
                  onClick={() =>
                    setShowForm(false)
                  }
                  className="rounded-xl border border-white/[0.07] px-5 py-3 text-xs text-slate-400"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-xs font-semibold hover:bg-indigo-500"
                >
                  {editingTask
                    ? "Save Changes"
                    : "Create Task"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

/* =========================
   TASK ROW
========================= */

function TaskRow({
  task,
  onEdit,
  onDelete,
}) {
  return (
    <div className="border-b border-white/[0.05] px-5 py-4 transition hover:bg-white/[0.02]">

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr_130px_130px_120px] lg:items-center">

        <div>
          <h3 className="text-xs font-semibold text-white">
            {task.title}
          </h3>

          <p className="mt-1 line-clamp-1 text-[10px] text-slate-700">
            {task.description ||
              "Tidak ada deskripsi"}
          </p>

          <div className="mt-2 text-[9px] text-slate-600">
            {task.assignee
              ? `Assigned to ${task.assignee}`
              : "Unassigned"}

            {task.deadline &&
              ` · ${formatDate(
                task.deadline
              )}`}
          </div>
        </div>

        <div className="text-xs text-slate-500">
          {task.project || "No Project"}
        </div>

        <PriorityBadge
          priority={task.priority}
        />

        <StatusBadge
          status={task.status}
        />

        <div className="flex gap-1">

          <button
            onClick={() => onEdit(task)}
            className="rounded-lg px-3 py-2 text-[10px] text-slate-600 hover:bg-indigo-500/10 hover:text-indigo-400"
          >
            Edit
          </button>

          <button
            onClick={() =>
              onDelete(task.id)
            }
            className="rounded-lg px-3 py-2 text-[10px] text-slate-600 hover:bg-red-500/10 hover:text-red-400"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}

/* =========================
   COMPONENTS
========================= */

function StatCard({
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">

      <p className="text-[9px] font-bold tracking-[0.15em] text-slate-600">
        {label}
      </p>

      <p className="mt-4 text-2xl font-bold">
        {value}
      </p>

    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>

      <label className="mb-2 block text-xs text-slate-400">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/[0.07] bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-indigo-500/50"
      />

    </div>
  );
}

function Select({
  label,
  name,
  value,
  onChange,
  options,
}) {
  return (
    <div>

      <label className="mb-2 block text-xs text-slate-400">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-white/[0.07] bg-[#101522] px-4 py-3 text-sm text-slate-300 outline-none focus:border-indigo-500/50"
      >
        {options.map((option) => (
          <option
            key={option || "none"}
            value={option}
          >
            {option || "No Project"}
          </option>
        ))}
      </select>

    </div>
  );
}

function PriorityBadge({
  priority,
}) {
  const config = {
    Low: "🔵 Low",
    Medium: "🟡 Medium",
    High: "🟠 High",
    Urgent: "🔴 Urgent",
  };

  return (
    <span className="text-[10px] font-medium">
      {config[priority] || "🟡 Medium"}
    </span>
  );
}

function StatusBadge({
  status,
}) {
  const styles = {
    Todo:
      "bg-slate-500/10 text-slate-400",
    "In Progress":
      "bg-indigo-500/10 text-indigo-400",
    Completed:
      "bg-emerald-500/10 text-emerald-400",
  };

  return (
    <span
      className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[9px] font-bold ${
        styles[status] ||
        styles.Todo
      }`}
    >
      {status}
    </span>
  );
}

function formatDate(date) {
  return new Intl.DateTimeFormat(
    "id-ID",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(new Date(date));
}

export default TaskManagement;