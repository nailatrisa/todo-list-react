import { useEffect, useState } from "react";

const initialForm = {
  title: "",
  description: "",
  deadline: "",
  priority: "Medium",
  project: "",
};

function TodoForm({
  onSubmit,
  editingTodo,
  onCancel,
}) {
  const [form, setForm] =
    useState(initialForm);
  const [projects] = useState(() => {
    try {
      const raw = window.localStorage.getItem("taskflow_projects");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    if (editingTodo) {
      setForm({
        title: editingTodo.title || "",
        description:
          editingTodo.description || "",
        deadline:
          editingTodo.deadline || "",
        priority:
          editingTodo.priority || "Medium",
        project: editingTodo.project || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [editingTodo]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      alert("Task title wajib diisi!");
      return;
    }

    onSubmit(form);

    setForm(initialForm);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6"
    >
      {/* HEADER */}

      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-400">
          {editingTodo
            ? "EDIT TASK"
            : "CREATE TASK"}
        </p>

        <h2 className="mt-2 text-lg font-bold text-white">
          {editingTodo
            ? "Update your task"
            : "Create a new task"}
        </h2>

        <p className="mt-1 text-xs text-slate-600">
          Tambahkan detail pekerjaan kamu.
        </p>
      </div>

      {/* TITLE */}

      <div className="mb-4">
        <label className="mb-2 block text-xs font-medium text-slate-400">
          Task title
        </label>

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Contoh: Membuat dashboard"
          className="w-full rounded-xl border border-white/[0.07] bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-indigo-500/50"
        />
      </div>

      {/* DESCRIPTION */}

      <div className="mb-4">
        <label className="mb-2 block text-xs font-medium text-slate-400">
          Description
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          placeholder="Tambahkan detail pekerjaan..."
          className="w-full resize-none rounded-xl border border-white/[0.07] bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-indigo-500/50"
        />
      </div>

      {/* DEADLINE + PRIORITY */}

      <div className="grid gap-4 sm:grid-cols-2">

        <div>
          <label className="mb-2 block text-xs font-medium text-slate-400">
            Deadline
          </label>

          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/[0.07] bg-black/20 px-4 py-3 text-sm text-slate-300 outline-none focus:border-indigo-500/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-slate-400">
            Priority
          </label>

          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/[0.07] bg-[#101522] px-4 py-3 text-sm text-slate-300 outline-none focus:border-indigo-500/50"
          >
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

      <div className="mt-4">
        <label className="mb-2 block text-xs font-medium text-slate-400">Project (opsional)</label>

        <select name="project" value={form.project} onChange={handleChange} className="w-full rounded-xl border border-white/[0.07] bg-[#101522] px-4 py-3 text-sm text-slate-300 outline-none focus:border-indigo-500/50">
          <option value="">Personal / No Project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.name}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* BUTTON */}

      <div className="mt-5 flex flex-wrap gap-2">

        <button
          type="submit"
          className="rounded-xl bg-indigo-600 px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-600/10 transition hover:bg-indigo-500"
        >
          {editingTodo
            ? "Save Changes"
            : "Create Task"}
        </button>

        {editingTodo && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-white/[0.07] px-5 py-3 text-xs font-medium text-slate-400 transition hover:bg-white/[0.03] hover:text-white"
          >
            Cancel
          </button>
        )}

      </div>
    </form>
  );
}

export default TodoForm;