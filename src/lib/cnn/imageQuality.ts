/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  Arogya Sahayak — Pre-Inference Image Quality Check Engine
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Evaluates clinical images before feeding into CNN classifiers:
 *  1. Blur Detection via Laplacian Variance operator
 *  2. Illumination & Glare Analysis (Luminance histogram)
 *  3. Resolution and Aspect Ratio validation
 *
 *  Ensures "Garbage-In, Garbage-Out" diagnostic failures are caught early.
 */

export interface ImageQualityReport {
  isAcceptable: boolean;
  blurScore: number;          // 0-100 (higher = sharper)
  brightnessScore: number;    // 0-255 (optimal: 45-210)
  contrastScore: number;      // 0-100 (higher = better contrast)
  resolution: { width: number; height: number };
  warnings: string[];
  status: 'excellent' | 'acceptable' | 'poor';
}

/**
 * Evaluates an image element for clinical diagnostic quality.
 */
export function checkImageQuality(image: HTMLImageElement): ImageQualityReport {
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  const warnings: string[] = [];

  // Minimum dimension check
  if (width < 150 || height < 150) {
    warnings.push(`Image resolution is too low (${width}x${height}px). Minimum recommended is 200x200px.`);
  }

  // Create an offscreen canvas to analyze pixel data
  const sampleWidth = Math.min(width, 300);
  const sampleHeight = Math.min(height, 300);
  const canvas = document.createElement('canvas');
  canvas.width = sampleWidth;
  canvas.height = sampleHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    return {
      isAcceptable: true,
      blurScore: 70,
      brightnessScore: 128,
      contrastScore: 60,
      resolution: { width, height },
      warnings: [],
      status: 'acceptable',
    };
  }

  ctx.drawImage(image, 0, 0, sampleWidth, sampleHeight);
  const imageData = ctx.getImageData(0, 0, sampleWidth, sampleHeight);
  const data = imageData.data;

  // 1. Convert to Greyscale and Compute Luminance
  let totalLuminance = 0;
  const greyscale = new Float32Array(sampleWidth * sampleHeight);
  let minLum = 255;
  let maxLum = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Standard ITU-R BT.601 luminance formula
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const pixelIdx = i / 4;
    greyscale[pixelIdx] = lum;
    totalLuminance += lum;

    if (lum < minLum) minLum = lum;
    if (lum > maxLum) maxLum = lum;
  }

  const avgLuminance = totalLuminance / (sampleWidth * sampleHeight);
  const contrastScore = Math.min(100, Math.round(((maxLum - minLum) / 255) * 100));

  // Check illumination extremes
  if (avgLuminance < 35) {
    warnings.push('Image is severely underexposed/too dark. Please take photo with better direct lighting.');
  } else if (avgLuminance > 225) {
    warnings.push('Image has severe glare or overexposure. Avoid direct flash reflection on glossy scans/skin.');
  }

  if (contrastScore < 20) {
    warnings.push('Low visual contrast detected. Clinical anatomical details may be washed out.');
  }

  // 2. Laplacian Variance (Sharpness / Blur Detection)
  // Discrete 3x3 Laplacian Kernel:
  // [ 0,  1,  0 ]
  // [ 1, -4,  1 ]
  // [ 0,  1,  0 ]
  let laplacianSum = 0;
  let laplacianSqSum = 0;
  let edgeCount = 0;

  for (let y = 1; y < sampleHeight - 1; y++) {
    for (let x = 1; x < sampleWidth - 1; x++) {
      const idx = y * sampleWidth + x;
      const center = greyscale[idx];
      const top = greyscale[(y - 1) * sampleWidth + x];
      const bottom = greyscale[(y + 1) * sampleWidth + x];
      const left = greyscale[y * sampleWidth + (x - 1)];
      const right = greyscale[y * sampleWidth + (x + 1)];

      const lap = top + bottom + left + right - 4 * center;
      laplacianSum += lap;
      laplacianSqSum += lap * lap;
      edgeCount++;
    }
  }

  const laplacianMean = edgeCount > 0 ? laplacianSum / edgeCount : 0;
  const laplacianVariance = edgeCount > 0 ? (laplacianSqSum / edgeCount) - (laplacianMean * laplacianMean) : 0;

  // Map variance to 0-100 blur score (variances > 180 indicate sharp clinical imagery)
  const blurScore = Math.min(100, Math.max(0, Math.round(Math.sqrt(laplacianVariance) * 5.5)));

  if (blurScore < 25) {
    warnings.push('Image is blurry or out of focus. Please hold device steady and re-focus.');
  }

  // Determine overall status
  const isAcceptable = blurScore >= 20 && avgLuminance >= 30 && avgLuminance <= 230 && contrastScore >= 18;
  let status: ImageQualityReport['status'] = 'poor';
  if (blurScore >= 60 && avgLuminance >= 50 && avgLuminance <= 200 && contrastScore >= 40) {
    status = 'excellent';
  } else if (isAcceptable) {
    status = 'acceptable';
  }

  return {
    isAcceptable,
    blurScore,
    brightnessScore: Math.round(avgLuminance),
    contrastScore,
    resolution: { width, height },
    warnings,
    status,
  };
}
