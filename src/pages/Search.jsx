import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import useLocalStorage from "../hooks/useLocalStorage";
import { STORAGE_KEYS } from "../utils/storage";

function Search({ user, onLogout, onNavigate, activeMenu, sidebarOpen, setSidebarOpen, onSearch, searchQuery }) {
  const [todos] = useLocalStorage(STORAGE_KEYS.TODOS, []);
  const [tasks] = useLocalStorage("taskflow_tasks", []);
  const [projects] = useLocalStorage("taskflow_projects", []);
  const activeState = activeMenu || "Search";
  const [query, setQuery] = useState(searchQuery || "");

  useEffect(() => {
    setQuery(searchQuery || "");
  }, [searchQuery]);

  const results = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    const filteredTodos = todos.filter((todo) => {
      if (!keyword) return false;
      return `${todo.title} ${todo.description}`.toLowerCase().includes(keyword);
    });

    const filteredTasks = tasks.filter((task) => {
      if (!keyword) return false;
      return `${task.title} ${task.project} ${task.assignee} ${task.description}`.toLowerCase().includes(keyword);
    });

    const filteredProjects = projects.filter((project) => {
      if (!keyword) return false;
      return `${project.name} ${project.client} ${project.description}`.toLowerCase().includes(keyword);
    });

    return { filteredTodos, filteredTasks, filteredProjects };
  }, [projects, query, tasks, todos]);

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

        <div className="mx-auto max-w-[1400px] p-5 sm:p-8">
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">SEARCH</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Search Workspace</h1>
            <p className="mt-2 text-sm text-slate-600">Cari task, todo, dan project secara cepat dari satu layar.</p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari task, project, assignee, atau todo..."
              className="w-full rounded-xl border border-white/[0.07] bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-700"
            />
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-3">
            <SearchSection title="Todos" count={results.filteredTodos.length} items={results.filteredTodos} />
            <SearchSection title="Tasks" count={results.filteredTasks.length} items={results.filteredTasks} />
            <SearchSection title="Projects" count={results.filteredProjects.length} items={results.filteredProjects} />
          </div>
        </div>
      </main>
    </div>
  );
}

function SearchSection({ title, count, items }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-xs text-slate-600">{count} found</span>
      </div>

      {count === 0 ? (
        <p className="text-sm text-slate-600">Tidak ada hasil untuk kategori ini.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-white/[0.05] bg-black/20 p-4">
              <p className="text-sm font-semibold text-white">{item.title || item.name}</p>
              <p className="mt-1 text-xs text-slate-600">{item.description || item.client || "Tidak ada deskripsi"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;