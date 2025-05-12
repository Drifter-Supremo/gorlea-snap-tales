import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize the S3 client for Backblaze B2
const s3 = new S3Client({
  region: "us-east-005",
  endpoint: import.meta.env.VITE_B2_ENDPOINT || "https://s3.us-east-005.backblazeb2.com",
  credentials: {
    accessKeyId: import.meta.env.VITE_B2_KEY_ID || "",
    secretAccessKey: import.meta.env.VITE_B2_APPLICATION_KEY || "",
  },
});

/**
 * Generates a presigned URL for uploading a file to Backblaze B2
 * 
 * @param uid - User ID to organize uploads in user-specific folders
 * @param filename - Name of the file to upload
 * @returns Promise with the presigned URL and the object key
 */
export async function getUploadUrl(uid: string, filename: string) {
  try {
    // Create a unique key for the file
    const Key = `users/${uid}/${Date.now()}_${filename}`;
    
    // Create a PutObject command
    const command = new PutObjectCommand({ 
      Bucket: import.meta.env.VITE_B2_BUCKET || "gorlea-snaps-images", 
      Key 
    });
    
    // Generate a presigned URL (valid for 15 minutes)
    const url = await getSignedUrl(s3, command, { expiresIn: 900 });
    
    return { url, key: Key };
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw new Error(`Failed to generate upload URL: ${error.message}`);
  }
}
