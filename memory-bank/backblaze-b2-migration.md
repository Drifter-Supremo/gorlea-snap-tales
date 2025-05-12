# Backblaze B2 Migration

## Overview
This document outlines the migration from Cloudinary to Backblaze B2 for image storage in the Gorlea Snaps application.

## Reason for Migration
Cloudinary's pricing model was determined to be too expensive for the project's needs. Backblaze B2 offers a more cost-effective solution for image storage.

## Migration Steps Completed

1. Created a new feature branch: `feat/backblaze-b2`
2. Removed Cloudinary dependencies:
   - Uninstalled `cloudinary` and `@cloudinary/url-gen` packages
   - Deleted `src/lib/uploadToCloudinary.ts`
   - Removed Cloudinary environment variables from `.env.local`

3. Installed Backblaze B2 dependencies:
   - Added `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` packages

4. Created backend API route for presigned URLs:
   - Added `src/pages/api/get-upload-url.ts` for generating presigned PUT URLs

5. Created B2 upload helper:
   - Added `src/lib/uploadToB2.ts` to handle image uploads to B2

6. Updated front-end integration:
   - Modified `src/services/storyGenerator.ts` to use B2 instead of Cloudinary
   - Updated error handling in `src/pages/MainPage.tsx`

7. Updated environment variables:
   - Added B2 configuration to `.env.local`:
     ```
     B2_BUCKET=gorlea-snaps-images
     B2_ENDPOINT=https://s3.us-east-005.backblazeb2.com
     B2_KEY_ID=0053ca3c9eee012000000001
     B2_APPLICATION_KEY=K005t7br0NZmEQFpQkL04xWjjqZ3ZbE
     NEXT_PUBLIC_B2_BUCKET=gorlea-snaps-images
     ```

8. Updated documentation:
   - Modified README.md to reflect the use of Backblaze B2 instead of Cloudinary

## Configuration Details

### Backblaze B2 Bucket
- **Bucket Name**: gorlea-snaps-images
- **Bucket ID**: 03ac5a63bcb9ce6e9e60112
- **Endpoint**: s3.us-east-005.backblazeb2.com
- **Public Access**: Enabled

### API Keys
- **Key ID**: 0053ca3c9eee012000000001
- **Application Key**: K005t7br0NZmEQFpQkL04xWjjqZ3ZbE
- **Key Name**: gorlea-snaps

## Implementation Details

### Upload Flow
1. Front-end requests a presigned URL from the Next.js API route
2. API route generates a presigned URL with the AWS SDK
3. Front-end uploads the file directly to B2 using the presigned URL
4. After successful upload, the public URL is constructed and used in the application

### File Structure
- Files are stored in user-specific folders: `users/{uid}/{timestamp}_{filename}`
- Public URLs follow the format: `https://f004.backblazeb2.com/file/gorlea-snaps-images/users/{uid}/{timestamp}_{filename}`

## Testing
The implementation has been tested with the following:
- Image upload from the story creation page
- Error handling for upload failures
- Proper URL construction and storage in Firestore

## Future Considerations
- Consider implementing image optimization before upload
- Add file type validation on the server side
- Implement CORS configuration if needed
- Consider adding a cleanup function to remove unused images
