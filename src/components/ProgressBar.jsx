function ProgressBar({
  value,
  label,
  color = "bg-indigo-500",
}) {
  return (
    <div>

      <div className="mb-2 flex justify-between">

        <span className="text-xs text-slate-400">
          {label}
        </span>

        <span className="text-xs text-slate-600">
          {value}%
        </span>

      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">

        <div
          className={`h-full rounded-full ${color}`}
          style={{
            width: `${value}%`,
          }}
        />

      </div>

    </div>
  );
}

export default ProgressBar;