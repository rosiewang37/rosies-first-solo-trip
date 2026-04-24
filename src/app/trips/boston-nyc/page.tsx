'use client';

import { useEffect, useState } from 'react';
import { days, todoSections } from '@/data/trip';
import { Nav } from '@/components/Nav';
import { Overview } from '@/components/Overview';
import { DayView } from '@/components/DayView';
import { TodoList } from '@/components/TodoList';
import { getChecks, setChecks as persistChecks } from '@/lib/storage';

export default function BostonNYCPage() {
  const [active, setActive] = useState<string>('overview');
  const [checks, setChecksState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setChecksState(getChecks());
  }, []);

  const handleToggle = (id: string, checked: boolean) => {
    const next = { ...checks, [id]: checked };
    setChecksState(next);
    persistChecks(next);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    ...days.map((d) => ({ id: d.id, label: d.label })),
    { id: 'todos', label: 'To-do list' },
  ];

  const allItems = todoSections.flatMap((s) => s.items);
  const doneCount = allItems.filter((i) => checks[i.id]).length;

  const handleSwitch = (id: string) => {
    setActive(id);
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  };

  return (
    <>
      <header>
        <h1>Boston + NYC trip</h1>
        <p>Saturday April 25 to Saturday May 2, 2026 · 8 days</p>
      </header>
      <Nav tabs={tabs} active={active} onSwitch={handleSwitch} />
      <main>
        {active === 'overview' && <Overview doneCount={doneCount} total={allItems.length} />}
        {days.map((day) => (active === day.id ? <DayView key={day.id} day={day} /> : null))}
        {active === 'todos' && (
          <TodoList sections={todoSections} checks={checks} onToggle={handleToggle} />
        )}
      </main>
    </>
  );
}
