import { getUploadUrl } from "../api/getUploadUrl";

/**
 * Uploads a file to Backblaze B2 using presigned URLs
 *
 * @param file - The file to upload (from input or drag-and-drop)
 * @param uid - User ID to organize uploads in user-specific folders
 * @returns A Promise that resolves to the public URL of the uploaded image
 * @throws Error if the upload fails
 */
export async function uploadToB2(file: File, uid: string) {
  try {
    console.log("Starting Backblaze B2 upload process...");

    // Get a presigned URL from our client-side function
    console.log("Generating presigned URL...");
    const { url, key } = await getUploadUrl(uid, file.name);
    console.log("Presigned URL generated:", url);

    // Upload the file directly to B2 using the presigned URL
    console.log("Uploading file to B2...");
    const uploadRes = await fetch(url, {
      method: "PUT",
      body: file
    });

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      console.error("B2 upload failed:", errorText);
      throw new Error(`B2 upload failed: ${uploadRes.status} ${uploadRes.statusText}`);
    }

    // Construct the public URL
    const bucketName = import.meta.env.VITE_B2_BUCKET || "gorlea-snaps-images";
    const publicUrl = `https://f004.backblazeb2.com/file/${bucketName}/${key}`;
    console.log("B2 upload successful:", key);
    return publicUrl;
  } catch (error) {
    console.error("Error in uploadToB2:", error);
    throw new Error(`B2 upload error: ${error.message}`);
  }
}
