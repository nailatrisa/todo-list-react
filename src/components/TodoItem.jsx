function TodoItem({
  todo,
  onToggle,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
}) {
  const priorityStyles = {
    Low: {
      dot: "bg-blue-400",
      text: "text-blue-400",
      bg: "bg-blue-400/10",
    },

    Medium: {
      dot: "bg-yellow-400",
      text: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },

    High: {
      dot: "bg-orange-400",
      text: "text-orange-400",
      bg: "bg-orange-400/10",
    },

    Urgent: {
      dot: "bg-red-400",
      text: "text-red-400",
      bg: "bg-red-400/10",
    },
  };

  const style =
    priorityStyles[todo.priority] ||
    priorityStyles.Medium;

  return (
    <div
      draggable
      onDragStart={() =>
        onDragStart(todo.id)
      }
      onDragOver={onDragOver}
      onDrop={() => onDrop(todo.id)}
      className={`group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition hover:border-white/[0.12] ${
        todo.completed
          ? "opacity-60"
          : ""
      }`}
    >
      <div className="flex items-start gap-3">

        {/* CHECKBOX */}

        <button
          type="button"
          onClick={() =>
            onToggle(todo.id)
          }
          className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border text-xs transition ${
            todo.completed
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-slate-600 hover:border-indigo-400"
          }`}
        >
          {todo.completed && "✓"}
        </button>

        {/* CONTENT */}

        <div className="min-w-0 flex-1">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

            <div className="min-w-0">

              <h3
                className={`text-sm font-semibold ${
                  todo.completed
                    ? "text-slate-600 line-through"
                    : "text-slate-200"
                }`}
              >
                {todo.title}
              </h3>

              {todo.description && (
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600">
                  {todo.description}
                </p>
              )}

            </div>

            {/* PRIORITY */}

            <span
              className={`flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold ${style.bg} ${style.text}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
              />

              {todo.priority}
            </span>

          </div>

          {/* META */}

          <div className="mt-4 flex flex-wrap items-center gap-4">

            {todo.deadline && (
              <span className="text-[10px] text-slate-600">
                ◷ {formatDate(todo.deadline)}
              </span>
            )}

            <span className="text-[10px] text-slate-700">
              ⋮⋮ Drag
            </span>

          </div>

        </div>

        {/* ACTIONS */}

        <div className="flex gap-1 sm:opacity-0 sm:transition sm:group-hover:opacity-100">

          <button
            type="button"
            onClick={() =>
              onEdit(todo)
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg text-xs text-slate-600 transition hover:bg-indigo-500/10 hover:text-indigo-400"
          >
            ✎
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete(todo.id)
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg text-xs text-slate-600 transition hover:bg-red-500/10 hover:text-red-400"
          >
            ×
          </button>

        </div>

      </div>
    </div>
  );
}

function formatDate(date) {
  return new Intl.DateTimeFormat(
    "id-ID",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(new Date(date));
}

export default TodoItem;