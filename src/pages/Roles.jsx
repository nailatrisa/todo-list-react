import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const roleMatrix = [
  { role: "Admin", access: ["Full access", "Manage team", "Approve workflows", "System settings"] },
  { role: "Manager", access: ["Manage projects", "Assign tasks", "Monitor progress", "Review milestones"] },
  { role: "Member", access: ["Create todos", "Update tasks", "View assignments", "Submit work"] },
];

function Roles({ user, onLogout, onNavigate, activeMenu, sidebarOpen, setSidebarOpen, onSearch, searchQuery }) {
  const activeState = activeMenu || "Role & Permission";

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
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">ROLES</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Role & Permission</h1>
            <p className="mt-2 text-sm text-slate-600">Wewenang setiap role yang tersedia dalam sistem.</p>
          </div>

          <div className="mb-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
            <p className="text-sm text-slate-400">Current role</p>
            <p className="mt-2 text-xl font-semibold text-white">{user?.role || "Member"}</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {roleMatrix.map((entry) => (
              <div key={entry.role} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <h2 className="text-lg font-semibold">{entry.role}</h2>
                <div className="mt-4 space-y-2">
                  {entry.access.map((item) => (
                    <div key={item} className="rounded-xl border border-white/[0.05] bg-black/20 px-3 py-2 text-sm text-slate-400">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Roles;