// Add TypeScript declaration for the _webpSupport property on window
declare global {
  interface Window {
    _webpSupport?: boolean;
  }
}

/**
 * Checks if the browser supports WebP format
 * @returns A Promise that resolves to a boolean indicating WebP support
 */
export async function supportsWebP(): Promise<boolean> {
  // If we've already checked, return the cached result
  if (typeof window._webpSupport !== 'undefined') {
    return window._webpSupport;
  }

  return new Promise((resolve) => {
    const webpImage = new Image();

    webpImage.onload = function() {
      // If the image has a natural width, WebP is supported
      const result = webpImage.width > 0 && webpImage.height > 0;
      window._webpSupport = result;
      resolve(result);
    };

    webpImage.onerror = function() {
      window._webpSupport = false;
      resolve(false);
    };

    // A small WebP image
    webpImage.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
  });
}

/**
 * Compresses an image file to reduce its size while maintaining acceptable quality
 * Follows Claude's image requirements:
 * - Low-resolution: 512px x 512px
 * - High-resolution: 768px (short side) x 2000px (long side)
 * - Converts to WebP format if supported by the browser for better compression
 *
 * @param file - The original image file to compress
 * @param maxWidth - Maximum width of the compressed image (default: 2000px)
 * @param maxHeight - Maximum height of the compressed image (default: 2000px)
 * @param quality - Image quality from 0 to 1 (default: 0.8)
 * @returns A Promise that resolves to a compressed File object
 */
export async function compressImage(
  file: File,
  maxWidth: number = 2000,
  maxHeight: number = 2000,
  quality: number = 0.8
): Promise<File> {
  // Check if WebP is supported
  const webpSupported = await supportsWebP();

  return new Promise((resolve, reject) => {
    // Create a FileReader to read the file
    const reader = new FileReader();

    // Set up the FileReader onload callback
    reader.onload = (event) => {
      // Create an image element to load the file data
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        // Ensure the short side is at least 768px for high-res images (Claude requirement)
        const shortSide = Math.min(width, height);
        const longSide = Math.max(width, height);

        // If the short side is less than 768px, scale it up to 768px
        if (shortSide < 768 && longSide < 2000) {
          const scale = 768 / shortSide;
          width = width * scale;
          height = height * scale;
        }

        // Then apply max dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Create a canvas to draw the resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        // Draw the image on the canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Determine the output format and file extension
        let outputType = 'image/jpeg';
        let fileExtension = '.jpg';

        // Use WebP if supported for better compression
        if (webpSupported) {
          outputType = 'image/webp';
          fileExtension = '.webp';
        }

        // Generate a new filename with the appropriate extension
        const fileName = file.name.replace(/\.[^/.]+$/, "") + fileExtension;

        // Convert the canvas to a Blob
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas to Blob conversion failed'));
            return;
          }

          // Create a new File from the Blob
          const compressedFile = new File(
            [blob],
            fileName,
            {
              type: outputType,
              lastModified: Date.now()
            }
          );

          resolve(compressedFile);
        }, outputType, quality);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      // Set the image source to the FileReader result
      img.src = event.target.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    // Read the file as a data URL
    reader.readAsDataURL(file);
  });
}
