const KEY = 'edit-token';

export function getEditToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function isEditor(): boolean {
  return !!getEditToken();
}

export function captureEditTokenFromUrl(): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  const token = url.searchParams.get('edit');
  if (!token) return;
  try {
    localStorage.setItem(KEY, token);
  } catch {
    // quota exceeded or disabled; fail silently
  }
  url.searchParams.delete('edit');
  window.history.replaceState({}, '', url.toString());
}
