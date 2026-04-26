import { put, list, del } from '@vercel/blob';
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

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!checkToken(req)) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { id } = await ctx.params;
  const photos = await readManifest();
  const target = photos.find((p) => p.id === id);
  if (!target) {
    return new Response('Not found', { status: 404 });
  }

  try {
    await del(target.url);
  } catch {
    // blob already gone or unreachable; still drop the manifest entry
  }

  await writeManifest(photos.filter((p) => p.id !== id));
  return Response.json({ ok: true });
}
