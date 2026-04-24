export function ProgressBar({
  label,
  done,
  total,
}: {
  label: string;
  done: number;
  total: number;
}) {
  const pct = total ? Math.round((100 * done) / total) : 0;
  return (
    <div className="progress-wrapper">
      <div className="progress-label">
        <span>{label}</span>
        <span>
          {done} of {total} done ({pct}%)
        </span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
