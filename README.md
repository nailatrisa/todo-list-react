================================================================================
                    PENJELASAN LENGKAP APLIKASI TODO-LIST-REACT
                    (Task Management System dengan React + Vite)
================================================================================

📌 1. PENDAHULUAN
Aplikasi ini adalah Task Management System (Sistem Manajemen Tugas) berbasis React.
Bukan sekadar Todo List biasa, tetapi sudah memiliki:
✅ Sistem Login dengan peran (Admin, Manager, Member)
✅ Routing antar halaman (setiap menu punya URL sendiri)
✅ Role-Based Access Control (RBAC) – hak akses berbeda tiap peran
✅ Penyimpanan data permanen di localStorage (tidak hilang meskipun refresh)
✅ 15+ halaman fitur (Dashboard, Todo, Task Management, Project, Kanban, Calendar, dll.)

🧱 2. TEKNOLOGI YANG DIGUNAKAN
| Teknologi          | Versi   | Fungsi                                                   |
|--------------------|---------|-----------------------------------------------------------|
| React              | 19.2.8  | Library utama untuk membangun UI                          |
| Vite               | 8.2.0   | Build tool (lebih cepat dari Create React App)            |
| React Router DOM   | 7.18.2  | Routing / navigasi antar halaman berbasis URL             |
| localStorage       | (browser) | Menyimpan data user, todos, tasks, dll. secara permanen |
| Tailwind CSS       | 4.3.3   | Framework CSS untuk styling (jika digunakan)              |
| ESLint             | 10.8.0  | Alat untuk menjaga kualitas kode                          |

📁 3. STRUKTUR FOLDER & PENJELASAN
todo-list-react/
├── public/                 # File statis (favicon, dll.)
├── src/
│   ├── pages/              # SEMUA HALAMAN (15+ file)
│   │   ├── Login.jsx       # Halaman login
│   │   ├── Dashboard.jsx   # Halaman utama setelah login
│   │   ├── Todo.jsx        # Todo List sederhana (proyek awal)
│   │   ├── TaskManagement.jsx
│   │   ├── ProjectManagement.jsx
│   │   ├── MyTasks.jsx
│   │   ├── TeamManagement.jsx
│   │   ├── Milestone.jsx
│   │   ├── Checklist.jsx
│   │   ├── Search.jsx
│   │   ├── Roles.jsx       # Manajemen role & permission
│   │   ├── Settings.jsx
│   │   ├── Kanban.jsx
│   │   ├── CalendarPage.jsx
│   │   ├── Notifications.jsx
│   │   └── Analytics.jsx
│   ├── utils/
│   │   └── storage.js      # Konfigurasi key untuk localStorage
│   ├── App.jsx             # ❗ Jantung aplikasi (routing, auth, RBAC)
│   ├── App.css             # Gaya global (atau Tailwind)
│   ├── main.jsx            # Entry point (render App)
│   └── index.css           # Gaya dasar / reset CSS
├── index.html              # HTML utama
├── package.json            # Daftar dependency & script
├── vite.config.js          # Konfigurasi Vite
├── eslint.config.js        # Konfigurasi ESLint
└── README.md               # Dokumentasi proyek

🔄 4. ALUR PROGRAM (DARI AWAL SAMPAI AKHIR)

A. ENTRY POINT: src/main.jsx
Kode:
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
Penjelasan:
- File ini adalah titik masuk aplikasi.
- createRoot menghubungkan React ke elemen <div id="root"> di index.html.
- Komponen <App /> dirender di sini.

B. KOMPONEN UTAMA: src/App.jsx (Jantung Aplikasi)
App.jsx melakukan 4 tugas besar:
1. Membungkus aplikasi dengan Router
2. Mengecek status login (apakah user ada di localStorage)
3. Menentukan halaman mana yang tampil berdasarkan URL
4. Mengatur hak akses berdasarkan peran (role)

🔹 Bagian 1: Router & Hook
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
- BrowserRouter → membungkus seluruh aplikasi agar bisa menggunakan URL.
- useNavigate → untuk mengubah URL secara programatis (misal saat klik menu).
- useLocation → untuk membaca URL saat ini.

🔹 Bagian 2: State Global
const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem(STORAGE_KEYS.USER) || 
                    sessionStorage.getItem(STORAGE_KEYS.USER);
  return savedUser ? JSON.parse(savedUser) : null;
});
const [activeMenu, setActiveMenu] = useState("Dashboard");
const [sidebarOpen, setSidebarOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState("");
Penjelasan:
- user → menyimpan data pengguna yang sedang login (atau null jika belum login).
- activeMenu → menu yang sedang aktif (untuk highlight sidebar).
- sidebarOpen → state untuk toggle sidebar di mobile.
- searchQuery → menyimpan kata kunci pencarian.

🔹 Bagian 3: Sinkronisasi URL ↔ Menu
useEffect(() => {
  const path = location.pathname;
  const menu = pathToMenu[path];
  if (menu) {
    setActiveMenu(menu);
  } else {
    navigate(menuToPath.Dashboard, { replace: true });
  }
}, [location.pathname, navigate]);
Penjelasan:
Setiap kali URL berubah (misal manual ketik /todo), efek ini akan:
- Mencari menu apa yang sesuai dengan path tersebut (pakai pathToMenu).
- Jika ditemukan, set activeMenu sesuai.
- Jika tidak ditemukan, arahkan ke Dashboard.

🔹 Bagian 4: Fungsi Navigasi & Login/Logout
const handleNavigate = (menu) => {
  const path = menuToPath[menu];
  if (path) {
    navigate(path);
    setActiveMenu(menu);
    setSidebarOpen(false);
  }
};
Penjelasan:
Saat user klik menu di sidebar:
1. Cari path dari menuToPath (contoh: "Todo" → "/todo").
2. Pindah ke URL tersebut pakai navigate().
3. Update activeMenu untuk highlight menu.
4. Tutup sidebar (di mobile).

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
Penjelasan:
- handleLogin → simpan user, lalu redirect ke Dashboard.
- handleLogout → hapus data user dari storage, set state user = null, lalu redirect ke /login.

🔹 Bagian 5: Role-Based Access Control (RBAC)
const roleAccess = {
  Admin: null, // full access
  Manager: ["Dashboard", "Todo", "Task Management", "Project Management", "My Tasks", "Team Management", "Milestone", "Checklist", "Search", "Role & Permission", "Settings", "Kanban Board", "Calendar", "Notifications", "Analytics"],
  Member: ["Dashboard", "Todo", "My Tasks", "Checklist", "Search", "Kanban Board", "Calendar", "Notifications"],
};
const effectiveMenu = (() => {
  if (!user) return activeMenu;
  const role = user.role || "Member";
  if (role === "Admin") return activeMenu;
  const allowed = roleAccess[role] || [];
  return allowed.includes(activeMenu) ? activeMenu : "Dashboard";
})();
Penjelasan:
- Admin → bisa akses semua halaman.
- Manager → hanya bisa akses halaman yang terdaftar di array Manager.
- Member → hanya bisa akses halaman terbatas.
- Jika user mencoba mengakses menu yang tidak diizinkan, otomatis dialihkan ke "Dashboard".

🔹 Bagian 6: Mapping Menu ↔ Path (Kunci Utama)
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
Penjelasan:
- menuToPath → konversi nama menu menjadi URL (misal "Todo" → "/todo").
- pathToMenu → kebalikannya, dari URL ke nama menu (misal "/todo" → "Todo").
- Ini memungkinkan navigasi 2 arah: klik menu → URL berubah, dan URL berubah → menu aktif berubah.

🔹 Bagian 7: Render Halaman dengan Routes
if (!user) {
  return <Login onLogin={handleLogin} />;
}
const commonProps = { user, onLogout, onNavigate, onSearch, searchQuery, activeMenu, sidebarOpen, setSidebarOpen };
return (
  <Routes>
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
    <Route path="*" element={<Dashboard {...commonProps} />} />
  </Routes>
);
Penjelasan:
- Jika user = null → tampilkan halaman Login.
- Jika user ada → tampilkan Routes dengan semua path.
- commonProps berisi semua data dan fungsi yang dibutuhkan setiap halaman (dioper lewat props).
- path="*" → fallback: jika URL tidak dikenal, arahkan ke Dashboard.

🧩 5. CARA KERJA SETIAP HALAMAN (PAGES)
Semua halaman (Dashboard, Todo, TaskManagement, dll.) menerima props yang sama:
const commonProps = {
  user,                // data pengguna
  onLogout,            // fungsi logout
  onNavigate,          // fungsi navigasi antar menu
  onSearch,            // fungsi pencarian
  searchQuery,         // kata kunci pencarian
  activeMenu,          // menu yang sedang aktif
  sidebarOpen,         // status sidebar (mobile)
  setSidebarOpen,      // fungsi toggle sidebar
};
Contoh di Todo.jsx:
- Menggunakan user untuk menampilkan nama pengguna.
- Menggunakan onNavigate untuk pindah ke halaman lain.
- Menggunakan searchQuery untuk filter tugas.
- Menggunakan activeMenu untuk highlight menu aktif.

💾 6. PENYIMPANAN DATA (LOCALSTORAGE)
Semua data disimpan di browser dengan localStorage:
Key             | Deskripsi
----------------|-------------------------------------------
user            | Data user yang login (object)
todos           | Daftar todo (di halaman Todo)
tasks           | Daftar tugas (Task Management)
projects        | Daftar proyek
milestones      | Daftar milestone
checklists      | Daftar checklist
...dan lain-lain | Sesuai kebutuhan masing-masing halaman
Keuntungan:
- Data tetap ada meskipun browser di-refresh.
- Tidak perlu backend/database untuk tahap awal.

🧭 7. ALUR NAVIGASI LENGKAP (CONTOH)
1. User buka http://localhost:5173/
2. App.jsx cek localStorage → tidak ada user → tampilkan <Login />
3. User input username & password, klik Login
4. handleLogin dipanggil → simpan user ke localStorage → redirect ke /dashboard
5. Di /dashboard, activeMenu = "Dashboard"
6. User klik menu "Todo" di sidebar
7. handleNavigate("Todo") dipanggil → navigate("/todo") → URL berubah
8. useEffect melihat location.pathname = "/todo" → pathToMenu["/todo"] = "Todo" → set activeMenu = "Todo"
9. Halaman <Todo /> dirender dengan activeMenu = "Todo"
10. User klik Logout → handleLogout → hapus user dari localStorage → redirect ke /login

🛠️ 8. CARA MENAMBAHKAN HALAMAN BARU (JIKA DIPERLUKAN)
Jika ingin menambah halaman baru:
1. Buat file baru di src/pages/ (misal Reports.jsx).
2. Tambahkan menu ke roleAccess (Admin, Manager, atau Member).
3. Tambahkan mapping di menuToPath dan pathToMenu.
4. Tambahkan <Route> di dalam Routes.
5. Tambahkan menu tersebut di sidebar (di komponen Sidebar/Layout).

🚀 9. CARA MENJALANKAN APLIKASI (REVIEW)
# Clone dari GitHub
git clone https://github.com/nailatrisa/todo-list-react.git

# Masuk ke folder
cd todo-list-react

# Install semua dependency
npm install

# Jalankan di mode development
npm run dev

# Buka browser di http://localhost:5173

✅ 10. KESIMPULAN
Aplikasi ini adalah sistem manajemen tugas yang lengkap dengan:
| Komponen                    | Status |
|-----------------------------|--------|
| React 19 + Vite             | Modern & cepat |
| React Router DOM 7          | Routing berbasis URL |
| localStorage                | Penyimpanan permanen |
| RBAC                        | Hak akses per role |
| 15+ Halaman                 | Fitur lengkap |
| Struktur rapi               | Mudah dikembangkan |
