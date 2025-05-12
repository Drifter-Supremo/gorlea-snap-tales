/**
 * Uploads a file to Cloudinary using unsigned upload
 *
 * @param file - The file to upload (from input or drag-and-drop)
 * @param uid - User ID to organize uploads in user-specific folders
 * @returns A Promise that resolves to the secure URL of the uploaded image
 * @throws Error if the upload fails
 */
export async function uploadToCloudinary(file: File, uid: string) {
  // Validate environment variables
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET;

  if (!cloudName) {
    throw new Error("Cloudinary cloud name is not configured. Please check your environment variables.");
  }

  if (!uploadPreset) {
    throw new Error("Cloudinary upload preset is not configured. Please check your environment variables.");
  }

  try {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", uploadPreset);
    form.append("folder", `users/${uid}`);

    console.log(`Uploading to Cloudinary: ${url} with preset: ${uploadPreset}`);

    const response = await fetch(url, { method: "POST", body: form });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudinary upload failed:", errorText);
      throw new Error(`Cloudinary upload failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as CloudinaryUploadResponse;
    console.log("Cloudinary upload successful:", data.public_id);
    return data.secure_url;
  } catch (error) {
    console.error("Error in uploadToCloudinary:", error);
    throw new Error(`Cloudinary upload error: ${error.message}`);
  }
}

/**
 * Response type from Cloudinary upload API
 */
export interface CloudinaryUploadResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  access_mode: string;
  original_filename: string;
}
