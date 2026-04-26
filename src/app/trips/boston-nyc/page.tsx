'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { days, todoSections } from '@/data/trip';
import { Nav } from '@/components/Nav';
import { DayView } from '@/components/DayView';
import { TodoList } from '@/components/TodoList';
import { NowBar } from '@/components/NowBar';
import {
  getChecks,
  setChecks as persistChecks,
  getActiveTab,
  setActiveTab as persistActiveTab,
  getExpanded,
  setExpanded as persistExpanded,
} from '@/lib/storage';
import { getCustoms, setCustoms as persistCustoms, type CustomSpot } from '@/lib/customs';
import { getNow, findActiveBlock } from '@/lib/clock';
import { captureEditTokenFromUrl, isEditor as checkIsEditor } from '@/lib/editToken';
import { getPhotos, uploadPhoto, deletePhoto, type Photo } from '@/lib/photos';

const MapsView = dynamic(() => import('@/components/MapsView'), { ssr: false });

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

  const [activeTab, setActiveTab] = useState<string>('maps');
  const [hydrated, setHydrated] = useState(false);
  const [checks, setChecksState] = useState<Record<string, boolean>>({});
  const [customs, setCustomsState] = useState<CustomSpot[]>([]);
  const [expanded, setExpandedState] = useState<Record<string, boolean>>({});
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isEditor, setIsEditor] = useState(false);

  useEffect(() => {
    captureEditTokenFromUrl();
    setIsEditor(checkIsEditor());
    setChecksState(getChecks());
    setCustomsState(getCustoms());
    setExpandedState(getExpanded());
    const saved = getActiveTab();
    const validIds = new Set(['maps', 'todos', ...days.map((d) => d.id)]);
    if (saved && validIds.has(saved)) {
      setActiveTab(saved);
    } else {
      const todayDay = days.find((d) => d.dateISO === now.dateISO);
      if (todayDay) setActiveTab(todayDay.id);
    }
    getPhotos().then(setPhotos).catch(() => setPhotos([]));
    setHydrated(true);
  }, [now.dateISO]);

  const handleToggle = (id: string, checked: boolean) => {
    const next = { ...checks, [id]: checked };
    setChecksState(next);
    persistChecks(next);
  };

  const handleAddCustom = (parent: string, name: string) => {
    const id = `custom:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
    const next = [...customs, { id, name, parent }];
    setCustomsState(next);
    persistCustoms(next);
  };

  const handleToggleExpand = (id: string) => {
    const next = { ...expanded, [id]: !expanded[id] };
    if (!next[id]) delete next[id];
    setExpandedState(next);
    persistExpanded(next);
  };

  const handleRemoveCustom = (id: string) => {
    const next = customs.filter((c) => c.id !== id);
    setCustomsState(next);
    persistCustoms(next);
    if (checks[id]) {
      const nextChecks = { ...checks };
      delete nextChecks[id];
      setChecksState(nextChecks);
      persistChecks(nextChecks);
    }
  };

  const handleUploadPhoto = async (file: File, blockId: string) => {
    const photo = await uploadPhoto(file, blockId);
    setPhotos((prev) => [...prev, photo]);
  };

  const handleDeletePhoto = async (id: string) => {
    await deletePhoto(id);
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const tabs = [
    { id: 'maps', label: 'Maps' },
    ...days.map((d) => ({ id: d.id, label: d.label })),
    { id: 'todos', label: 'To-do list' },
  ];

  const handleSwitch = (id: string) => {
    setActiveTab(id);
    persistActiveTab(id);
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
        {activeTab === 'maps' && <MapsView days={days} checks={checks} />}
        {days.map((day) =>
          activeTab === day.id ? (
            <DayView
              key={day.id}
              day={day}
              activeBlockIndex={active && active.day.id === day.id ? active.blockIndex : null}
              checks={checks}
              onToggle={handleToggle}
              customs={customs}
              onAddCustom={handleAddCustom}
              onRemoveCustom={handleRemoveCustom}
              expanded={expanded}
              onToggleExpand={handleToggleExpand}
              photos={photos}
              isEditor={isEditor}
              onUploadPhoto={handleUploadPhoto}
              onDeletePhoto={handleDeletePhoto}
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
