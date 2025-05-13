import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

/**
 * Uploads an image to Firebase Storage
 *
 * @param file - The file to upload
 * @param userId - User ID to organize uploads in user-specific folders
 * @returns A Promise that resolves to the public URL of the uploaded image
 */
export async function uploadToFirebaseStorage(file: File, userId: string): Promise<string> {
  try {
    console.log("Uploading image to Firebase Storage...");

    if (!file || file.size === 0) {
      throw new Error("No valid file provided");
    }

    // Create a unique file path with timestamp to avoid name collisions
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    
    // Store story images in a separate folder from profile pictures
    const storageRef = ref(storage, `stories/${userId}/${fileName}`);
    
    // Upload the file
    console.log(`Uploading to path: stories/${userId}/${fileName}`);
    const snapshot = await uploadBytes(storageRef, file);
    console.log("Upload successful:", snapshot.metadata.name);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    console.log("File available at:", downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error("Error in uploadToFirebaseStorage:", error);
    throw new Error(`Firebase Storage upload error: ${error.message}`);
  }
}
