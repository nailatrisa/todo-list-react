import { useState } from "react";

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

function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser =
        localStorage.getItem(STORAGE_KEYS.USER) ||
        sessionStorage.getItem(STORAGE_KEYS.USER);

      if (!savedUser) {
        return null;
      }

      return JSON.parse(savedUser);
    } catch (error) {
      console.error("Gagal membaca user:", error);
      return null;
    }
  });

  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setActiveMenu("Dashboard");
    setSidebarOpen(false);
  };

  const handleNavigate = (menu) => {
    setActiveMenu(menu);
    setSidebarOpen(false);
  };

  const handleSearch = (query) => {
    const nextQuery = query?.trim() || "";
    setSearchQuery(nextQuery);

    if (nextQuery) {
      setActiveMenu("Search");
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    sessionStorage.removeItem(STORAGE_KEYS.USER);

    setUser(null);
    setActiveMenu("Dashboard");
    setSidebarOpen(false);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  switch (activeMenu) {
    case "Todo":
      return (
        <Todo
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          activeMenu={activeMenu}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      );

    case "Task Management":
      return (
        <TaskManagement
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          activeMenu={activeMenu}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      );

    case "Project Management":
      return (
        <ProjectManagement
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          activeMenu={activeMenu}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      );

    case "My Tasks":
      return (
        <MyTasks
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          activeMenu={activeMenu}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      );

    case "Team Management":
      return (
        <TeamManagement
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          activeMenu={activeMenu}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      );

    case "Milestone":
      return (
        <Milestone
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          activeMenu={activeMenu}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      );

    case "Checklist":
      return (
        <Checklist
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          activeMenu={activeMenu}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      );

    case "Search":
      return (
        <Search
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          activeMenu={activeMenu}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      );

    case "Role & Permission":
      return (
        <Roles
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          activeMenu={activeMenu}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      );

    case "Settings":
      return (
        <Settings
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          activeMenu={activeMenu}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      );

    case "Kanban Board":
      return (
        <Kanban
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          activeMenu={activeMenu}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      );

    case "Calendar":
      return (
        <CalendarPage
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          activeMenu={activeMenu}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      );

    case "Notifications":
      return (
        <Notifications
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          activeMenu={activeMenu}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      );

    case "Analytics":
      return (
        <Analytics
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          activeMenu={activeMenu}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      );

    case "Dashboard":
    default:
      return (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          activeMenu={activeMenu}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      );
  }
}

export default App;