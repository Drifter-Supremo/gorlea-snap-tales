/**
 * Uploads an image to Cloudinary
 *
 * @param file - The file to upload
 * @param userId - User ID to organize uploads in user-specific folders
 * @returns A Promise that resolves to the public URL of the uploaded image
 */
export async function uploadToCloudinary(file: File, userId: string): Promise<string> {
  try {
    console.log("Uploading image to Cloudinary...");

    // Get Cloudinary configuration from environment variables
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET;

    if (!cloudName) {
      throw new Error("Cloudinary cloud name is not configured. Please check your environment variables.");
    }

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset); // Use the unsigned upload preset
    formData.append("folder", `users/${userId}`); // Organize by user ID

    // Upload to Cloudinary using the upload API
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudinary upload failed:", errorText);
      throw new Error(`Cloudinary upload failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Cloudinary upload successful:", data.public_id);

    // Return the secure URL of the uploaded image
    return data.secure_url;
  } catch (error) {
    console.error("Error in uploadToCloudinary:", error);
    throw new Error(`Cloudinary upload error: ${error.message}`);
  }
}
