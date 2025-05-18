# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

\### Critical Rules - DO NOT VIOLATE

\- \*\*NEVER create mock data or simplified components\*\* unless explicitly told to do so

\- \*\*NEVER replace existing complex components with simplified versions\*\* - always fix the actual problem

\- \*\*ALWAYS work with the existing codebase\*\* - do not create new simplified alternatives

\- \*\*ALWAYS find and fix the root cause\*\* of issues instead of creating workarounds

\- When debugging issues, focus on fixing the existing implementation, not replacing it

\- When something doesn't work, debug and fix it - don't start over with a simple version

\- \*\*ALWAYS check ALL /memory-bank DOCS before making changes\*\* 

\- NEVER complete multiple tasks in a row unless told to do so ALWAYS complete 1 task at a time then stop to regroup with me.

\- ALWAYS update ALL relevant/memory-bank docs after every successful task

\### TypeScript and Linting

\- ALWAYS add explicit types to all function parameters, variables, and return types

\- ALWAYS run npm build\ or appropriate linter command before considering any code changes complete

\- Fix all linter and TypeScript errors immediately - don't leave them for the user to fix

\- When making changes to multiple files, check each one for type errors

## Common Commands

### Development
```bash
# Start the development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Environment Setup

1. Create a `.env.local` file based on `.env.local.example` with the following:
   ```
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Claude API Key (for story generation)
   VITE_CLAUDE_API_KEY=your_claude_api_key

   # OpenAI API Key (for text-to-speech)
   VITE_OPENAI_API_KEY=your_openai_api_key

   # Cloudinary (if using instead of Firebase Storage)
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UNSIGNED_PRESET=your_preset
   ```

## Architecture Overview

### Core Services

1. **Authentication** (`src/contexts/AuthContext.tsx`)
   - Firebase Authentication for user login/signup
   - Protected routes via `src/components/ProtectedRoute.tsx`

2. **Image Storage** (`src/lib/uploadToFirebaseStorage.ts`)
   - Firebase Storage for image uploads
   - Alternative implementations: Cloudinary (`uploadToCloudinary.ts`) and Backblaze B2 (`uploadToB2.ts`)

3. **Story Generation** (`src/services/claudeStoryGenerator.ts`)
   - Uses Claude 3.7 Sonnet for AI story generation from images
   - Genre-specific prompts for different story styles
   - Stores generated stories in Firestore

4. **Text-to-Speech** (`src/services/textToSpeechService.ts`)
   - Uses OpenAI's GPT-4o mini TTS for audio narration
   - Audio playback functionality in `AudioPlayer.tsx` and `SimpleAudioPlayer.tsx`

5. **Database** (`src/data/storiesData.ts`, `src/data/favoritesData.ts`)
   - Firestore for story and user data storage
   - Collections: users, stories, favorites

### Frontend Structure

- **Pages**: Main routes in `src/pages/`
  - `MainPage.tsx`: Home page with image upload and story generation
  - `StoryPage.tsx`: Displays generated stories with audio playback
  - `FavoritesPage.tsx`: User's saved stories
  - `AuthPage.tsx`: Login/signup functionality
  - `SettingsPage.tsx`: User preferences

- **Components**:
  - UI components from Shadcn UI in `src/components/ui/`
  - Custom components like `ImageUploader.tsx`, `GenreSelector.tsx`

- **Routing**:
  - React Router for navigation
  - Protected routes for authenticated content

## Data Flow

1. User uploads an image via `ImageUploader.tsx`
2. Image is stored in Firebase Storage (`uploadToFirebaseStorage.ts`)
3. Story is generated using Claude API based on the image and selected genre (`claudeStoryGenerator.ts`)
4. Generated story is saved to Firestore (`storiesData.ts`)
5. Text-to-speech narration is created using OpenAI API (`textToSpeechService.ts`)
6. Story is displayed with audio playback options

## Security Considerations

- Firebase security rules protect user data
- API keys are stored in environment variables
- User authentication for protected content
- Storage security for user-uploaded images

## Implementation Notes

- Mobile-first responsive design with Tailwind CSS
- Firebase for backend services (Auth, Storage, Firestore)
- Claude 3.7 Sonnet for high-quality story generation
- OpenAI GPT-4o mini TTS for audio narration
- Image requirements enforced for optimal AI processing