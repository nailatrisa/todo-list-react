import { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import TodoForm from "../components/TodoForm";
import TodoItem from "../components/TodoItem";
import useLocalStorage from "../hooks/useLocalStorage";
import {
  STORAGE_KEYS,
  createId,
} from "../utils/storage";
import ProjectSelector from "../components/ProjectSelector";

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
  const [todos, setTodos] =
    useLocalStorage(
      STORAGE_KEYS.TODOS,
      []
    );

  const [localSidebarOpen, setLocalSidebarOpen] = useState(false);
  const activeState = activeMenu || "Todo";

  const [editingTodo, setEditingTodo] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("All");

  const [draggedId, setDraggedId] =
    useState(null);

  const [selectedProject] = useLocalStorage("taskflow_selected_project", "");
  const [view, setView] = useState("personal");

  /* =========================
     CREATE / UPDATE
  ========================= */

  const handleSubmit = (form) => {
    if (editingTodo) {
      setTodos((current) =>
        current.map((todo) =>
          todo.id === editingTodo.id
            ? {
                ...todo,
                ...form,
                updatedAt:
                  new Date().toISOString(),
              }
            : todo
        )
      );

      setEditingTodo(null);

      return;
    }

    const newTodo = {
      id: createId(),
      title: form.title.trim(),
      description:
        form.description.trim(),
      deadline: form.deadline,
      priority: form.priority,
      completed: false,
      project: form.project || "",
      createdBy: (user && user.email) || "",
      createdAt:
        new Date().toISOString(),
      updatedAt:
        new Date().toISOString(),
    };

    setTodos((current) => [
      newTodo,
      ...current,
    ]);
  };

  /* =========================
     TOGGLE
  ========================= */

  const handleToggle = (id) => {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              updatedAt:
                new Date().toISOString(),
            }
          : todo
      )
    );
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

    setTodos((current) =>
      current.filter(
        (todo) => todo.id !== id
      )
    );

    if (editingTodo?.id === id) {
      setEditingTodo(null);
    }
  };

  /* =========================
     DRAG & DROP
  ========================= */

  const handleDragStart = (id) => {
    setDraggedId(id);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (targetId) => {
    if (!draggedId) return;

    if (draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    setTodos((current) => {
      const draggedIndex =
        current.findIndex(
          (todo) =>
            todo.id === draggedId
        );

      const targetIndex =
        current.findIndex(
          (todo) =>
            todo.id === targetId
        );

      if (
        draggedIndex === -1 ||
        targetIndex === -1
      ) {
        return current;
      }

      const updated = [...current];

      const [draggedTodo] =
        updated.splice(
          draggedIndex,
          1
        );

      updated.splice(
        targetIndex,
        0,
        draggedTodo
      );

      return updated;
    });

    setDraggedId(null);
  };

  /* =========================
     FILTER
  ========================= */

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      // Separate personal vs team view
      if (view === "personal") {
        if (todo.project) return false;
        if (todo.createdBy !== (user && user.email)) return false;
      }

      if (view === "team") {
        if (selectedProject) {
          if (todo.project !== selectedProject) return false;
        } else {
          if (!todo.project) return false;
        }
      }

      const matchesSearch =
        todo.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        todo.description
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      let matchesFilter = true;

      if (filter === "Completed") {
        matchesFilter = todo.completed;
      }

      if (filter === "In Progress") {
        matchesFilter = !todo.completed;
      }

      if (
        ["Low", "Medium", "High", "Urgent"].includes(
          filter
        )
      ) {
        matchesFilter =
          todo.priority === filter;
      }

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [todos, search, filter]);

  const personalAll = useMemo(() => {
    return todos.filter((t) => !t.project && t.createdBy === (user && user.email));
  }, [todos, user]);

  const teamAll = useMemo(() => {
    if (selectedProject) return todos.filter((t) => t.project === selectedProject);
    return todos.filter((t) => !!t.project);
  }, [todos, selectedProject]);

  const stats = useMemo(() => {
    const source = view === "personal" ? personalAll : teamAll;

    const total = source.length;
    const completed = source.filter((todo) => todo.completed).length;
    const inProgress = source.filter((todo) => !todo.completed).length;
    const overdue = source.filter((todo) => {
      if (todo.completed || !todo.deadline) return false;
      return new Date(todo.deadline) < new Date(new Date().setHours(0,0,0,0));
    }).length;

    return { total, completed, inProgress, overdue };
  }, [personalAll, teamAll, view]);
  

  return (
    <div className="min-h-screen bg-[#080b16] text-white">

      <Sidebar
        user={user}
        activeMenu={activeState}
        setActiveMenu={onNavigate}
        open={sidebarOpen ?? localSidebarOpen}
        setOpen={setSidebarOpen || setLocalSidebarOpen}
        onLogout={onLogout}
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

          <div className="mb-7">

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
              TASK MANAGEMENT
            </p>

            <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">

              <div>

                <h1 className="text-2xl font-bold sm:text-3xl">
                  Todo
                </h1>

                <p className="mt-2 text-sm text-slate-600">
                  Kelola pekerjaan dan deadline
                  kamu dalam satu tempat.
                </p>

              </div>

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-xs text-slate-500">
                {todos.length} total tasks
              </div>

            </div>

          </div>

          {/* PROJECT SELECTOR + VIEW TABS */}
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <ProjectSelector projects={[]} />
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setView("personal")} className={`rounded-xl px-3 py-2 text-xs ${view === "personal" ? "bg-indigo-600 text-white" : "bg-white/[0.02] text-slate-300"}`}>
                Personal Todo
              </button>

              <button onClick={() => setView("team")} className={`rounded-xl px-3 py-2 text-xs ${view === "team" ? "bg-indigo-600 text-white" : "bg-white/[0.02] text-slate-300"}`}>
                Team Projects
              </button>
            </div>
          </div>

          {/* STATISTICS */}

          <div className="mb-5 grid gap-3 grid-cols-2 xl:grid-cols-4">

            <Stat
              label="TOTAL"
              value={stats.total}
              icon="◈"
            />

            <Stat
              label="COMPLETED"
              value={stats.completed}
              icon="✓"
            />

            <Stat
              label="IN PROGRESS"
              value={stats.inProgress}
              icon="◷"
            />

            <Stat
              label="OVERDUE"
              value={stats.overdue}
              icon="!"
            />

          </div>

          {/* MAIN */}

          <div className="grid gap-5 xl:grid-cols-[380px_1fr]">

            {/* FORM */}

            <div>

              <TodoForm
                onSubmit={handleSubmit}
                editingTodo={editingTodo}
                onCancel={() =>
                  setEditingTodo(null)
                }
              />

            </div>

            {/* LIST */}

            <div>

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">

                {/* TOOLBAR */}

                <div className="flex flex-col gap-3 lg:flex-row">

                  {/* SEARCH */}

                  <div className="relative flex-1">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700">
                      ⌕
                    </span>

                    <input
                      value={search}
                      onChange={(event) =>
                        setSearch(
                          event.target.value
                        )
                      }
                      placeholder="Search tasks..."
                      className="w-full rounded-xl border border-white/[0.07] bg-black/20 py-3 pl-10 pr-4 text-xs text-white outline-none placeholder:text-slate-700 focus:border-indigo-500/50"
                    />

                  </div>

                  {/* FILTER */}

                  <select
                    value={filter}
                    onChange={(event) =>
                      setFilter(
                        event.target.value
                      )
                    }
                    className="rounded-xl border border-white/[0.07] bg-[#101522] px-4 py-3 text-xs text-slate-400 outline-none focus:border-indigo-500/50"
                  >
                    <option value="All">
                      All Tasks
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Completed">
                      Completed
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

                {/* LIST HEADER */}

                <div className="mb-4 mt-6 flex items-center justify-between">

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                      YOUR TASKS
                    </p>

                    <p className="mt-1 text-xs text-slate-700">
                      Drag task untuk mengatur urutan.
                    </p>

                  </div>

                  <span className="text-[10px] text-slate-600">
                    {filteredTodos.length} shown
                  </span>

                </div>

                {/* TODO */}

                {filteredTodos.length === 0 ? (
                  <EmptyState
                    search={search}
                    filter={filter}
                  />
                ) : (
                  <div className="space-y-2">

                    {filteredTodos.map(
                      (todo) => (
                        <TodoItem
                          key={todo.id}
                          todo={todo}
                          onToggle={
                            handleToggle
                          }
                          onEdit={
                            setEditingTodo
                          }
                          onDelete={
                            handleDelete
                          }
                          onDragStart={
                            handleDragStart
                          }
                          onDragOver={
                            handleDragOver
                          }
                          onDrop={
                            handleDrop
                          }
                        />
                      )
                    )}

                  </div>
                )}

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

function Stat({
  label,
  value,
  icon,
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">

      <div className="flex items-center justify-between">

        <span className="text-[10px] font-bold tracking-[0.15em] text-slate-600">
          {label}
        </span>

        <span className="text-indigo-400">
          {icon}
        </span>

      </div>

      <p className="mt-3 text-2xl font-bold">
        {value}
      </p>

    </div>
  );
}

function EmptyState({
  search,
  filter,
}) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.07]">

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-xl text-indigo-400">
        ✓
      </div>

      <h3 className="mt-4 text-sm font-semibold">
        {search || filter !== "All"
          ? "Task tidak ditemukan"
          : "Belum ada task"}
      </h3>

      <p className="mt-2 max-w-xs text-center text-xs leading-relaxed text-slate-700">
        {search || filter !== "All"
          ? "Coba ubah pencarian atau filter yang kamu gunakan."
          : "Buat task pertama kamu menggunakan form di sebelah kiri."}
      </p>

    </div>
  );
}

export default Todo;