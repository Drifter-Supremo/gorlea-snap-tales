# Cloudinary Migration

## Overview
This document outlines the migration from Backblaze B2 back to Cloudinary for image storage in the Gorlea Snaps application.

## Reason for Migration
While Backblaze B2 was initially chosen as a cost-effective alternative to Cloudinary, implementation challenges and CORS configuration issues led to the decision to revert to Cloudinary. Cloudinary offers a simpler implementation with its unsigned upload preset feature, which eliminates the need for server-side authentication.

## Migration Steps Completed

1. Updated environment variables:
   - Added Cloudinary configuration to `.env.local`:
     ```
     VITE_CLOUDINARY_CLOUD_NAME=dvir930ty
     VITE_CLOUDINARY_UNSIGNED_PRESET=gorlea-snaps
     ```
   - Kept Backblaze B2 configuration for reference

2. Created Cloudinary upload helper:
   - Added `src/lib/uploadToCloudinary.ts` to handle image uploads to Cloudinary
   - Implemented direct upload to Cloudinary using unsigned upload preset

3. Updated front-end integration:
   - Modified `src/services/storyGenerator.ts` to use Cloudinary instead of Backblaze B2
   - Updated error handling in both the story generator and `MainPage.tsx`

## Implementation Details

### Upload Flow
1. The front-end creates a FormData object with the image file
2. The file is uploaded directly to Cloudinary using the upload API
3. Cloudinary returns a secure URL that is used in the application

### File Structure
- Files are stored in user-specific folders: `users/{uid}/{filename}`
- Cloudinary automatically handles file naming and versioning

### Configuration Details

#### Cloudinary Account
- **Cloud Name**: dvir930ty
- **Upload Preset**: gorlea-snaps (unsigned)
- **Folder Structure**: users/{uid}

## Advantages of Cloudinary

1. **Simplified Implementation**:
   - No need for server-side authentication
   - Direct upload from the browser
   - Built-in image optimization

2. **Robust CDN**:
   - Global content delivery network
   - Automatic format optimization
   - Responsive images

3. **Image Transformations**:
   - On-the-fly resizing
   - Format conversion
   - Quality adjustments

## Testing
The implementation has been tested with the following:
- Image upload from the story creation page
- Error handling for upload failures
- Proper URL construction and storage in Firestore

## Future Considerations
- Implement image optimization before upload to reduce bandwidth usage
- Add file type validation on the client side
- Consider adding a cleanup function to remove unused images
- Explore Cloudinary's transformation capabilities for responsive images
