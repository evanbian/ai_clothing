// Image processing utilities

/**
 * Compress image to reduce size while maintaining quality
 */
export async function compressImage(
  dataUrl: string,
  maxSizeMB: number = 2,
  maxWidth: number = 1920,
  maxHeight: number = 1920
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      // Calculate new dimensions
      let width = img.width;
      let height = img.height;
      
      // Scale down if needed
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw the image
      ctx.drawImage(img, 0, 0, width, height);
      
      // Start with high quality
      let quality = 0.9;
      let output = canvas.toDataURL('image/jpeg', quality);
      
      // Reduce quality until size is acceptable
      while (getDataUrlSize(output) > maxSizeMB * 1024 * 1024 && quality > 0.1) {
        quality -= 0.1;
        output = canvas.toDataURL('image/jpeg', quality);
      }
      
      resolve(output);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = dataUrl;
  });
}

/**
 * Get the size of a data URL in bytes
 */
function getDataUrlSize(dataUrl: string): number {
  const base64 = dataUrl.split(',')[1];
  if (!base64) return 0;
  
  // Calculate size from base64 string
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  return (base64.length * 3) / 4 - padding;
}

/**
 * Fetch image from URL and convert to data URL
 */
export async function fetchImageAsDataUrl(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(`/api/tryon/fetch-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: imageUrl })
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }
    
    const data = await response.json();
    return data.image;
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
}

/**
 * Validate if string is a valid image data URL
 */
export function isValidDataUrl(str: string): boolean {
  return /^data:image\/(jpeg|jpg|png|gif|webp);base64,/.test(str);
}

/**
 * Extract MIME type from data URL
 */
export function getMimeType(dataUrl: string): string {
  const matches = dataUrl.match(/^data:([^;]+);/);
  return matches ? matches[1] : 'image/jpeg';
}

/**
 * Convert image file to data URL
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Validate image dimensions
 */
export async function validateImageDimensions(
  dataUrl: string,
  minWidth: number = 200,
  minHeight: number = 200,
  maxWidth: number = 4096,
  maxHeight: number = 4096
): Promise<{ valid: boolean; width: number; height: number; error?: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      const width = img.width;
      const height = img.height;
      
      if (width < minWidth || height < minHeight) {
        resolve({
          valid: false,
          width,
          height,
          error: `图片尺寸太小，最小要求 ${minWidth}x${minHeight} 像素`
        });
      } else if (width > maxWidth || height > maxHeight) {
        resolve({
          valid: false,
          width,
          height,
          error: `图片尺寸太大，最大支持 ${maxWidth}x${maxHeight} 像素`
        });
      } else {
        resolve({ valid: true, width, height });
      }
    };
    
    img.onerror = () => {
      resolve({
        valid: false,
        width: 0,
        height: 0,
        error: '无法加载图片'
      });
    };
    
    img.src = dataUrl;
  });
}

/**
 * Create a thumbnail from image data URL
 */
export async function createThumbnail(
  dataUrl: string,
  maxSize: number = 150
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      // Calculate thumbnail dimensions
      const ratio = Math.min(maxSize / img.width, maxSize / img.height);
      const width = img.width * ratio;
      const height = img.height * ratio;
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw the thumbnail
      ctx.drawImage(img, 0, 0, width, height);
      
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = dataUrl;
  });
}