import useLocalStorage from "../hooks/useLocalStorage";

function ProjectSelector({ projects = [], onChange }) {
  const [selected, setSelected] = useLocalStorage("taskflow_selected_project", "");

  const handleChange = (e) => {
    const val = e.target.value;
    setSelected(val);
    if (onChange) onChange(val);
  };

  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <div>
        <label className="mb-2 block text-xs text-slate-400">Project</label>
        <select
          value={selected}
          onChange={handleChange}
          className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-2 text-sm text-white outline-none"
        >
          <option value="">-- Select Project --</option>
          {projects.map((p) => (
            <option key={p.id} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {selected && (
        <div className="text-xs text-slate-400">
          Selected: <span className="font-semibold text-white">{selected}</span>
        </div>
      )}
    </div>
  );
}

export default ProjectSelector;
