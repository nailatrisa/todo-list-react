import { useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import useLocalStorage from "../hooks/useLocalStorage";
import { createId } from "../utils/storage";

// =========================
// DEFAULT DATA
// =========================
const DEFAULT_TEAMS = [
  { id: "team-1", name: "Engineering" },
  { id: "team-2", name: "Marketing" },
  { id: "team-3", name: "Sales" },
  { id: "team-4", name: "Design" },
];

const emptyTodo = {
  title: "",
  description: "",
  deadline: "",
  priority: "Medium",
  projectId: "",
  teamId: "",
  type: "personal", // "personal" atau "team"
  completed: false,
};

function Todo({
  user,
  onLogout,
  onNavigate,
  activeMenu,
  sidebarOpen,
  setSidebarOpen,
  onSearch,
  searchQuery,
}) {
  const [todos, setTodos] = useLocalStorage("taskflow_todos", []);
  const [projects] = useLocalStorage("taskflow_projects", []);
  const [teams] = useLocalStorage("taskflow_teams", DEFAULT_TEAMS);

  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [form, setForm] = useState(emptyTodo);
  const [search, setSearch] = useState("");

  const activeState = activeMenu || "Todo";

  // =========================
  // FILTER TODOS
  // =========================
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) =>
      todo.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [todos, search]);

  // =========================
  // HANDLE FORM CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // =========================
  // HANDLE TYPE CHANGE (Personal / Team)
  // =========================
  const handleTypeChange = (type) => {
    setForm((prev) => ({
      ...prev,
      type,
      teamId: "", // reset teamId
      projectId: "", // reset projectId
    }));
  };

  // =========================
  // HANDLE SUBMIT
  // =========================
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Judul task wajib diisi.");
      return;
    }

    const newTodo = {
      ...form,
      projectId: form.projectId || "",
      teamId: form.teamId || "",
    };

    if (editingTodo) {
      setTodos((current) =>
        current.map((todo) =>
          todo.id === editingTodo.id ? { ...todo, ...newTodo } : todo
        )
      );
    } else {
      setTodos((current) => [
        { ...newTodo, id: createId(), createdAt: new Date().toISOString() },
        ...current,
      ]);
    }

    closeForm();
  };

  // =========================
  // OPEN / CLOSE FORM
  // =========================
  const openCreateForm = () => {
    setEditingTodo(null);
    setForm(emptyTodo);
    setShowForm(true);
  };

  const openEditForm = (todo) => {
    setEditingTodo(todo);
    setForm({
      title: todo.title || "",
      description: todo.description || "",
      deadline: todo.deadline || "",
      priority: todo.priority || "Medium",
      projectId: todo.projectId || "",
      teamId: todo.teamId || "",
      type: todo.type || "personal",
      completed: todo.completed || false,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTodo(null);
    setForm(emptyTodo);
  };

  // =========================
  // TOGGLE COMPLETED
  // =========================
  const toggleCompleted = (id) => {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    if (!window.confirm("Hapus task ini?")) return;
    setTodos((current) => current.filter((todo) => todo.id !== id));
  };

  // =========================
  // GET PROJECTS BY TYPE
  // =========================
  const getAvailableProjects = () => {
    if (form.type === "personal") {
      // Project personal: teamId kosong
      return projects.filter((p) => !p.teamId);
    } else {
      // Project team: teamId sesuai dengan form.teamId
      if (!form.teamId) return [];
      return projects.filter((p) => p.teamId === form.teamId);
    }
  };

  // =========================
  // RENDER
  // =========================
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
          {/* HEADER */}
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
                TASKS
              </p>
              <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Todo</h1>
              <p className="mt-2 text-sm text-slate-600">
                Kelola tugas pribadi dan tim Anda.
              </p>
            </div>
            <button
              onClick={openCreateForm}
              className="rounded-xl bg-indigo-600 px-5 py-3 text-xs font-semibold transition hover:bg-indigo-500"
            >
              + New Task
            </button>
          </div>

          {/* SEARCH */}
          <div className="mb-6">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari task..."
              className="w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-xs text-white outline-none placeholder:text-slate-700 focus:border-indigo-500/50"
            />
          </div>

          {/* TODO LIST */}
          {filteredTodos.length === 0 ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-2xl text-indigo-400">
                ✓
              </div>
              <h2 className="mt-5 text-sm font-semibold">Belum ada task</h2>
              <p className="mt-2 text-xs text-slate-700">
                Buat task pertama kamu.
              </p>
              <button
                onClick={openCreateForm}
                className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-semibold hover:bg-indigo-500"
              >
                Create Task
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTodos.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  projects={projects}
                  teams={teams}
                  onToggle={toggleCompleted}
                  onEdit={openEditForm}
                  onDelete={deleteTodo}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#0d1220] p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
                  TASK
                </p>
                <h2 className="mt-2 text-xl font-bold">
                  {editingTodo ? "Edit Task" : "Create Task"}
                </h2>
              </div>
              <button
                onClick={closeForm}
                className="text-xl text-slate-600 hover:text-white"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* =========================
                  TYPE SELECTOR (PERSONAL / TEAM)
                  DILETAKKAN DI ATAS
              ========================= */}
              <div>
                <label className="mb-2 block text-xs text-slate-400">
                  Tipe Task
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleTypeChange("personal")}
                    className={`flex-1 rounded-xl border px-4 py-3 text-sm transition ${
                      form.type === "personal"
                        ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-400"
                        : "border-white/[0.07] text-slate-500 hover:border-white/[0.15]"
                    }`}
                  >
                    👤 Personal
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange("team")}
                    className={`flex-1 rounded-xl border px-4 py-3 text-sm transition ${
                      form.type === "team"
                        ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-400"
                        : "border-white/[0.07] text-slate-500 hover:border-white/[0.15]"
                    }`}
                  >
                    👥 Team
                  </button>
                </div>
              </div>

              {/* =========================
                  JIKA TEAM → PILIH TEAM DULU
              ========================= */}
              {form.type === "team" && (
                <Select
                  label="Pilih Tim"
                  name="teamId"
                  value={form.teamId}
                  onChange={handleChange}
                  options={[
                    { value: "", label: "-- Pilih Tim --" },
                    ...teams.map((t) => ({ value: t.id, label: t.name })),
                  ]}
                />
              )}

              {/* =========================
                  PROJECT SELECTOR
              ========================= */}
              <Select
                label="Project (Opsional)"
                name="projectId"
                value={form.projectId}
                onChange={handleChange}
                options={[
                  { value: "", label: "No Project" },
                  ...getAvailableProjects().map((p) => ({
                    value: p.id,
                    label: p.name,
                  })),
                ]}
                disabled={form.type === "team" && !form.teamId}
              />

              {/* =========================
                  FIELD LAINNYA
              ========================= */}
              <Field
                label="Judul Task"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Masukkan judul task..."
              />

              <div>
                <label className="mb-2 block text-xs text-slate-400">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Deskripsi task..."
                  className="w-full resize-none rounded-xl border border-white/[0.07] bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-indigo-500/50"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
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
                  options={["Low", "Medium", "High"]}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-white/[0.07] px-5 py-3 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-xs font-semibold hover:bg-indigo-500"
                >
                  {editingTodo ? "Save Changes" : "Create Task"}
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
   TODO CARD
========================= */
function TodoCard({ todo, projects, teams, onToggle, onEdit, onDelete }) {
  const project = projects.find((p) => p.id === todo.projectId);
  const team = teams.find((t) => t.id === todo.teamId);

  return (
    <div
      className={`group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition hover:border-indigo-500/20 ${
        todo.completed ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(todo.id)}
          className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border transition ${
            todo.completed
              ? "border-indigo-500 bg-indigo-500"
              : "border-white/[0.15] hover:border-white/[0.3]"
          }`}
        >
          {todo.completed && (
            <svg
              className="h-3 w-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`text-sm font-semibold ${
                todo.completed ? "line-through text-slate-600" : ""
              }`}
            >
              {todo.title}
            </h3>
            <span className="text-[8px] font-bold uppercase tracking-wider text-slate-600">
              {todo.type === "personal" ? "👤 Personal" : `👥 ${team?.name || "Team"}`}
            </span>
            <PriorityBadge priority={todo.priority} />
          </div>

          {todo.description && (
            <p className="mt-1 text-xs text-slate-600 line-clamp-1">
              {todo.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-slate-500">
            {todo.deadline && (
              <span>📅 {formatDate(todo.deadline)}</span>
            )}
            {project && <span>📁 {project.name}</span>}
            {!project && <span>📁 No Project</span>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-shrink-0 gap-1">
          <button
            onClick={() => onEdit(todo)}
            className="rounded-lg px-2 py-1 text-xs text-slate-500 transition hover:bg-indigo-500/10 hover:text-indigo-400"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="rounded-lg px-2 py-1 text-xs text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   SMALL COMPONENTS
========================= */
function Field({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="mb-2 block text-xs text-slate-400">{label}</label>
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

function Select({ label, name, value, onChange, options, disabled = false }) {
  return (
    <div>
      <label className="mb-2 block text-xs text-slate-400">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-xl border border-white/[0.07] bg-[#101522] px-4 py-3 text-sm text-slate-300 outline-none focus:border-indigo-500/50 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {options.map((opt) => {
          if (typeof opt === "object" && opt.value !== undefined) {
            return (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            );
          }
          return (
            <option key={opt} value={opt}>
              {opt}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function PriorityBadge({ priority }) {
  const styles = {
    Low: "bg-emerald-500/10 text-emerald-400",
    Medium: "bg-amber-500/10 text-amber-400",
    High: "bg-red-500/10 text-red-400",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase ${
        styles[priority] || styles.Medium
      }`}
    >
      {priority}
    </span>
  );
}

function formatDate(date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default Todo;