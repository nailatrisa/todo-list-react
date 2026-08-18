import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import useLocalStorage from "../hooks/useLocalStorage";

const DEFAULT_COMPANY = {
  name: "Nexora Solutions",
  contact: "+62 812-3456-7890",
  website: "https://nexorasolutions.com",
  email: "info@nexorasolutions.com",
  address: "Jl. Sudirman No. 123, Jakarta Selatan, DKI Jakarta 12190, Indonesia",
  logo: "",
};

function Settings({
  user,
  onLogout,
  onNavigate,
  activeMenu,
  sidebarOpen,
  setSidebarOpen,
  onSearch,
  searchQuery,
}) {
  const activeState = activeMenu || "Settings";

  // =========================
  // LOCAL STORAGE HOOKS
  // =========================

  const [settings, setSettings] = useLocalStorage("taskflow_settings", {
    notifications: true,
    compactMode: false,
    autoSave: true,
  });

  const [company, setCompany] = useLocalStorage("company_profile", DEFAULT_COMPANY);

  // =========================
  // HANDLE COMPANY CHANGE
  // =========================

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompany((prev) => ({ ...prev, [name]: value }));
  };

  // =========================
  // HANDLE SETTING TOGGLE
  // =========================

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // =========================
  // RESET TO DEFAULT
  // =========================

  const resetCompany = () => {
    setCompany(DEFAULT_COMPANY);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
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
          {/* =========================
              HEADER
          ========================= */}

          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
              SETTINGS
            </p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl text-[var(--text-strong)]">
              Settings
            </h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Sesuaikan pengalaman kerja Anda dengan preferensi yang disimpan lokal.
            </p>
          </div>

          {/* =========================
              COMPANY PROFILE CARD
          ========================= */}

          <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--panel)] p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-[var(--text-strong)]">
                  Company Profile
                </h3>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Informasi perusahaan disimpan secara lokal di browser Anda.
                </p>
              </div>
              <button
                onClick={resetCompany}
                className="rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-medium text-[var(--muted)] transition hover:border-indigo-500/40 hover:text-indigo-400"
              >
                Reset ke Default
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted-dark)]">
                  Nama Perusahaan
                </label>
                <input
                  name="name"
                  value={company.name}
                  onChange={handleCompanyChange}
                  placeholder="Nama Perusahaan"
                  className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted-dark)] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted-dark)]">
                  Kontak
                </label>
                <input
                  name="contact"
                  value={company.contact}
                  onChange={handleCompanyChange}
                  placeholder="+62 812-3456-7890"
                  className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted-dark)] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted-dark)]">
                  Website
                </label>
                <input
                  name="website"
                  value={company.website}
                  onChange={handleCompanyChange}
                  placeholder="https://example.com"
                  className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted-dark)] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted-dark)]">
                  Email Perusahaan
                </label>
                <input
                  name="email"
                  value={company.email}
                  onChange={handleCompanyChange}
                  placeholder="info@perusahaan.com"
                  className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted-dark)] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted-dark)]">
                  Alamat
                </label>
                <input
                  name="address"
                  value={company.address}
                  onChange={handleCompanyChange}
                  placeholder="Jl. Sudirman No. 123, Jakarta Selatan"
                  className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted-dark)] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>

          {/* =========================
              SETTINGS CARDS
          ========================= */}

          <div className="mt-6 space-y-4">
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

/* =====================================================
   SETTING CARD (komponen pembantu)
===================================================== */

function SettingCard({ title, description, enabled, onToggle }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border-strong)] bg-[var(--panel)] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-base font-semibold text-[var(--text-strong)]">{title}</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`relative h-7 w-12 flex-shrink-0 rounded-full transition ${
          enabled ? "bg-indigo-500" : "bg-[var(--border)]"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

export default Settings;