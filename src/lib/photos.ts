import { getEditToken } from './editToken';
import { resizeImage } from './resize';

export type Photo = {
  id: string;
  blockId: string;
  url: string;
  uploadedAt: number;
  width: number;
  height: number;
};

export async function getPhotos(): Promise<Photo[]> {
  const res = await fetch('/api/photos', { cache: 'no-store' });
  if (!res.ok) return [];
  const data = (await res.json()) as { photos?: Photo[] };
  return data.photos ?? [];
}

export async function uploadPhoto(file: File, blockId: string): Promise<Photo> {
  const token = getEditToken();
  if (!token) throw new Error('Not authorized to upload');

  const { blob, width, height } = await resizeImage(file);

  const form = new FormData();
  form.append('file', blob, 'photo.jpg');
  form.append('blockId', blockId);
  form.append('width', String(width));
  form.append('height', String(height));

  const res = await fetch('/api/photos', {
    method: 'POST',
    headers: { 'X-Edit-Token': token },
    body: form,
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  return (await res.json()) as Photo;
}

export async function deletePhoto(id: string): Promise<void> {
  const token = getEditToken();
  if (!token) throw new Error('Not authorized to delete');
  const res = await fetch(`/api/photos/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { 'X-Edit-Token': token },
  });
  if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
}
