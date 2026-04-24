export type CustomSpot = {
  id: string;
  name: string;
  parent: string;
};

const KEY = 'trip-customs';

export function getCustoms(): CustomSpot[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setCustoms(items: CustomSpot[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // quota exceeded or disabled; fail silently
  }
}
