import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import useLocalStorage from "../hooks/useLocalStorage";

function Settings({ user, onLogout, onNavigate, activeMenu, sidebarOpen, setSidebarOpen, onSearch, searchQuery }) {
  const activeState = activeMenu || "Settings";
  const [settings, setSettings] = useLocalStorage("taskflow_settings", {
    notifications: true,
    compactMode: false,
    autoSave: true,
  });

  const toggleSetting = (key) => {
    setSettings((current) => ({ ...current, [key]: !current[key] }));
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
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">SETTINGS</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Settings</h1>
            <p className="mt-2 text-sm text-slate-600">Sesuaikan pengalaman kerja Anda dengan preferensi yang disimpan lokal.</p>
          </div>

          <div className="space-y-4">
            <SettingCard
              title="Notifications"
              description="Terima notifikasi task dan update penting."
              enabled={settings.notifications}
              onToggle={() => toggleSetting("notifications")}
            />
            <SettingCard
              title="Compact Mode"
              description="Tampilkan antarmuka yang lebih ringkas."
              enabled={settings.compactMode}
              onToggle={() => toggleSetting("compactMode")}
            />
            <SettingCard
              title="Auto Save"
              description="Simpan perubahan secara otomatis ke local storage."
              enabled={settings.autoSave}
              onToggle={() => toggleSetting("autoSave")}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function SettingCard({ title, description, enabled, onToggle }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`relative h-7 w-12 rounded-full transition ${enabled ? "bg-indigo-600" : "bg-white/[0.1]"}`}
      >
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${enabled ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );
}

export default Settings;