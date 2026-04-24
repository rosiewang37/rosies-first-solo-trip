'use client';

import { useState } from 'react';
import type { CustomSpot } from '@/lib/customs';
import { mapsUrl } from '@/lib/schedule';

export function CustomSpots({
  parent,
  items,
  checks,
  onToggle,
  onAdd,
  onRemove,
  placeholder,
}: {
  parent: string;
  items: CustomSpot[];
  checks: Record<string, boolean>;
  onToggle: (id: string, checked: boolean) => void;
  onAdd: (parent: string, name: string) => void;
  onRemove: (id: string) => void;
  placeholder: string;
}) {
  const [text, setText] = useState('');
  const mine = items.filter((i) => i.parent === parent);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = text.trim();
    if (!name) return;
    onAdd(parent, name);
    setText('');
  };

  return (
    <div className="custom-spots">
      {mine.length > 0 ? (
        <ul className="custom-list">
          {mine.map((item) => {
            const done = !!checks[item.id];
            return (
              <li key={item.id} className={`custom-item${done ? ' done' : ''}`}>
                <input
                  type="checkbox"
                  checked={done}
                  onChange={(e) => onToggle(item.id, e.target.checked)}
                  aria-label={`Mark ${item.name} visited`}
                />
                <a
                  href={mapsUrl(item.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="custom-name"
                >
                  {item.name}
                </a>
                <button
                  type="button"
                  className="custom-remove"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => onRemove(item.id)}
                >
                  ×
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
      <form className="custom-add" onSubmit={submit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
        />
        <button type="submit" disabled={!text.trim()}>
          Add
        </button>
      </form>
    </div>
  );
}
