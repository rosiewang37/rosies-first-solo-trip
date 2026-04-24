'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { days, todoSections } from '@/data/trip';
import { Nav } from '@/components/Nav';
import { Overview } from '@/components/Overview';
import { DayView } from '@/components/DayView';
import { TodoList } from '@/components/TodoList';
import { NowBar } from '@/components/NowBar';
import { getChecks, setChecks as persistChecks } from '@/lib/storage';
import { getNow, findActiveBlock } from '@/lib/clock';

export default function BostonNYCPage() {
  return (
    <Suspense fallback={null}>
      <BostonNYCInner />
    </Suspense>
  );
}

function BostonNYCInner() {
  const searchParams = useSearchParams();
  const nowOverride = searchParams.get('now');

  const now = useMemo(() => getNow(nowOverride), [nowOverride]);
  const active = useMemo(() => findActiveBlock(days, now), [now]);

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [hydrated, setHydrated] = useState(false);
  const [checks, setChecksState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setChecksState(getChecks());
    const todayDay = days.find((d) => d.dateISO === now.dateISO);
    if (todayDay) setActiveTab(todayDay.id);
    setHydrated(true);
  }, [now.dateISO]);

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
    setActiveTab(id);
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  };

  const showNowBar = hydrated && active && active.day.id === activeTab;

  return (
    <>
      <header>
        <h1>Boston + NYC trip</h1>
        <p>Saturday April 25 to Saturday May 2, 2026 · 8 days</p>
      </header>
      <Nav tabs={tabs} active={activeTab} onSwitch={handleSwitch} />
      {showNowBar && active ? (
        <NowBar day={active.day} blockIndex={active.blockIndex} />
      ) : null}
      <main>
        {activeTab === 'overview' && <Overview doneCount={doneCount} total={allItems.length} />}
        {days.map((day) =>
          activeTab === day.id ? (
            <DayView
              key={day.id}
              day={day}
              activeBlockIndex={active && active.day.id === day.id ? active.blockIndex : null}
              checks={checks}
              onToggle={handleToggle}
            />
          ) : null
        )}
        {activeTab === 'todos' && (
          <TodoList sections={todoSections} checks={checks} onToggle={handleToggle} />
        )}
      </main>
    </>
  );
}
