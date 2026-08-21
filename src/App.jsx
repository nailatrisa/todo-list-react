import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Todo from "./pages/Todo";
import TaskManagement from "./pages/TaskManagement";
import ProjectManagement from "./pages/ProjectManagement";
import MyTasks from "./pages/MyTasks";
import TeamManagement from "./pages/TeamManagement";
import Milestone from "./pages/Milestone";
import Checklist from "./pages/Checklist";
import Search from "./pages/Search";
import Roles from "./pages/Roles";
import Settings from "./pages/Settings";
import Kanban from "./pages/Kanban";
import CalendarPage from "./pages/CalendarPage";
import Notifications from "./pages/Notifications";
import Analytics from "./pages/Analytics";

import { STORAGE_KEYS } from "./utils/storage";

// === OBJEK YANG ANDA BERIKAN ===
const menuToPath = {
  Dashboard: "/dashboard",
  Todo: "/todo",
  "Task Management": "/task-management",
  "Project Management": "/project-management",
  "My Tasks": "/my-tasks",
  "Team Management": "/team-management",
  Milestone: "/milestone",
  Checklist: "/checklist",
  Search: "/search",
  "Role & Permission": "/roles",
  Settings: "/settings",
  "Kanban Board": "/kanban",
  Calendar: "/calendar",
  Notifications: "/notifications",
  Analytics: "/analytics",
};

const pathToMenu = Object.fromEntries(
  Object.entries(menuToPath).map(([menu, path]) => [path, menu])
);
// =================================

// Komponen internal yang akan menggunakan hook routing
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(() => {
    try {
      const savedUser =
        localStorage.getItem(STORAGE_KEYS.USER) ||
        sessionStorage.getItem(STORAGE_KEYS.USER);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Sinkronkan activeMenu dengan URL saat pertama kali atau saat URL berubah
  useEffect(() => {
    const path = location.pathname;
    const menu = pathToMenu[path];
    if (menu) {
      setActiveMenu(menu);
    } else {
      // Jika path tidak dikenal, arahkan ke dashboard
      navigate(menuToPath.Dashboard, { replace: true });
    }
  }, [location.pathname, navigate]);

  // Fungsi navigasi: ubah URL
  const handleNavigate = (menu) => {
    const path = menuToPath[menu];
    if (path) {
      navigate(path);
      setActiveMenu(menu);
      setSidebarOpen(false);
    }
  };

  const handleSearch = (query) => {
    const nextQuery = query?.trim() || "";
    setSearchQuery(nextQuery);
    if (nextQuery) {
      navigate(menuToPath.Search);
      setActiveMenu("Search");
      setSidebarOpen(false);
    }
  };

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    navigate(menuToPath.Dashboard);
    setActiveMenu("Dashboard");
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    sessionStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    navigate("/login");
  };

  // Jika belum login, tampilkan Login (tanpa layout)
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // Role-based access (sama seperti sebelumnya)
  const roleAccess = {
    Admin: null,
    Manager: [
      "Dashboard",
      "Todo",
      "Task Management",
      "Project Management",
      "My Tasks",
      "Team Management",
      "Milestone",
      "Checklist",
      "Search",
      "Role & Permission",
      "Settings",
      "Kanban Board",
      "Calendar",
      "Notifications",
      "Analytics",
    ],
    Member: [
      "Dashboard",
      "Todo",
      "My Tasks",
      "Checklist",
      "Search",
      "Kanban Board",
      "Calendar",
      "Notifications",
    ],
  };

  const effectiveMenu = (() => {
    if (!user) return activeMenu;
    const role = user.role || "Member";
    if (role === "Admin") return activeMenu;
    const allowed = roleAccess[role] || [];
    return allowed.includes(activeMenu) ? activeMenu : "Dashboard";
  })();

  // Props yang akan dikirim ke semua halaman
  const commonProps = {
    user,
    onLogout: handleLogout,
    onNavigate: handleNavigate,
    onSearch: handleSearch,
    searchQuery,
    activeMenu: effectiveMenu,
    sidebarOpen,
    setSidebarOpen,
  };

  // Gunakan Routes untuk mapping path ke komponen
  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/dashboard" element={<Dashboard {...commonProps} />} />
      <Route path="/todo" element={<Todo {...commonProps} />} />
      <Route path="/task-management" element={<TaskManagement {...commonProps} />} />
      <Route path="/project-management" element={<ProjectManagement {...commonProps} />} />
      <Route path="/my-tasks" element={<MyTasks {...commonProps} />} />
      <Route path="/team-management" element={<TeamManagement {...commonProps} />} />
      <Route path="/milestone" element={<Milestone {...commonProps} />} />
      <Route path="/checklist" element={<Checklist {...commonProps} />} />
      <Route path="/search" element={<Search {...commonProps} />} />
      <Route path="/roles" element={<Roles {...commonProps} />} />
      <Route path="/settings" element={<Settings {...commonProps} />} />
      <Route path="/kanban" element={<Kanban {...commonProps} />} />
      <Route path="/calendar" element={<CalendarPage {...commonProps} />} />
      <Route path="/notifications" element={<Notifications {...commonProps} />} />
      <Route path="/analytics" element={<Analytics {...commonProps} />} />
      {/* Default redirect */}
      <Route path="*" element={<Dashboard {...commonProps} />} />
    </Routes>
  );
}

// Komponen utama yang membungkus dengan BrowserRouter
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;