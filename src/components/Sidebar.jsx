import Icon from "./Icon";
import LogoNS from "./LogoNS"; // import komponen logo NS yang sudah dibuat

function Sidebar({
  user,
  activeMenu,
  setActiveMenu,
  open,
  setOpen,
  onLogout,
  onNavigate,
}) {
  // =========================
  // MENU DEFINISI PER ROLE
  // =========================

  const menus = {
    Admin: [
      {
        section: "MAIN",
        items: [
          { label: "Dashboard", icon: "Dashboard" },
          { label: "Todo", icon: "Todo" },
          { label: "My Tasks", icon: "MyTasks" },
        ],
      },
      {
        section: "WORKSPACE",
        items: [
          { label: "Task Management", icon: "Projects" },
          { label: "Project Management", icon: "Project" },
          { label: "Team Management", icon: "Team" },
          { label: "Milestone", icon: "Milestone" },
          { label: "Checklist", icon: "Checklist" },
          { label: "Kanban Board", icon: "Kanban" },
          { label: "Calendar", icon: "Calendar" },
          { label: "Notifications", icon: "Notifications" },
          { label: "Analytics", icon: "Report" },
        ],
      },
      {
        section: "SYSTEM",
        items: [
          { label: "Search", icon: "Search" },
          { label: "Role & Permission", icon: "Settings" },
          { label: "Settings", icon: "Settings" },
        ],
      },
    ],

    Manager: [
      {
        section: "MAIN",
        items: [
          { label: "Dashboard", icon: "Dashboard" },
          { label: "Todo", icon: "Todo" },
          { label: "My Tasks", icon: "MyTasks" },
        ],
      },
      {
        section: "WORKSPACE",
        items: [
          { label: "Task Management", icon: "Projects" },
          { label: "Project Management", icon: "Project" },
          { label: "Team Management", icon: "Team" },
          { label: "Milestone", icon: "Milestone" },
          { label: "Checklist", icon: "Checklist" },
          { label: "Kanban Board", icon: "Kanban" },
          { label: "Calendar", icon: "Calendar" },
          { label: "Notifications", icon: "Notifications" },
          { label: "Analytics", icon: "Report" },
        ],
      },
      {
        section: "SYSTEM",
        items: [
          { label: "Search", icon: "Search" },
          { label: "Settings", icon: "Settings" },
        ],
      },
    ],

    Member: [
      {
        section: "MAIN",
        items: [
          { label: "Dashboard", icon: "Dashboard" },
          { label: "Todo", icon: "Todo" },
          { label: "My Tasks", icon: "MyTasks" },
          { label: "Checklist", icon: "Checklist" },
          { label: "Kanban Board", icon: "Kanban" },
          { label: "Calendar", icon: "Calendar" },
          { label: "Analytics", icon: "Report" },
        ],
      },
      {
        section: "SYSTEM",
        items: [
          { label: "Search", icon: "Search" },
          { label: "Settings", icon: "Settings" },
        ],
      },
    ],
  };

  // Pilih menu berdasarkan role user, fallback ke Member
  const currentMenus = menus[user?.role] || menus.Member;

  // =========================
  // RENDER
  // =========================

  return (
    <>
      {/* OVERLAY MOBILE */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-[270px]
          flex-col border-r border-[var(--border)]
          bg-[var(--sidebar)]
          shadow-[var(--shadow-lg)]
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* BRAND - dengan LogoNS */}
        <div className="flex h-[82px] items-center justify-between border-b border-[var(--border)] px-6">
          <div className="flex items-center gap-3">
            <LogoNS size={40} />  {/* LOGO NS */}
            <div>
              <p className="text-sm font-bold text-[var(--text-strong)]">
                NEXORA SOLUTIONS
              </p>
              <p className="text-[9px] uppercase tracking-[0.25em] text-[var(--muted)]">
                Workspace
              </p>
            </div>
          </div>

          {/* TOMBOL CLOSE (mobile) */}
          <button
            onClick={() => setOpen(false)}
            className="ml-auto text-2xl text-[var(--muted)] hover:text-[var(--text)] lg:hidden"
          >
            ×
          </button>
        </div>

        {/* USER PROFILE */}
        <div className="mx-4 mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[var(--shadow-sm)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 font-bold text-indigo-300">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-[var(--text-strong)]">
                {user?.name || "User"}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-[var(--muted)]">
                  {user?.role || "Member"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MENU NAVIGASI */}
        <nav className="mt-5 flex-1 overflow-y-auto px-4 pb-4">
          {currentMenus.map((group) => (
            <div key={group.section} className="mb-6">
              <p className="mb-2 px-3 text-[9px] font-bold tracking-[0.2em] text-[var(--muted-dark)]">
                {group.section}
              </p>

              {group.items.map(({ label, icon }) => {
                const isActive = activeMenu === label;
                return (
                  <button
                    key={label}
                    onClick={() => {
                      setActiveMenu(label);
                      setOpen(false);
                      onNavigate(label);
                    }}
                    className={`
                      group relative mb-1 flex w-full items-center gap-3
                      rounded-xl border px-3 py-2.5
                      text-left text-xs transition-all duration-200
                      ${
                        isActive
                          ? "border-[var(--primary-border)] bg-[var(--primary-soft)] text-[var(--primary)] shadow-[var(--shadow-sm)]"
                          : "border-transparent text-[var(--muted)] hover:border-[var(--border)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
                      }
                    `}
                  >
                    {/* ICON */}
                    <span
                      className={`
                        flex h-7 w-7 items-center justify-center rounded-lg text-sm
                        transition-colors
                        ${
                          isActive
                            ? "bg-indigo-500/15 text-indigo-400"
                            : "text-[var(--muted-dark)] group-hover:text-[var(--text)]"
                        }
                      `}
                    >
                      <Icon name={icon} size={18} stroke={1.8} />
                    </span>

                    {/* LABEL */}
                    <span className="flex-1 font-medium">{label}</span>

                    {/* INDICATOR AKTIF */}
                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* LOGOUT BUTTON */}
        <div className="border-t border-[var(--border)] p-4">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-3 text-xs text-[var(--muted)] transition-all hover:border-[var(--danger-soft)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--panel)] text-[var(--text)]">
              <Icon name="Logout" size={16} className="text-[var(--muted-dark)]" stroke={1.6} />
            </span>
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;