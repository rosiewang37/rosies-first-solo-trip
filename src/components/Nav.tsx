type NavTab = { id: string; label: string };

export function Nav({
  tabs,
  active,
  onSwitch,
}: {
  tabs: NavTab[];
  active: string;
  onSwitch: (id: string) => void;
}) {
  return (
    <nav>
      {tabs.map((t) => (
        <button
          key={t.id}
          className={active === t.id ? 'active' : ''}
          onClick={() => onSwitch(t.id)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}
