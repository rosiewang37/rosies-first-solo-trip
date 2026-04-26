export function computeResizedDimensions(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
): { width: number; height: number } {
  if (srcWidth <= maxWidth) {
    return { width: srcWidth, height: srcHeight };
  }
  const ratio = maxWidth / srcWidth;
  return {
    width: maxWidth,
    height: Math.round(srcHeight * ratio),
  };
}

export async function resizeImage(
  file: File,
  maxWidth = 1600,
  quality = 0.85,
): Promise<{ blob: Blob; width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  try {
    const { width, height } = computeResizedDimensions(bitmap.width, bitmap.height, maxWidth);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available');
    ctx.drawImage(bitmap, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality),
    );
    if (!blob) throw new Error('Canvas toBlob returned null');
    return { blob, width, height };
  } finally {
    bitmap.close();
  }
}
