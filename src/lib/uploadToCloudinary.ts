/**
 * Uploads a file to Cloudinary using unsigned upload
 * 
 * @param file - The file to upload (from input or drag-and-drop)
 * @param uid - User ID to organize uploads in user-specific folders
 * @returns A Promise that resolves to the secure URL of the uploaded image
 * @throws Error if the upload fails
 */
export async function uploadToCloudinary(file: File, uid: string) {
  const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`;
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET);
  form.append("folder", `users/${uid}`);
  const r = await fetch(url, { method: "POST", body: form });
  if (!r.ok) throw new Error(await r.text());
  return (await r.json()).secure_url as string;
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
