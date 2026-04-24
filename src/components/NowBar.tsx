import type { Day } from '@/data/trip';
import { computeBlockTimes, formatTime } from '@/lib/schedule';

export function NowBar({ day, blockIndex }: { day: Day; blockIndex: number }) {
  const times = computeBlockTimes(day);
  const nowBlock = day.blocks[blockIndex];
  const nextBlock = day.blocks[blockIndex + 1];
  const nextStart = times[blockIndex + 1]?.start;

  return (
    <div className="now-bar">
      <div className="now-bar-item">
        <span className="now-bar-label">Now</span>
        <span className="now-bar-title">{nowBlock.title}</span>
      </div>
      {nextBlock ? (
        <div className="now-bar-item">
          <span className="now-bar-label">Next · {formatTime(nextStart)}</span>
          <span className="now-bar-title">{nextBlock.title}</span>
        </div>
      ) : null}
    </div>
  );
}
