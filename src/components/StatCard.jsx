function StatCard({
  title,
  value,
  change,
  icon,
  type,
}) {
  const styles = {
    indigo: "bg-indigo-500/10 text-indigo-400",
    green: "bg-emerald-500/10 text-emerald-400",
    yellow: "bg-amber-500/10 text-amber-400",
    red: "bg-red-500/10 text-red-400",
  };

  return (
    <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition hover:-translate-y-1 hover:border-white/10">

      <div className="flex items-start justify-between">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${styles[type]}`}
        >
          {icon}
        </div>

        <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[9px] font-bold text-emerald-400">
          {change}
        </span>

      </div>

      <p className="mt-5 text-[10px] font-bold tracking-[0.18em] text-slate-600">
        {title}
      </p>

      <p className="mt-1 text-3xl font-bold">
        {value}
      </p>

    </div>
  );
}

export default StatCard;