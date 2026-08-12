import { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import useLocalStorage from "../hooks/useLocalStorage";

const initialItems = [
  { id: 1, title: "Review project requirements", completed: false },
  { id: 2, title: "Prepare task list", completed: false },
  { id: 3, title: "Check project deadline", completed: false },
];

function Checklist({ user, onLogout, onNavigate, activeMenu, sidebarOpen, setSidebarOpen, onSearch, searchQuery }) {
  const [items, setItems] = useLocalStorage("taskflow_checklist", initialItems);
  const activeState = activeMenu || "Checklist";
  const [newItem, setNewItem] = useState("");

  const completion = useMemo(() => {
    const completed = items.filter((item) => item.completed).length;
    return { completed, total: items.length, progress: items.length ? Math.round((completed / items.length) * 100) : 0 };
  }, [items]);

  const toggleItem = (id) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const addItem = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    setItems((currentItems) => [
      ...currentItems,
      { id: Date.now(), title: newItem.trim(), completed: false },
    ]);
    setNewItem("");
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

        <div className="mx-auto max-w-[1200px] p-5 sm:p-8">
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">CHECKLIST</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Checklist</h1>
            <p className="mt-2 text-sm text-slate-600">Tandai pekerjaan penting dan jaga progress berjalan sesuai target.</p>
          </div>

          <div className="mb-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-600">
              <span>Progress checklist</span>
              <span>{completion.completed}/{completion.total}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${completion.progress}%` }} />
            </div>
          </div>

          <form onSubmit={addItem} className="mb-6 flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:flex-row">
            <input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Tambah checklist baru..."
              className="flex-1 rounded-xl border border-white/[0.07] bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-700"
            />
            <button type="submit" className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold hover:bg-indigo-500">
              + Add
            </button>
          </form>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className="flex w-full items-center gap-4 border-b border-white/[0.05] py-4 text-left last:border-0"
              >
                <span className={`flex h-6 w-6 items-center justify-center rounded-md border ${item.completed ? "border-indigo-500 bg-indigo-500 text-white" : "border-white/10 text-transparent"}`}>
                  ✓
                </span>
                <span className={`text-sm ${item.completed ? "text-slate-600 line-through" : "text-slate-300"}`}>
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Checklist;