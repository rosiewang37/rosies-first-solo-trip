import type { Block } from '@/data/trip';
import { mapsUrl } from '@/lib/schedule';

export function ScheduleBlock({
  block,
  time,
  isNow,
}: {
  block: Block;
  time: string;
  isNow?: boolean;
}) {
  const baseClass =
    block.type === 'travel'
      ? 'activity-slot travel-block'
      : block.type === 'free'
      ? 'activity-slot free-block'
      : 'activity-slot';
  const slotClass = isNow ? `${baseClass} is-now` : baseClass;
  const timeClass = isNow ? 'time-slot is-now' : 'time-slot';

  return (
    <>
      <div className={timeClass}>{time}</div>
      <div className={slotClass}>
        <h4>{block.title}</h4>
        {block.location ? (
          <div className="location">
            <a href={mapsUrl(block.location)} target="_blank" rel="noopener noreferrer">
              {block.location}
            </a>
          </div>
        ) : null}
        <div className="details">{block.details}</div>
        {block.tags.length > 0 ? (
          <div>
            {block.tags.map((t, i) => (
              <span key={i} className={t.type}>
                {t.text}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}
