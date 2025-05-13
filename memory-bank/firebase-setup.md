# Firebase Setup for Gorlea Snaps

This document outlines the Firebase setup for the Gorlea Snaps application.

## Firebase Services Used

1. **Firebase Authentication**: For user authentication (email/password)
2. **Firestore Database**: For storing user data and stories
3. **Firebase Storage**: For storing user profile pictures and story images

## Firebase Configuration

The Firebase configuration is stored in `src/lib/firebase.ts`:

```typescript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

## Environment Variables

The Firebase configuration values are stored in environment variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Firebase Authentication

We're using Firebase Authentication with email/password sign-in method. The authentication logic is implemented in `src/lib/auth.ts`.

## Firestore Database

We're using Firestore Database to store user data and stories. The database structure is as follows:

- **users**: Collection of user documents
  - **{userId}**: Document containing user data
    - **email**: User's email
    - **displayName**: User's display name
    - **photoURL**: URL to user's profile picture
    - **createdAt**: Timestamp when the user was created
    - **updatedAt**: Timestamp when the user was last updated

- **stories**: Collection of story documents
  - **{storyId}**: Document containing story data
    - **title**: Story title
    - **content**: Story content
    - **imageURL**: URL to story image
    - **genre**: Story genre
    - **userId**: ID of the user who created the story
    - **createdAt**: Timestamp when the story was created
    - **updatedAt**: Timestamp when the story was last updated

## Firebase Storage

We're using Firebase Storage to store user profile pictures and story images. The storage structure is as follows:

- **/users/{userId}/images/**: Directory for user profile pictures
- **/stories/{userId}/{timestamp}_{filename}**: Directory for story images

> **IMPORTANT**: Always use the Firebase SDK for storage operations. Direct REST API calls to Firebase Storage will likely encounter CORS issues.

## Security Rules

### Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /stories/{storyId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

### Storage Security Rules

Current development rules (simplified for testing):

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to read and write to all paths
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Recommended production rules (more restrictive):

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /stories/{userId}/{allPaths=**} {
      allow write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null;
    }
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## Firebase Storage Best Practices

1. **Always Use the Firebase SDK**: This is critical - always use the Firebase SDK for all storage operations to avoid CORS issues.
2. **Implement Proper Security Rules**: Use appropriate security rules to control access to your storage.
3. **Use Structured Paths**: Organize files in a logical structure that makes security rules easier to implement.
4. **Include User ID in Paths**: This makes it easier to implement security rules that restrict access based on user ID.

For more detailed information, see the [Firebase Storage Best Practices](./firebase-storage-best-practices.md) document.

## Deployment

The Firebase configuration is deployed using the Firebase CLI:

```bash
firebase deploy --only firestore:rules,storage:rules
```

## Testing

To test the Firebase configuration:

1. Create a new user account
2. Upload a profile picture
3. Create a new story
4. View the story
5. Edit the story
6. Delete the story

## Troubleshooting

If you encounter issues with Firebase:

1. Check the Firebase console for error messages
2. Check the browser console for error messages
3. Verify that the environment variables are correctly set
4. Verify that the security rules are correctly configured
5. Verify that the Firebase services are enabled in the Firebase console

For Firebase Storage specific issues, see the [Firebase Storage Best Practices](./firebase-storage-best-practices.md) document.
