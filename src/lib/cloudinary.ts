type TransformOptions = {
  width?: number;
  height?: number;
  crop?: 'limit' | 'fill' | 'fit' | 'pad' | 'thumb';
  gravity?: string;
  format?: 'auto' | 'webp' | 'avif' | 'png' | 'jpg';
  quality?: 'auto' | 'auto:good' | 'auto:best' | string;
  dpr?: 'auto' | number;
};

export function cloudinaryUrl(src: string, options: TransformOptions = {}) {
  const transforms = [
    `f_${options.format ?? 'auto'}`,
    `q_${options.quality ?? 'auto'}`,
    `c_${options.crop ?? 'limit'}`,
  ];

  if (options.gravity) transforms.push(`g_${options.gravity}`);
  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.dpr) transforms.push(`dpr_${options.dpr}`);

  return src.replace('/upload/', `/upload/${transforms.join(',')}/`);
}

export function cloudinarySrcSet(src: string, widths: number[], options: Omit<TransformOptions, 'width'> = {}) {
  return widths.map((width) => `${cloudinaryUrl(src, { ...options, width })} ${width}w`).join(', ');
}
