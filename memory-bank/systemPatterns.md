# System Patterns: Gorlea Snaps

## System Architecture

- **Frontend:** React.js with TypeScript, using Tailwind CSS and Shadcn UI for styling and components. React Router manages navigation, and React Query handles data fetching and caching.
- **Backend:** Planned for Firebase (Authentication, Firestore, Storage, Cloud Functions) and GPT 4.1 API integration for AI story generation.
- **Mobile-First Design:** All UI components and layouts are optimized for mobile devices, with responsive design principles applied throughout.

## Key Technical Decisions

- Use of Firebase for authentication, storage, and real-time database to accelerate development and leverage managed services.
- Integration of GPT 4.1 for advanced AI-driven story generation, including image analysis and genre-specific prompt engineering.
- Adoption of React Query for efficient data management and caching.
- Modular component structure for maintainability and scalability.

## Design Patterns in Use

- **Context API:** Used for authentication and global state management (e.g., AuthContext).
- **Component Composition:** UI is built from reusable, composable components (e.g., GenreSelector, ImageUploader, NavigationDrawer).
- **Separation of Concerns:** Clear separation between UI, data fetching, and business logic.
- **Asynchronous Operations:** Promises and async/await patterns for API calls and story generation.

## Component Relationships

- **App.tsx** is the root component, orchestrating routing and global providers.
- **Header, NavigationDrawer, and Logo** provide navigation and branding.
- **ImageUploader** handles image selection, preview, and upload.
- **GenreSelector** manages genre selection and state.
- **StoryPage** displays generated stories and handles user interactions (save, share, favorite).
- **AuthContext** provides authentication state and methods to all components.

## Security and Performance Patterns

- Firebase security rules for data and storage access.
- Input validation and sanitization at both frontend and backend.
- Caching and lazy loading for performance optimization.
- Error boundaries and user-friendly error handling in the UI.
