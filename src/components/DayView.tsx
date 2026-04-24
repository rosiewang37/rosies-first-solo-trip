import type { Day } from '@/data/trip';
import { computeBlockTimes, formatTime, mapsUrl } from '@/lib/schedule';
import { ScheduleBlock } from './ScheduleBlock';

export function DayView({
  day,
  activeBlockIndex,
  checks,
  onToggle,
}: {
  day: Day;
  activeBlockIndex?: number | null;
  checks: Record<string, boolean>;
  onToggle: (id: string, checked: boolean) => void;
}) {
  const times = computeBlockTimes(day);
  const optional = day.optionalVisits ?? [];
  return (
    <>
      <div className="day-header">
        <div>
          <h2>{day.title}</h2>
          <div className="date">{day.date}</div>
        </div>
        <div className="city">{day.city}</div>
      </div>
      <div className="schedule-grid">
        {day.blocks.map((block, i) => (
          <ScheduleBlock
            key={block.id}
            block={block}
            time={formatTime(times[i].start)}
            isNow={i === activeBlockIndex}
            checks={checks}
            onToggle={onToggle}
          />
        ))}
      </div>

      {optional.length > 0 ? (
        <section className="optional-visits">
          <h3>Optional nearby stops</h3>
          <p className="optional-intro">Spare time? Tap to open in Maps, or check one off if you visit.</p>
          <ul className="optional-list">
            {optional.map((loc) => {
              const id = `${day.id}:opt:${loc.address}`;
              const done = !!checks[id];
              return (
                <li key={id} className={`optional-item${done ? ' done' : ''}`}>
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={(e) => onToggle(id, e.target.checked)}
                    aria-label={`Mark ${loc.name} visited`}
                  />
                  <div className="optional-content">
                    <a href={mapsUrl(loc.address)} target="_blank" rel="noopener noreferrer" className="optional-name">
                      {loc.name}
                    </a>
                    <div className="optional-address">{loc.address}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </>
  );
}
