import type { TodoSection } from '@/data/trip';
import { ProgressBar } from './ProgressBar';

export function TodoList({
  sections,
  checks,
  onToggle,
}: {
  sections: TodoSection[];
  checks: Record<string, boolean>;
  onToggle: (id: string, checked: boolean) => void;
}) {
  const allItems = sections.flatMap((s) => s.items);
  const doneCount = allItems.filter((i) => checks[i.id]).length;
  const total = allItems.length;

  return (
    <>
      <ProgressBar label="Overall progress" done={doneCount} total={total} />
      {sections.map((sec) => (
        <div key={sec.id} className={`todo-section ${sec.className}`}>
          <h3>{sec.title}</h3>
          <div className="todo-list">
            {sec.items.map((item) => (
              <label key={item.id} className={`todo-item ${checks[item.id] ? 'done' : ''}`}>
                <input
                  type="checkbox"
                  checked={!!checks[item.id]}
                  onChange={(e) => onToggle(item.id, e.target.checked)}
                />
                <div className="todo-item-content">
                  <div className="title">{item.title}</div>
                  <div className="desc">{item.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
