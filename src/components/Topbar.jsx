import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { STORAGE_KEYS } from "../utils/storage";

const defaultNotifications = [
  {
    id: 1,
    title: "Task baru diberikan",
    detail: "Ada task yang butuh review sebelum jam 15.00.",
    unread: true,
  },
  {
    id: 2,
    title: "Deadline Nexora Solutions hampir tiba",
    detail: "Satu milestone akan jatuh tempo dalam 2 hari.",
    unread: true,
  },
  {
    id: 3,
    title: "Project berhasil diperbarui",
    detail: "Progress proyek Anda berhasil diupdate oleh tim.",
    unread: false,
  },
];

function Topbar({
  user,
  activeMenu,
  onOpenSidebar,
  onToggleSidebar,
  onSearch,
  searchQuery,
  onLogout,
}) {
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState(searchQuery || "");
  const [notifications, setNotifications] = useState(() => {
    if (typeof window === "undefined") return defaultNotifications;

    try {
      const stored = window.localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return stored ? JSON.parse(stored) : defaultNotifications;
    } catch {
      return defaultNotifications;
    }
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    setQuery(searchQuery || "");
  }, [searchQuery]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    }
  }, [notifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pageTitle = useMemo(() => {
    const titles = {
      Dashboard: "Dashboard",
      Todo: "Todo",
      "My Tasks": "My Tasks",
      "Task Management": "Task Management",
      "Project Management": "Project Management",
      "Team Management": "Team Management",
      Milestone: "Milestone",
      Checklist: "Checklist",
      Search: "Search",
      "Role & Permission": "Role & Permission",
      Settings: "Settings",
      "Kanban Board": "Kanban Board",
      Calendar: "Calendar",
      Notifications: "Notifications",
      Analytics: "Analytics",
    };

    return titles[activeMenu] || activeMenu || "Dashboard";
  }, [activeMenu]);

  const unreadCount = notifications.filter((item) => item.unread).length;

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch?.(query.trim());
  };

  const clearQuery = () => {
    setQuery("");
    onSearch?.("");
  };

  const toggleSidebar = () => {
    if (onToggleSidebar) {
      onToggleSidebar();
      return;
    }

    if (onOpenSidebar) {
      onOpenSidebar();
      return;
    }

    if (typeof window !== "undefined" && window.__taskflowToggleSidebar) {
      window.__taskflowToggleSidebar();
    }
  };

  const markAllAsRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, unread: false })));
  };

  return (
    <header className="sticky top-0 z-30 flex h-[82px] items-center justify-between border-b border-[var(--border)] bg-[var(--header)] px-4 shadow-[var(--shadow-md)] backdrop-blur-xl transition-colors duration-300 sm:px-8">
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={toggleSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] lg:hidden"
        >
          ☰
        </button>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
            WORKSPACE
          </p>
          <h1 className="mt-1 text-lg font-bold text-white">{pageTitle}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <form onSubmit={handleSubmit} className="hidden md:flex">
          <div className="flex h-10 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-xs text-[var(--muted)] shadow-[var(--shadow-sm)]">
            <span className="text-slate-400">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onSearch?.(query.trim());
                }
              }}
              placeholder="Search"
              className="w-28 bg-transparent text-sm text-slate-200 outline-none sm:w-40"
            />
            {query && (
              <button type="button" onClick={clearQuery} className="text-slate-400 hover:text-white">
                ×
              </button>
            )}
          </div>
        </form>

        <button
          type="button"
          onClick={() => {
            setQuery("");
            onSearch?.("");
          }}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] md:hidden"
        >
          ⌕
        </button>

        <button
          onClick={() => toggleTheme()}
          className="flex h-10 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-xs text-[var(--text-secondary)] transition hover:border-[var(--primary-border)] hover:text-[var(--text)]"
        >
          <span>{theme === "dark" ? "☀" : "☾"}</span>
          <span>{theme === "dark" ? "Light" : "Dark"}</span>
        </button>

        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications((current) => !current)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--primary-border)] hover:text-[var(--text)]"
          >
            ♧
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-500 px-1 text-[10px] font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/[0.07] bg-[#0f172a] p-3 shadow-2xl shadow-black/20">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Notifications</p>
                <button onClick={markAllAsRead} className="text-[11px] text-indigo-400 hover:text-indigo-300">
                  Mark all as read
                </button>
              </div>

              <div className="space-y-2">
                {notifications.map((item) => (
                  <div key={item.id} className="rounded-xl border border-white/[0.05] bg-white/[0.03] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-white">{item.title}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.detail}</p>
                      </div>
                      {item.unread && <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-400" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile((current) => !current)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white"
          >
            {(user?.name || "A").charAt(0).toUpperCase()}
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/[0.07] bg-[#0f172a] p-3 shadow-2xl shadow-black/20">
              <div className="mb-3 rounded-xl border border-white/[0.05] bg-white/[0.03] p-3">
                <p className="text-sm font-semibold text-white">{user?.name || "User"}</p>
                <p className="mt-1 text-xs text-slate-500">{user?.role || "Member"}</p>
              </div>

              <div className="space-y-1 text-sm text-slate-400">
                <button className="flex w-full items-center rounded-xl px-3 py-2 text-left hover:bg-white/[0.04] hover:text-white">
                  Profile
                </button>
                <button className="flex w-full items-center rounded-xl px-3 py-2 text-left hover:bg-white/[0.04] hover:text-white">
                  Settings
                </button>
                <button
                  onClick={() => {
                    setShowProfile(false);
                    onLogout?.();
                    if (typeof window !== "undefined" && window.__taskflowOnLogout) {
                      window.__taskflowOnLogout();
                    }
                  }}
                  className="flex w-full items-center rounded-xl px-3 py-2 text-left text-red-400 hover:bg-red-500/10"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;