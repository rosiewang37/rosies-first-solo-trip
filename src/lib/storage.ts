const CHECKS_KEY = 'trip-checks';
const ACTIVE_TAB_KEY = 'trip-active-tab';

export function getChecks(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(CHECKS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setChecks(checks: Record<string, boolean>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CHECKS_KEY, JSON.stringify(checks));
  } catch {
    // quota exceeded or disabled; fail silently
  }
}

export function getActiveTab(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(ACTIVE_TAB_KEY);
  } catch {
    return null;
  }
}

export function setActiveTab(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACTIVE_TAB_KEY, id);
  } catch {
    // quota exceeded or disabled; fail silently
  }
}
