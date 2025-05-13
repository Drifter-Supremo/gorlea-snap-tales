# Storage Architecture in Gorlea Snaps

This document clarifies the current storage architecture in the Gorlea Snaps application, detailing which storage solutions are used for different types of assets.

## Overview

The application uses two different storage solutions for different purposes:

1. **Cloudinary**: Used for story-related image uploads
2. **Firebase Storage**: Used for user profile pictures

## Cloudinary Implementation

### Purpose
Cloudinary is used for storing images that users upload for story generation. This was chosen after experiencing CORS configuration issues with Firebase Storage and cost considerations with Backblaze B2.

### Configuration
- **Cloud Name**: dvir930ty
- **Upload Preset**: gorlea-snaps (unsigned)
- **Folder Structure**: users/{uid}/{filename}

### Implementation Details
- The upload functionality is implemented in `src/lib/uploadToCloudinary.ts`
- The story generation process in `src/services/storyGenerator.ts` uses this function to upload images
- Direct browser-to-Cloudinary uploads are used with an unsigned upload preset

### Advantages
- Simplified implementation with no server-side authentication required
- Built-in image optimization
- No CORS configuration issues
- Reliable CDN delivery

## Firebase Storage Implementation

### Purpose
Firebase Storage is used exclusively for user profile pictures, which are uploaded and managed through the Settings page.

### Configuration
- Storage bucket is configured in the Firebase project
- Files are stored in: `users/{userId}/images/{timestamp}_{filename}`

### Implementation Details
- Profile picture upload is implemented in `src/pages/SettingsPage.tsx`
- Uses Firebase SDK's `uploadBytes` and `getDownloadURL` functions
- Integrated with Firebase Authentication for user profile updates

### Security Rules
Firebase Storage has security rules (in `storage.rules`) that restrict access:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Only allow access to files within a user's own directory
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    // Deny all other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## Migration History

The project has gone through several storage solution migrations:

1. **Initial Implementation**: Firebase Storage was the original choice for all image storage
2. **First Migration**: Moved to Backblaze B2 due to cost considerations (documented in `backblaze-b2-migration.md`)
3. **Second Migration**: Moved to Cloudinary due to CORS and implementation challenges with Backblaze B2 (documented in `cloudinary-migration.md`)

## Current Status

- ✅ Cloudinary is fully implemented and working for story image uploads
- ✅ Firebase Storage is used and working for profile picture uploads
- ✅ Security rules are in place for Firebase Storage
- ❌ No server-side validation for Cloudinary uploads (relies on client-side validation)

## Future Considerations

1. **Consolidation**: Consider consolidating to a single storage solution for simplicity
2. **Image Optimization**: Implement additional client-side optimization before upload
3. **Cleanup**: Add functionality to remove unused images from both storage solutions
4. **Monitoring**: Set up usage alerts for both Cloudinary and Firebase Storage
