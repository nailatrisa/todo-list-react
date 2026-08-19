import { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import useLocalStorage from "../hooks/useLocalStorage";
import { createId } from "../utils/storage";
import ProjectSelector from "../components/ProjectSelector";

// =========================
// DEFAULT TEAMS (akan disimpan di localStorage)
// =========================
const DEFAULT_TEAMS = [
  { id: "team-1", name: "Engineering" },
  { id: "team-2", name: "Marketing" },
  { id: "team-3", name: "Sales" },
  { id: "team-4", name: "Design" },
];

const emptyProject = {
  name: "",
  description: "",
  client: "",
  deadline: "",
  status: "Active",
  progress: 0,
  teamId: "", // <-- tambahan untuk team
};

function ProjectManagement({
  user,
  onLogout,
  onNavigate,
  activeMenu,
  sidebarOpen,
  setSidebarOpen,
  onSearch,
  searchQuery,
}) {
  // =========================
  // LOCAL STORAGE
  // =========================
  const [projects, setProjects] = useLocalStorage("taskflow_projects", []);
  const [teams] = useLocalStorage("taskflow_teams", DEFAULT_TEAMS);

  const activeState = activeMenu || "Project Management";

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyProject);

  // =========================
  // FILTER PROJECTS
  // =========================
  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      `${project.name} ${project.client}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [projects, search]);

  // =========================
  // HANDLERS
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Nama project wajib diisi.");
      return;
    }

    const newProject = {
      ...form,
      progress: Number(form.progress),
      teamId: form.teamId || "", // pastikan teamId tersimpan
    };

    if (editingProject) {
      setProjects((current) =>
        current.map((project) =>
          project.id === editingProject.id
            ? { ...project, ...newProject }
            : project
        )
      );
    } else {
      setProjects((current) => [
        {
          ...newProject,
          id: createId(),
          createdAt: new Date().toISOString(),
        },
        ...current,
      ]);
    }

    closeForm();
  };

  const openCreateForm = () => {
    setEditingProject(null);
    setForm(emptyProject);
    setShowForm(true);
  };

  const openEditForm = (project) => {
    setEditingProject(project);
    setForm({
      name: project.name || "",
      description: project.description || "",
      client: project.client || "",
      deadline: project.deadline || "",
      status: project.status || "Active",
      progress: project.progress || 0,
      teamId: project.teamId || "", // <-- isi teamId
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProject(null);
    setForm(emptyProject);
  };

  const deleteProject = (id) => {
    if (!window.confirm("Hapus project ini?")) return;
    setProjects((current) => current.filter((project) => project.id !== id));
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

        <div className="mx-auto max-w-[1500px] p-5 sm:p-8">
          {/* HEADER */}
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
                WORKSPACE
              </p>
              <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
                Project Management
              </h1>
              <p className="mt-2 max-w-xl text-sm text-slate-600">
                Kelola project, deadline, client, status, progress, dan tim.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={openCreateForm}
                className="rounded-xl bg-indigo-600 px-5 py-3 text-xs font-semibold transition hover:bg-indigo-500"
              >
                + New Project
              </button>
            </div>
          </div>

          <ProjectSelector projects={projects} />

          {/* SEARCH */}
          <div className="mb-6">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search project atau client..."
              className="w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-xs text-white outline-none placeholder:text-slate-700 focus:border-indigo-500/50"
            />
          </div>

          {/* PROJECT GRID */}
          {filteredProjects.length === 0 ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-2xl text-indigo-400">
                ▦
              </div>
              <h2 className="mt-5 text-sm font-semibold">Belum ada project</h2>
              <p className="mt-2 text-xs text-slate-700">
                Buat project pertama kamu.
              </p>
              <button
                onClick={openCreateForm}
                className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-semibold hover:bg-indigo-500"
              >
                Create Project
              </button>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  teams={teams} // <-- kirim teams ke card
                  onEdit={openEditForm}
                  onDelete={deleteProject}
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
                  PROJECT
                </p>
                <h2 className="mt-2 text-xl font-bold">
                  {editingProject ? "Edit Project" : "Create Project"}
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
              <Field
                label="Project Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Contoh: Website Company Profile"
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
                  placeholder="Deskripsi project..."
                  className="w-full resize-none rounded-xl border border-white/[0.07] bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-indigo-500/50"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Client"
                  name="client"
                  value={form.client}
                  onChange={handleChange}
                  placeholder="Nama client"
                />
                <Field
                  label="Deadline"
                  name="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Select
                  label="Status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  options={["Active", "On Hold", "Completed"]}
                />

                <div>
                  <label className="mb-2 block text-xs text-slate-400">
                    Progress
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    name="progress"
                    value={form.progress}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/[0.07] bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50"
                  />
                </div>

                {/* =========================
                    SELECT TEAM (ditambahkan di sini)
                ========================= */}
                <Select
                  label="Team (Opsional)"
                  name="teamId"
                  value={form.teamId}
                  onChange={handleChange}
                  options={[
                    { value: "", label: "Personal / No Team" },
                    ...teams.map((team) => ({
                      value: team.id,
                      label: team.name,
                    })),
                  ]}
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
                  {editingProject ? "Save Changes" : "Create Project"}
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
   PROJECT CARD
========================= */
function ProjectCard({ project, teams, onEdit, onDelete }) {
  // Cari nama tim berdasarkan teamId
  const teamName = project.teamId
    ? teams.find((t) => t.id === project.teamId)?.name || "No Team"
    : "Personal / No Team";

  return (
    <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition hover:-translate-y-1 hover:border-indigo-500/20 hover:bg-white/[0.04]">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
          ▦
        </div>
        <StatusBadge status={project.status} />
      </div>

      <h3 className="mt-5 line-clamp-1 text-base font-bold">{project.name}</h3>
      <p className="mt-2 line-clamp-2 min-h-[40px] text-xs leading-5 text-slate-600">
        {project.description || "Tidak ada deskripsi project."}
      </p>

      <div className="mt-5 space-y-3">
        <Info label="CLIENT" value={project.client || "No Client"} />
        <Info
          label="DEADLINE"
          value={
            project.deadline
              ? formatDate(project.deadline)
              : "No Deadline"
          }
        />
        {/* ===== TAMBAHAN: TEAM ===== */}
        <Info label="TEAM" value={teamName} />
      </div>

      {/* PROGRESS */}
      <div className="mt-6">
        <div className="mb-2 flex justify-between">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-700">
            Progress
          </span>
          <span className="text-xs font-bold text-indigo-400">
            {project.progress}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* ACTION */}
      <div className="mt-6 flex gap-2 border-t border-white/[0.06] pt-4">
        <button
          onClick={() => onEdit(project)}
          className="flex-1 rounded-lg bg-white/[0.04] py-2.5 text-[10px] text-slate-500 hover:bg-indigo-500/10 hover:text-indigo-400"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(project.id)}
          className="flex-1 rounded-lg bg-white/[0.04] py-2.5 text-[10px] text-slate-500 hover:bg-red-500/10 hover:text-red-400"
        >
          Delete
        </button>
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

// =========================
// SELECT (diperbaiki agar menerima array objek)
// =========================
function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="mb-2 block text-xs text-slate-400">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-white/[0.07] bg-[#101522] px-4 py-3 text-sm text-slate-300 outline-none focus:border-indigo-500/50"
      >
        {options.map((opt) => {
          // Jika opt berupa objek { value, label }
          if (typeof opt === "object" && opt.value !== undefined) {
            return (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            );
          }
          // Jika opt berupa string
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

function Info({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[9px] font-bold tracking-wider text-slate-700">
        {label}
      </span>
      <span className="truncate text-[10px] text-slate-500">{value}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Active: "bg-emerald-500/10 text-emerald-400",
    "On Hold": "bg-amber-500/10 text-amber-400",
    Completed: "bg-indigo-500/10 text-indigo-400",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${
        styles[status] || styles.Active
      }`}
    >
      {status}
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

export default ProjectManagement;