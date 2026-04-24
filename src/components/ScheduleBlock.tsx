'use client';

import { useState } from 'react';
import type { Block, Location } from '@/data/trip';
import { mapsUrl } from '@/lib/schedule';

export function ScheduleBlock({
  block,
  time,
  isNow,
  checks,
  onToggle,
}: {
  block: Block;
  time: string;
  isNow?: boolean;
  checks: Record<string, boolean>;
  onToggle: (id: string, checked: boolean) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const kind = block.kind;
  const baseClass =
    kind === 'travel'
      ? 'activity-slot travel-block'
      : kind === 'free'
      ? 'activity-slot free-block'
      : 'activity-slot';
  const slotClass = [baseClass, isNow ? 'is-now' : '', expanded ? 'is-expanded' : ''].filter(Boolean).join(' ');
  const timeClass = isNow ? 'time-slot is-now' : 'time-slot';

  const subs = kind === 'eat' ? block.eating?.picks ?? [] : block.locations ?? [];

  return (
    <>
      <div className={timeClass}>{time}</div>
      <div className={slotClass}>
        <button
          type="button"
          className="block-title-button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          <h4>
            {kind === 'eat' && block.eating ? `${block.title} · ${block.eating.area}` : block.title}
          </h4>
          <span className={`caret ${expanded ? 'open' : ''}`} aria-hidden="true">▸</span>
        </button>

        {expanded ? (
          <div className="block-body">
            {block.details ? <div className="details">{block.details}</div> : null}

            {kind === 'eat' && block.eating ? (
              <ul className="sub-list">
                {block.eating.picks.map((r) => (
                  <SubItem
                    key={`${block.id}:${r.address}`}
                    id={`${block.id}:${r.address}`}
                    name={r.name}
                    address={r.address}
                    why={r.why}
                    checked={!!checks[`${block.id}:${r.address}`]}
                    onToggle={onToggle}
                  />
                ))}
              </ul>
            ) : null}

            {kind !== 'eat' && subs.length > 0 ? (
              <ul className="sub-list">
                {(subs as Location[]).map((loc) => (
                  <SubItem
                    key={`${block.id}:${loc.address}`}
                    id={`${block.id}:${loc.address}`}
                    name={loc.name}
                    address={loc.address}
                    checked={!!checks[`${block.id}:${loc.address}`]}
                    onToggle={onToggle}
                  />
                ))}
              </ul>
            ) : null}

            {block.tags.length > 0 ? (
              <div className="tag-row">
                {block.tags.map((t, i) => (
                  <span key={i} className={t.type}>
                    {t.text}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  );
}

function SubItem({
  id,
  name,
  address,
  why,
  checked,
  onToggle,
}: {
  id: string;
  name: string;
  address: string;
  why?: string;
  checked: boolean;
  onToggle: (id: string, checked: boolean) => void;
}) {
  return (
    <li className={`sub-item${checked ? ' done' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onToggle(id, e.target.checked)}
        aria-label={`Mark ${name} done`}
      />
      <div className="sub-content">
        <a href={mapsUrl(address)} target="_blank" rel="noopener noreferrer" className="sub-name">
          {name}
        </a>
        <div className="sub-address">{address}</div>
        {why ? <div className="sub-why">{why}</div> : null}
      </div>
    </li>
  );
}

