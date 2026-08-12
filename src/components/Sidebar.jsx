function Sidebar({
  user,
  activeMenu,
  setActiveMenu,
  open,
  setOpen,
  onLogout,
  onNavigate,
}) {
  const menus = {
    Admin: [
      {
        section: "MAIN",
        items: [
          ["Dashboard", "⌂"],
          ["Todo", "✓"],
          ["My Tasks", "▣"],
        ],
      },
      {
        section: "WORKSPACE",
        items: [
          ["Task Management", "◈"],
          ["Project Management", "▦"],
          ["Team Management", "♧"],
          ["Milestone", "◇"],
          ["Checklist", "☑"],
          ["Kanban Board", "▤"],
          ["Calendar", "⌚"],
          ["Notifications", "✦"],
          ["Analytics", "◔"],
        ],
      },
      {
        section: "SYSTEM",
        items: [
          ["Search", "⌕"],
          ["Role & Permission", "♙"],
          ["Settings", "⚙"],
        ],
      },
    ],

    Manager: [
      {
        section: "MAIN",
        items: [
          ["Dashboard", "⌂"],
          ["Todo", "✓"],
          ["My Tasks", "▣"],
        ],
      },
      {
        section: "WORKSPACE",
        items: [
          ["Task Management", "◈"],
          ["Project Management", "▦"],
          ["Team Management", "♧"],
          ["Milestone", "◇"],
          ["Checklist", "☑"],
          ["Kanban Board", "▤"],
          ["Calendar", "⌚"],
          ["Notifications", "✦"],
          ["Analytics", "◔"],
        ],
      },
      {
        section: "SYSTEM",
        items: [
          ["Search", "⌕"],
          ["Settings", "⚙"],
        ],
      },
    ],

    Member: [
      {
        section: "MAIN",
        items: [
          ["Dashboard", "⌂"],
          ["Todo", "✓"],
          ["My Tasks", "▣"],
          ["Checklist", "☑"],
          ["Kanban Board", "▤"],
          ["Calendar", "⌚"],
          ["Analytics", "◔"],
        ],
      },
      {
        section: "SYSTEM",
        items: [
          ["Search", "⌕"],
          ["Settings", "⚙"],
        ],
      },
    ],
  };

  const currentMenus =
    menus[user?.role] || menus.Member;

  return (
    <>
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-[270px]
          flex-col border-r border-white/[0.07]
          bg-[#0b0f1c]
          transition-transform duration-300
          lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* BRAND */}
        <div className="flex h-[82px] items-center border-b border-white/[0.07] px-6">
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-black shadow-lg shadow-indigo-500/20">
              TF
            </div>

            <div>
              <p className="text-sm font-bold">
                TASKFLOW
              </p>

              <p className="text-[9px] uppercase tracking-[0.25em] text-slate-600">
                Business Workspace
              </p>
            </div>

          </div>

          {/* CLOSE MOBILE */}
          <button
            onClick={() => setOpen(false)}
            className="ml-auto text-xl text-slate-600 hover:text-white lg:hidden"
          >
            ×
          </button>
        </div>

        {/* USER */}
        <div className="mx-4 mt-5 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3">
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 font-bold text-indigo-300">
              {user?.name
                ?.charAt(0)
                .toUpperCase() || "U"}
            </div>

            <div className="min-w-0">

              <p className="truncate text-xs font-semibold text-slate-200">
                {user?.name || "User"}
              </p>

              <div className="mt-1 flex items-center gap-2">

                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                <span className="text-[10px] text-slate-600">
                  {user?.role || "Member"}
                </span>

              </div>

            </div>
          </div>
        </div>

        {/* MENU */}
        <nav className="mt-5 flex-1 overflow-y-auto px-4">

          {currentMenus.map((group) => (
            <div
              key={group.section}
              className="mb-5"
            >
              <p className="mb-2 px-3 text-[9px] font-bold tracking-[0.2em] text-slate-700">
                {group.section}
              </p>

              {group.items.map(
                ([name, icon]) => {
                  const active =
                    activeMenu === name;

                  return (
                    <button
                      key={name}
                      onClick={() => {
                        setActiveMenu(name);
                        setOpen(false);
                        onNavigate(name);
                      }}
                      className={`
                        mb-1 flex w-full items-center gap-3
                        rounded-xl px-3 py-2.5
                        text-left text-xs transition
                        ${
                          active
                            ? "bg-indigo-500/10 text-indigo-300"
                            : "text-slate-500 hover:bg-white/[0.035] hover:text-slate-200"
                        }
                      `}
                    >
                      {/* ICON */}
                      <span
                        className={`
                          flex h-7 w-7 items-center justify-center
                          rounded-lg text-sm
                          ${
                            active
                              ? "bg-indigo-500/15 text-indigo-400"
                              : "text-slate-600"
                          }
                        `}
                      >
                        {icon}
                      </span>

                      {/* NAME */}
                      <span className="font-medium">
                        {name}
                      </span>

                      {/* ACTIVE INDICATOR */}
                      {active && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400" />
                      )}
                    </button>
                  );
                }
              )}
            </div>
          ))}

        </nav>

        {/* LOGOUT */}
        <div className="border-t border-white/[0.07] p-4">

          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-xs text-slate-500 transition hover:bg-red-500/5 hover:text-red-400"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.03]">
              ↪
            </span>

            Sign out
          </button>

        </div>
      </aside>
    </>
  );
}

export default Sidebar;