import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Structure for audio metadata stored in Firestore
 */
interface AudioMetadata {
  storyId: string;
  userId: string;
  createdAt: number;
  genre: string;
  url: string;
}

/**
 * Uploads an audio blob to Firebase Storage and saves metadata to Firestore
 * 
 * @param audioBlob - The audio blob to upload
 * @param userId - User ID to organize uploads in user-specific folders
 * @param storyId - ID of the story the audio belongs to
 * @param genre - Genre of the story (used for potential voice customization)
 * @returns A Promise that resolves to the public URL of the uploaded audio
 */
export async function saveAudioToStorage(
  audioBlob: Blob, 
  userId: string, 
  storyId: string,
  genre: string
): Promise<string> {
  try {
    console.log(`Uploading audio for story ${storyId} to Firebase Storage...`);

    if (!audioBlob || audioBlob.size === 0) {
      throw new Error("No valid audio blob provided");
    }

    // Create a unique file path
    const timestamp = Date.now();
    const fileName = `${timestamp}_narration.mp3`;
    
    // Store audio files in a dedicated folder structure
    const storageRef = ref(storage, `audio/${userId}/${storyId}/${fileName}`);
    
    // Upload the blob
    console.log(`Uploading to path: audio/${userId}/${storyId}/${fileName}`);
    const snapshot = await uploadBytes(storageRef, audioBlob);
    console.log("Audio upload successful:", snapshot.metadata.name);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    console.log("Audio file available at:", downloadURL);
    
    // Save metadata to Firestore for easier retrieval
    await setDoc(doc(db, "audio", storyId), {
      storyId,
      userId,
      createdAt: timestamp,
      genre,
      url: downloadURL
    });
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading audio to Firebase Storage:", error);
    throw error;
  }
}

/**
 * Retrieves the audio URL for a story if it exists
 * 
 * @param storyId - ID of the story to get audio for
 * @returns A Promise that resolves to the audio URL or null if not found
 */
export async function getAudioForStory(storyId: string): Promise<string | null> {
  try {
    const audioDoc = await getDoc(doc(db, "audio", storyId));
    
    if (audioDoc.exists()) {
      const data = audioDoc.data() as AudioMetadata;
      console.log(`Found existing audio for story ${storyId}`);
      return data.url;
    }
    
    console.log(`No existing audio found for story ${storyId}`);
    return null;
  } catch (error) {
    console.error("Error retrieving audio from Firestore:", error);
    return null;
  }
}

/**
 * Deletes an audio file and its metadata
 * 
 * @param storyId - ID of the story whose audio should be deleted
 * @returns A Promise that resolves when the deletion is complete
 */
export async function deleteAudioForStory(storyId: string): Promise<void> {
  try {
    // Get the audio metadata first
    const audioDoc = await getDoc(doc(db, "audio", storyId));
    
    if (audioDoc.exists()) {
      const data = audioDoc.data() as AudioMetadata;
      
      // Delete from Storage
      try {
        // Extract the path from the URL
        const url = new URL(data.url);
        const path = decodeURIComponent(url.pathname.split('/o/')[1].split('?')[0]);
        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
        console.log(`Deleted audio file for story ${storyId} from Storage`);
      } catch (storageError) {
        console.error("Error deleting audio file from Storage:", storageError);
        // Continue to delete the metadata even if file deletion fails
      }
      
      // Delete from Firestore
      await deleteDoc(doc(db, "audio", storyId));
      console.log(`Deleted audio metadata for story ${storyId} from Firestore`);
    }
  } catch (error) {
    console.error("Error deleting audio:", error);
    throw error;
  }
}
