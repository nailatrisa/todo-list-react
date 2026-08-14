import { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import useLocalStorage from "../hooks/useLocalStorage";
import { createId } from "../utils/storage";

function TeamManagement({ user, onLogout, onNavigate, activeMenu, sidebarOpen, setSidebarOpen, onSearch, searchQuery }) {
  const [tasks] = useLocalStorage("taskflow_tasks", []);
  const activeState = activeMenu || "Team Management";

  const [teamMembers, setTeamMembers] = useLocalStorage("taskflow_team", [
    { id: createId(), name: "Alya", role: "Product Lead", focus: "Strategy", email: "alya@company.com", department: "Product", position: "Lead", status: "Active", projects: ["Website Sekolah"] },
    { id: createId(), name: "Rian", role: "Developer", focus: "Frontend", email: "rian@company.com", department: "Engineering", position: "Frontend Dev", status: "Active", projects: ["Website Sekolah"] },
    { id: createId(), name: "Nadia", role: "Designer", focus: "UI/UX", email: "nadia@company.com", department: "Design", position: "UI/UX", status: "Active", projects: ["Website Sekolah"] },
    { id: createId(), name: "Doni", role: "QA", focus: "Testing", email: "doni@company.com", department: "Quality", position: "QA", status: "Active", projects: ["Website Sekolah"] },
  ]);

  const [newMember, setNewMember] = useState({ name: "", role: "Member", focus: "", email: "", department: "", position: "", status: "Active", projects: [] });

  const teamMembersWithWorkload = useMemo(() => {
    return teamMembers.map((member) => ({
      ...member,
      workload: tasks.filter((task) => (task.assignee || "").toLowerCase() === member.name.toLowerCase()).length,
    }));
  }, [teamMembers, tasks]);

  const [selectedProject] = useLocalStorage("taskflow_selected_project", "");

  const filteredByProject = selectedProject
    ? teamMembersWithWorkload.filter((m) => (m.projects || []).includes(selectedProject))
    : teamMembersWithWorkload;

  const handleAddMember = (e) => {
    e.preventDefault();

    if (!newMember.name.trim()) {
      alert("Nama anggota wajib diisi");
      return;
    }

    setTeamMembers((current) => [
      { id: createId(), ...newMember },
      ...current,
    ]);

    setNewMember({ name: "", role: "Member", focus: "" });
  };

  const handleRemoveMember = (id) => {
    const confirmed = window.confirm("Hapus anggota tim ini?");
    if (!confirmed) return;
    setTeamMembers((current) => current.filter((m) => m.id !== id));
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

        <div className="mx-auto max-w-[1500px] p-5 sm:p-8">
          <div className="mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">TEAM</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Team Management</h1>
            <p className="mt-2 text-sm text-slate-600">Pantau pembagian pekerjaan dan beban kerja tim secara jelas.</p>
          </div>

          <div className="mb-6 rounded-2xl border border-white/[0.07] bg-white/[0.015] p-4">
            <form onSubmit={handleAddMember} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  value={newMember.name}
                  onChange={(e) => setNewMember((s) => ({ ...s, name: e.target.value }))}
                  placeholder="Nama anggota"
                  className="rounded-xl border border-white/[0.07] bg-black/20 px-4 py-2 text-xs text-white outline-none"
                />

                <input
                  value={newMember.email}
                  onChange={(e) => setNewMember((s) => ({ ...s, email: e.target.value }))}
                  placeholder="Email"
                  className="rounded-xl border border-white/[0.07] bg-black/20 px-4 py-2 text-xs text-white outline-none"
                />

                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember((s) => ({ ...s, role: e.target.value }))}
                  className="rounded-xl border border-white/[0.07] bg-black/20 px-4 py-2 text-xs text-white outline-none"
                >
                  <option>Member</option>
                  <option>Manager</option>
                  <option>Admin</option>
                </select>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  value={newMember.department}
                  onChange={(e) => setNewMember((s) => ({ ...s, department: e.target.value }))}
                  placeholder="Department"
                  className="rounded-xl border border-white/[0.07] bg-black/20 px-4 py-2 text-xs text-white outline-none"
                />

                <input
                  value={newMember.position}
                  onChange={(e) => setNewMember((s) => ({ ...s, position: e.target.value }))}
                  placeholder="Position"
                  className="rounded-xl border border-white/[0.07] bg-black/20 px-4 py-2 text-xs text-white outline-none"
                />

                <select
                  value={newMember.status}
                  onChange={(e) => setNewMember((s) => ({ ...s, status: e.target.value }))}
                  className="rounded-xl border border-white/[0.07] bg-black/20 px-4 py-2 text-xs text-white outline-none"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold hover:bg-indigo-500">
                  Add Member
                </button>
              </div>
            </form>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {filteredByProject.map((member) => (
              <div key={member.id} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-sm font-bold text-indigo-400">
                    {member.name.charAt(0)}
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] text-emerald-400">
                    {member.workload} tasks
                  </span>
                </div>
                <h2 className="mt-4 text-base font-semibold">{member.name}</h2>
                <p className="mt-1 text-xs text-slate-600">{member.role}</p>
                <p className="mt-3 text-xs text-slate-500">Focus: {member.focus}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => handleRemoveMember(member.id)} className="rounded-lg px-3 py-2 text-[10px] text-slate-600 hover:bg-red-500/10 hover:text-red-400">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default TeamManagement;