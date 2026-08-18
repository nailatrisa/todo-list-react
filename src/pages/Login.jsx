import { useState } from "react";
import { STORAGE_KEYS } from "../utils/storage";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const demoAccounts = [
    {
      role: "Admin",
      email: "admin@taskflow.com",
      password: "admin123",
    },
    {
      role: "Manager",
      email: "manager@taskflow.com",
      password: "manager123",
    },
    {
      role: "Member",
      email: "member@taskflow.com",
      password: "member123",
    },
  ];

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const account = demoAccounts.find(
        (user) =>
          user.email.toLowerCase() === email.toLowerCase() &&
          user.password === password
      );

      if (!account) {
        setError("Email atau password tidak sesuai.");
        setLoading(false);
        return;
      }

      const user = {
        id: Date.now(),
        name:
          account.role === "Admin"
            ? "Administrator"
            : account.role === "Manager"
              ? "Project Manager"
              : "Team Member",
        email: account.email,
        role: account.role,
      };

      if (rememberMe) {
        localStorage.setItem(
          STORAGE_KEYS.USER,
          JSON.stringify(user)
        );
      } else {
        sessionStorage.setItem(
          STORAGE_KEYS.USER,
          JSON.stringify(user)
        );
      }

      onLogin(user);

      setLoading(false);
    }, 700);
  };

  const useDemoAccount = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#080b16] text-white">

      <div className="relative min-h-screen">

        {/* Decorative Background */}

        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px]" />

        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[100px]" />

        {/* Grid */}

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">

          {/* LEFT SIDE */}

          <section className="hidden flex-col justify-between px-10 py-10 lg:flex xl:px-16">

            <div>
              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-lg font-bold shadow-lg">
                  TF
                </div>

                <div>
                  <p className="text-sm font-bold tracking-wide">
                    NEXORA SOLUTIONS
                  </p>

                  <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                    Workspace
                  </p>
                </div>

              </div>
            </div>

            <div className="max-w-xl">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/5 px-3 py-1.5 text-xs text-indigo-300">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                Workspace online
              </div>

              <h1 className="text-5xl font-bold leading-[1.05] tracking-[-0.04em] xl:text-6xl">
                Work smarter.
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  Move faster.
                </span>
              </h1>

              <p className="mt-7 max-w-lg text-base leading-7 text-slate-400">
                Satu ruang kerja untuk mengelola task,
                project, tim, deadline, dan progress
                pekerjaan tanpa membuat workflow menjadi
                rumit.
              </p>

              {/* Feature Cards */}

              <div className="mt-10 grid grid-cols-2 gap-3">

                <Feature
                  icon="01"
                  title="Task Control"
                  description="Atur pekerjaan dan prioritas."
                />

                <Feature
                  icon="02"
                  title="Team Flow"
                  description="Pantau pekerjaan setiap anggota."
                />

                <Feature
                  icon="03"
                  title="Project Pulse"
                  description="Lihat progress secara real-time."
                />

                <Feature
                  icon="04"
                  title="Smart Planning"
                  description="Deadline dan milestone lebih teratur."
                />

              </div>

            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-6 text-xs text-slate-600">
              <span>© 2026 Nexora Solutions</span>
              <span>Business Todo & Task Management</span>
            </div>

          </section>

          {/* RIGHT SIDE */}

          <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:border-l lg:border-white/10">

            <div className="w-full max-w-md">

              {/* Mobile Logo */}

              <div className="mb-8 flex items-center gap-3 lg:hidden">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold">
                  TF
                </div>

                <div>
                  <p className="text-sm font-bold">
                    NEXORA SOLUTIONS
                  </p>

                  <p className="text-[10px] uppercase tracking-widest text-slate-500">
                    Workspace
                  </p>
                </div>

              </div>

              {/* Login Card */}

              <div className="rounded-[28px] border border-white/10 bg-white/[0.055] p-6 shadow-2xl backdrop-blur-2xl sm:p-8">

                <div className="mb-8">

                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
                    Welcome back
                  </p>

                  <h2 className="text-3xl font-bold tracking-tight">
                    Sign in
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Masuk ke workspace untuk melanjutkan
                    pekerjaanmu.
                  </p>

                </div>

                <form
                  onSubmit={handleLogin}
                  className="space-y-5"
                >

                  {/* EMAIL */}

                  <div>

                    <label className="mb-2 block text-xs font-semibold text-slate-400">
                      EMAIL
                    </label>

                    <div className="group flex h-12 items-center rounded-xl border border-white/10 bg-black/20 px-4 transition focus-within:border-indigo-500/70 focus-within:bg-black/30">

                      <span className="mr-3 text-slate-600">
                        @
                      </span>

                      <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        placeholder="you@company.com"
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-700"
                      />

                    </div>

                  </div>

                  {/* PASSWORD */}

                  <div>

                    <div className="mb-2 flex justify-between">

                      <label className="block text-xs font-semibold text-slate-400">
                        PASSWORD
                      </label>

                      <button
                        type="button"
                        className="text-xs text-indigo-400 hover:text-indigo-300"
                      >
                        Forgot?
                      </button>

                    </div>

                    <div className="flex h-12 items-center rounded-xl border border-white/10 bg-black/20 px-4 transition focus-within:border-indigo-500/70">

                      <span className="mr-3 text-slate-600">
                        •••
                      </span>

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        placeholder="Enter your password"
                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-700"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="ml-2 text-xs text-slate-500 hover:text-white"
                      >
                        {showPassword
                          ? "Hide"
                          : "Show"}
                      </button>

                    </div>

                  </div>

                  {/* REMEMBER */}

                  <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-500">

                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) =>
                        setRememberMe(
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 rounded border-white/20 bg-black/30 accent-indigo-500"
                    />

                    Remember this device

                  </label>

                  {/* ERROR */}

                  {error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-300">
                      {error}
                    </div>
                  )}

                  {/* LOGIN */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 font-semibold shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:shadow-indigo-600/30 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    <span className="relative z-10">
                      {loading
                        ? "Signing in..."
                        : "Sign in to workspace →"}
                    </span>

                    <div className="absolute inset-0 -translate-x-full bg-white/10 transition group-hover:translate-x-0" />

                  </button>

                </form>

                {/* DEMO */}

                <div className="mt-7 border-t border-white/10 pt-6">

                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                    Demo accounts
                  </p>

                  <div className="space-y-2">

                    {demoAccounts.map((account) => (
                      <button
                        key={account.role}
                        type="button"
                        onClick={() =>
                          useDemoAccount(account)
                        }
                        className="flex w-full items-center justify-between rounded-xl border border-white/5 bg-black/10 px-3 py-2.5 text-left transition hover:border-indigo-500/20 hover:bg-white/[0.04]"
                      >

                        <div>
                          <p className="text-xs font-semibold text-slate-300">
                            {account.role}
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-600">
                            {account.email}
                          </p>
                        </div>

                        <span className="text-[10px] text-indigo-400">
                          Use
                        </span>

                      </button>
                    ))}

                  </div>

                </div>

              </div>

              <p className="mt-5 text-center text-[10px] text-slate-600">
                Your workspace data is stored locally
                for this project.
              </p>

            </div>

          </section>

        </div>

      </div>

    </main>
  );
}

function Feature({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-4 transition hover:border-white/10 hover:bg-white/[0.04]">

      <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-[9px] font-bold text-indigo-300">
        {icon}
      </div>

      <h3 className="text-xs font-semibold text-slate-300">
        {title}
      </h3>

      <p className="mt-1 text-[10px] leading-5 text-slate-600">
        {description}
      </p>

    </div>
  );
}

export default Login;