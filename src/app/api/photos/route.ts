import { put, list } from '@vercel/blob';
import { timingSafeEqual } from 'node:crypto';
import type { Photo } from '@/lib/photos';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MANIFEST_PATHNAME = 'manifest.json';

function checkToken(req: Request): boolean {
  const provided = req.headers.get('X-Edit-Token') ?? '';
  const expected = process.env.EDIT_TOKEN ?? '';
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

async function readManifest(): Promise<Photo[]> {
  const { blobs } = await list({ prefix: MANIFEST_PATHNAME, limit: 1 });
  const entry = blobs.find((b) => b.pathname === MANIFEST_PATHNAME);
  if (!entry) return [];
  const res = await fetch(entry.url, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = (await res.json()) as Photo[] | unknown;
  return Array.isArray(data) ? (data as Photo[]) : [];
}

async function writeManifest(photos: Photo[]): Promise<void> {
  await put(MANIFEST_PATHNAME, JSON.stringify(photos), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}

export async function GET() {
  const photos = await readManifest();
  return Response.json(
    { photos },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

export async function POST(req: Request) {
  if (!checkToken(req)) {
    return new Response('Unauthorized', { status: 401 });
  }

  const form = await req.formData();
  const file = form.get('file');
  const blockId = form.get('blockId');
  const widthRaw = form.get('width');
  const heightRaw = form.get('height');

  if (!(file instanceof Blob) || typeof blockId !== 'string' || !blockId) {
    return new Response('Bad request', { status: 400 });
  }

  const width = typeof widthRaw === 'string' ? Number(widthRaw) : 0;
  const height = typeof heightRaw === 'string' ? Number(heightRaw) : 0;

  const id = `photo:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  const pathname = `photos/${blockId}/${id}.jpg`;

  const uploaded = await put(pathname, file, {
    access: 'public',
    contentType: 'image/jpeg',
    addRandomSuffix: false,
  });

  const photo: Photo = {
    id,
    blockId,
    url: uploaded.url,
    uploadedAt: Date.now(),
    width: Number.isFinite(width) ? width : 0,
    height: Number.isFinite(height) ? height : 0,
  };

  const photos = await readManifest();
  photos.push(photo);
  await writeManifest(photos);

  return Response.json(photo);
}
