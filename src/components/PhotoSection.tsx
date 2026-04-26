'use client';

import { useRef, useState } from 'react';
import type { Photo } from '@/lib/photos';
import { PhotoLightbox } from './PhotoLightbox';

export function PhotoSection({
  blockId,
  photos,
  isEditor,
  onUpload,
  onDelete,
}: {
  blockId: string;
  photos: Photo[];
  isEditor: boolean;
  onUpload: (file: File, blockId: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const libraryRef = useRef<HTMLInputElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  if (photos.length === 0 && !isEditor) return null;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        await onUpload(file, blockId);
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed. Try again?');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this photo?')) return;
    try {
      await onDelete(id);
    } catch (err) {
      console.error(err);
      alert('Delete failed. Try again?');
    }
  };

  return (
    <div className="photo-section">
      <div className="photo-grid">
        {photos.map((p) => (
          <div key={p.id} className="photo-tile">
            <button
              type="button"
              className="photo-thumb"
              onClick={() => setLightbox(p)}
              aria-label="View photo"
            >
              <img src={p.url} alt="" loading="lazy" />
            </button>
            {isEditor ? (
              <button
                type="button"
                className="photo-delete"
                onClick={() => handleDelete(p.id)}
                aria-label="Delete photo"
              >
                ×
              </button>
            ) : null}
          </div>
        ))}
        {isEditor ? (
          <div className="photo-add-wrap">
            <button
              type="button"
              className="photo-add-button"
              onClick={() => setPopoverOpen((v) => !v)}
              disabled={busy}
              aria-label="Add photo"
              aria-expanded={popoverOpen}
            >
              {busy ? '…' : '+'}
            </button>
            {popoverOpen ? (
              <div className="photo-add-popover" role="menu">
                <button
                  type="button"
                  onClick={() => {
                    setPopoverOpen(false);
                    cameraRef.current?.click();
                  }}
                >
                  Take photo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPopoverOpen(false);
                    libraryRef.current?.click();
                  }}
                >
                  Choose from library
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <input
        ref={libraryRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />

      <PhotoLightbox photo={lightbox} onClose={() => setLightbox(null)} />
    </div>
  );
}
