import { collection, query, where, getDocs, addDoc, deleteDoc, doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { deleteStory } from "./storiesData";

/**
 * Adds a story to a user's favorites in Firestore
 *
 * @param userId - The ID of the user
 * @param storyId - The ID of the story to favorite
 * @returns A Promise that resolves when the favorite is added
 */
export const addToFavorites = async (userId: string, storyId: string): Promise<void> => {
  try {
    // Check if the favorite already exists
    const existingFavorite = await checkIfFavorite(userId, storyId);

    if (existingFavorite) {
      console.log("Story is already in favorites");
      return;
    }

    // Add to favorites collection
    await addDoc(collection(db, "favorites"), {
      userId,
      storyId,
      createdAt: Timestamp.now()
    });

    console.log("Added to favorites successfully");
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw new Error("Failed to add to favorites");
  }
};

/**
 * Removes a story from a user's favorites in Firestore
 *
 * @param userId - The ID of the user
 * @param storyId - The ID of the story to unfavorite
 * @param deleteStoryData - Whether to also delete the story and its image (default: false)
 * @returns A Promise that resolves when the favorite is removed
 */
export const removeFromFavorites = async (
  userId: string,
  storyId: string,
  deleteStoryData: boolean = false
): Promise<void> => {
  try {
    // Find the favorite document
    const favoriteQuery = query(
      collection(db, "favorites"),
      where("userId", "==", userId),
      where("storyId", "==", storyId)
    );

    const querySnapshot = await getDocs(favoriteQuery);

    if (querySnapshot.empty) {
      console.log("Favorite not found");
      return;
    }

    // Delete the favorite document
    const favoriteDoc = querySnapshot.docs[0];
    await deleteDoc(doc(db, "favorites", favoriteDoc.id));

    console.log("Removed from favorites successfully");

    // If requested, also delete the story and its associated image
    if (deleteStoryData) {
      try {
        await deleteStory(storyId);
        console.log("Story and associated image deleted successfully");
      } catch (deleteError) {
        console.error("Error deleting story data:", deleteError);
        // We don't throw here because the unfavorite operation was successful
      }
    }
  } catch (error) {
    console.error("Error removing from favorites:", error);
    throw new Error("Failed to remove from favorites");
  }
};

/**
 * Checks if a story is in a user's favorites
 *
 * @param userId - The ID of the user
 * @param storyId - The ID of the story to check
 * @returns A Promise that resolves to a boolean indicating if the story is favorited
 */
export const checkIfFavorite = async (userId: string, storyId: string): Promise<boolean> => {
  try {
    const favoriteQuery = query(
      collection(db, "favorites"),
      where("userId", "==", userId),
      where("storyId", "==", storyId)
    );

    const querySnapshot = await getDocs(favoriteQuery);

    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return false;
  }
};

/**
 * Gets all favorite stories for a user
 *
 * @param userId - The ID of the user
 * @returns A Promise that resolves to an array of story IDs
 */
export const getUserFavorites = async (userId: string): Promise<string[]> => {
  try {
    const favoriteQuery = query(
      collection(db, "favorites"),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(favoriteQuery);

    return querySnapshot.docs.map(doc => doc.data().storyId);
  } catch (error) {
    console.error("Error getting user favorites:", error);
    return [];
  }
};
