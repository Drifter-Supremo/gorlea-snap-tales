# System Patterns: Gorlea Snaps

## System Architecture

- **Frontend:** React.js with TypeScript, using Tailwind CSS and Shadcn UI for styling and components. React Router manages navigation, and React Query handles data fetching and caching.
- **Backend:** Firebase (Authentication, Firestore, Storage) and OpenAI GPT-4.1 API integration for AI story generation.
- **Mobile-First Design:** All UI components and layouts are optimized for mobile devices, with responsive design principles applied throughout.

## Key Technical Decisions

- Use of Firebase for authentication, storage, and real-time database to accelerate development and leverage managed services.
- Integration of OpenAI GPT-4.1 for advanced AI-driven story generation, including image analysis and genre-specific prompt engineering.
- Adoption of React Query for efficient data management and caching.
- Modular component structure for maintainability and scalability.
- Use of Firebase SDK for all storage operations to avoid CORS issues.
- Implementation of genre-specific prompts for tailored AI story generation.

## Design Patterns in Use

- **Context API:** Used for authentication and global state management (e.g., AuthContext).
- **Component Composition:** UI is built from reusable, composable components (e.g., GenreSelector, ImageUploader, NavigationDrawer).
- **Separation of Concerns:** Clear separation between UI, data fetching, and business logic.
- **Asynchronous Operations:** Promises and async/await patterns for API calls and story generation.
- **Service Pattern:** Dedicated service modules for Firebase operations (e.g., uploadToFirebaseStorage).

## Component Relationships

- **App.tsx** is the root component, orchestrating routing and global providers.
- **Header, NavigationDrawer, and Logo** provide navigation and branding.
- **ImageUploader** handles image selection, preview, and upload.
- **GenreSelector** manages genre selection and state.
- **StoryPage** displays generated stories and handles user interactions (save, share, favorite).
- **AuthContext** provides authentication state and methods to all components.
- **StoryGenerator** service coordinates image upload and story generation.

## Security and Performance Patterns

- Firebase security rules for data and storage access.
- Input validation and sanitization at both frontend and backend.
- Caching and lazy loading for performance optimization.
- Error boundaries and user-friendly error handling in the UI.
- Firebase SDK usage for secure storage operations.
- User-specific storage paths for proper access control.

## Firebase Storage Patterns

- **SDK-First Approach:** Always use the Firebase SDK for storage operations to avoid CORS issues.
- **Structured Storage Paths:** Organize files in logical paths (e.g., `/users/{userId}/images/`, `/stories/{userId}/{timestamp}_{filename}`).
- **User-Specific Paths:** Include user ID in storage paths to facilitate security rule implementation.
- **Timestamp-Based Filenames:** Use timestamps in filenames to avoid collisions.
- **Download URL Retrieval:** Always retrieve download URLs after upload rather than constructing them manually.

## OpenAI Integration Patterns

- **Genre-Specific Prompts:** Tailor prompts based on the selected genre for more relevant story generation.
- **System and User Messages:** Use system messages to set the tone and user messages for specific instructions.
- **Temperature Control:** Adjust temperature parameter to balance creativity and coherence.
- **Response Parsing:** Extract title and content from the AI response with robust parsing logic.
- **Error Handling:** Implement comprehensive error handling for API calls with user-friendly messages.
- **Environment Variables:** Store API keys in environment variables for security.
