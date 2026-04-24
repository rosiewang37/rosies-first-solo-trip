const CHECKS_KEY = 'trip-checks';

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
