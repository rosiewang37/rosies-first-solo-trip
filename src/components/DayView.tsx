import type { Day } from '@/data/trip';
import { computeBlockTimes, formatTime } from '@/lib/schedule';
import { ScheduleBlock } from './ScheduleBlock';

export function DayView({ day }: { day: Day }) {
  const times = computeBlockTimes(day);
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
          <ScheduleBlock key={block.id} block={block} time={formatTime(times[i].start)} />
        ))}
      </div>
    </>
  );
}
