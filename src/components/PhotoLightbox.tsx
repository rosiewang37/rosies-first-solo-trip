'use client';

import { useEffect } from 'react';
import type { Photo } from '@/lib/photos';

export function PhotoLightbox({
  photo,
  onClose,
}: {
  photo: Photo | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!photo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [photo, onClose]);

  if (!photo) return null;

  return (
    <div className="photo-lightbox" onClick={onClose} role="dialog" aria-modal="true">
      <button type="button" className="photo-lightbox-close" aria-label="Close">×</button>
      <img src={photo.url} alt="" onClick={(e) => e.stopPropagation()} />
    </div>
  );
}
