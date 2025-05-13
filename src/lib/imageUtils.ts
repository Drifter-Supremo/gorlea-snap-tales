/**
 * Compresses an image file to reduce its size while maintaining acceptable quality
 * Follows OpenAI's image requirements:
 * - Low-resolution: 512px x 512px
 * - High-resolution: 768px (short side) x 2000px (long side)
 *
 * @param file - The original image file to compress
 * @param maxWidth - Maximum width of the compressed image (default: 2000px)
 * @param maxHeight - Maximum height of the compressed image (default: 2000px)
 * @param quality - JPEG quality from 0 to 1 (default: 0.8)
 * @returns A Promise that resolves to a compressed File object
 */
export async function compressImage(
  file: File,
  maxWidth: number = 2000,
  maxHeight: number = 2000,
  quality: number = 0.8
): Promise<File> {
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

        // Ensure the short side is at least 768px for high-res images (OpenAI requirement)
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

        // Convert the canvas to a Blob
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas to Blob conversion failed'));
            return;
          }

          // Create a new File from the Blob
          const compressedFile = new File(
            [blob],
            file.name,
            {
              type: 'image/jpeg',
              lastModified: Date.now()
            }
          );

          resolve(compressedFile);
        }, 'image/jpeg', quality);
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
