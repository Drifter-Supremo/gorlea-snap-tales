
# Gorlea Snaps - AI Story Generator

A mobile-first web application that generates AI stories based on uploaded photos. Users can upload an image, select a genre, and receive a custom story based on the content of their photo.

## Features

- User authentication (login/signup)
- Image upload and preview
- Genre selection (Rom-Com, Horror, Sci-Fi, Film Noir)
- AI story generation
- Save stories to favorites
- Share stories
- Mobile-first responsive design

## Technologies Used

### Frontend
- React.js with TypeScript
- Tailwind CSS for styling
- Shadcn UI components
- React Router for navigation
- React Query for data handling
- Lucide React for icons

### Backend
- Firebase Authentication for user management
- Firebase Storage for image uploads
- Firestore for database
- AI integration for story generation (Claude 3.7 Sonnet)

## Backend Architecture

The backend for this application is implemented using Firebase services:

1. **Authentication Service (Firebase Authentication)**
   - User registration and login with email/password
   - Password reset functionality with customized email templates
   - User profile management
   - Authentication state management

2. **Image Storage (Firebase Storage)**
   - Secure image upload directly from the browser
   - Organized storage structure:
     - `/users/{userId}/images/` - Profile pictures
     - `/stories/{userId}/{timestamp}_{filename}` - Story images
   - Security rules to protect user data

3. **Story Generation Service (Claude 3.7 Sonnet)**
   - Image analysis using Claude's vision capabilities
   - Genre-specific prompt engineering
   - Story formatting and structure
   - High-quality narrative generation with emotional impact

4. **Database Schema (Firestore)**
   - Users collection
     - id
     - email
     - displayName
     - photoURL
     - createdAt
     - preferences (optional)
   - Stories collection
     - id
     - userId (owner)
     - title
     - content
     - genre
     - imageUrl
     - createdAt
     - isPublic
   - Favorites collection
     - userId
     - storyId
     - createdAt

## API Integration Guide

### Firebase Authentication

```javascript
// Example Firebase authentication integration
import { auth } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';

// User registration
async function register(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

// User login
async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

// Password reset
async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
}
```

### Story Generation with Claude

```javascript
// Example story generation with Claude
import { generateStory } from '@/services/storyGenerator';

async function createStory(imageFile, genre, userId) {
  try {
    // This function handles image upload to Firebase Storage and story generation
    const result = await generateStory(imageFile, genre, userId);
    return result;
  } catch (error) {
    console.error("Story generation error:", error);
    throw error;
  }
}
```

### Firebase Storage Upload

```javascript
// Example image upload to Firebase Storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

async function uploadToFirebaseStorage(file, userId) {
  try {
    // Create a unique file path with timestamp to avoid name collisions
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;

    // Create a reference to the file location in Firebase Storage
    const storageRef = ref(storage, `stories/${userId}/${fileName}`);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading to Firebase Storage:", error);
    throw error;
  }
}
```

## AI Story Generation with Claude 3.7 Sonnet

The story generation process uses Anthropic's Claude 3.7 Sonnet model with the following approach:

1. Image Analysis
   - Claude's built-in vision capabilities analyze the uploaded image
   - No separate image classification service is needed
   - The model extracts people, objects, settings, and mood from the image

2. Genre-Specific Prompts
   - Each genre (Rom-Com, Horror, Sci-Fi, Film Noir) has a custom prompt
   - Prompts are designed to create intense, mind-blowing stories with high stakes
   - Film Noir stories use first-person narration for authenticity

3. Story Generation Process
   - The image URL and genre-specific prompt are sent to Claude
   - Claude generates a title and content based on the image and genre
   - Stories are formatted with proper paragraphs and dialogue

Example prompt structure:

```
Create an INTENSE {genre} story inspired by this image. Your story should have HIGH STAKES and UNEXPECTED TWISTS.

Use the people, setting, and objects in the image as a starting point, but then take the story in surprising directions.

Your story MUST include:
1) A compelling hook that draws readers in immediately
2) A dramatic escalation of tension or stakes in the middle
3) A powerful twist or revelation at the end that changes everything

STRICT FORMATTING REQUIREMENTS:
1) ABSOLUTELY NO DASHES OR HYPHENS ANYWHERE IN YOUR TEXT
2) Use commas, periods, or line breaks instead
3) Use proper quotation marks for dialogue
4) Ensure perfect grammar and logical consistency throughout
```

## Security Considerations

1. Firebase Authentication handles secure user authentication
2. Firebase Storage security rules restrict access to authorized users
3. Firestore security rules protect user data
4. Environment variables store API keys securely
5. All API keys are excluded from version control via .gitignore
6. Firebase SDK handles CORS issues automatically
7. Client-side validation prevents malicious uploads

## Performance Optimizations

1. Firebase Storage provides CDN capabilities for image delivery
2. Firestore indexing improves query performance
3. Claude API parameters are optimized for faster story generation
4. Image requirements ensure optimal processing
5. Caching mechanisms reduce redundant API calls
6. Proper error handling improves user experience

## Environment Setup

To set up the development environment:

1. Clone the repository
2. Copy `.env.local.example` to `.env.local` and fill in the values:
   ```
   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Claude API
   VITE_CLAUDE_API_KEY=your_claude_api_key
   ```
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

## Image Requirements

For optimal story generation, images uploaded to Gorlea Snaps must meet these requirements:

### Supported File Types
- PNG (.png)
- JPEG (.jpeg and .jpg)
- WEBP (.webp)
- Non-animated GIF (.gif)

### Size Limits
- Maximum file size: 20MB per image
- Low-resolution: 512px x 512px
- High-resolution: 768px (short side) x 2000px (long side)

### Content Requirements
- No watermarks or logos
- No text
- No NSFW content
- Clear enough for a human to understand

## Future Enhancements

1. Additional story genres beyond the current four options
2. User feedback and rating system for stories
3. AI fine-tuning based on user preferences
4. Multi-image story generation for more complex narratives
5. Audio narration of stories using text-to-speech
6. Custom character development options
7. Enhanced social sharing integrations
8. Story collections and organization features
9. Collaborative storytelling capabilities

## Project Status

This project is actively being developed. The current implementation includes:

- ✅ Complete user authentication with Firebase
- ✅ Profile picture upload and management
- ✅ Story generation with Claude 3.7 Sonnet
- ✅ Firebase Storage for image uploads
- ✅ Firestore for database storage
- ✅ Favorites system for saving stories
- ✅ Mobile-first responsive design

This README provides a comprehensive guide to the Gorlea Snaps application architecture and implementation.
