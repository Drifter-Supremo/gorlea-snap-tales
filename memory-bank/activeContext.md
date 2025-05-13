# Active Context: Gorlea Snaps

## Current Work Focus

- Enhancing OpenAI GPT-4.1 integration with proper image analysis capabilities.
- Simplifying genre-specific prompts for shorter, easier-to-read stories.
- Ensuring stories accurately reflect the visual elements in uploaded images.
- Optimizing token usage and monitoring API costs.

## Recent Changes

- Completed all environment setup tasks (Node.js, Git, Firebase CLI).
- Set "gorlea-snaps" as the active Firebase project.
- Completed repository setup (installed dependencies, created .env.local file).
- Added Firebase configuration and OpenAI API key to environment variables.
- Verified that Firebase services (Authentication, Firestore, Storage) are enabled in the Firebase Console.
- Created Firebase initialization file (`src/lib/firebase.ts`) with proper configuration.
- Installed Firebase package (`npm install firebase`) to resolve type declaration issues.
- Configured password reset email template in Firebase Authentication.
- Updated the AuthContext to use real Firebase Authentication instead of mock data.
- Implemented Firebase auth state listener to track user authentication status.
- Added proper error handling for Firebase authentication errors.
- Enhanced the sign-up form with validation, error handling, and loading states.
- Implemented Firebase user creation and Firestore user document creation.
- Updated documentation to reflect completed tasks.
- Implemented profile picture upload functionality in the settings page.
- Fixed NavigationDrawer to correctly display user's name and profile picture.
- Removed guest mode functionality as it was causing errors and is unnecessary for the application.
- Created a dedicated `.env.firebase` file for Firebase configuration to improve security.
- Implemented protected routes using React Router to ensure authenticated access to app pages.
- Removed redundant authentication checks from individual page components.
- Added the Gorlea Snaps logo to the application:
  - Updated the Logo component to display the image from public/new-gorlea-logo.png
  - Added the logo to the login page (centered above the text)
  - Added the logo to the header (in the top-left corner)
  - Set the logo as the application favicon and updated Open Graph images
- Updated branding from "AI Stories" to just "Stories":
  - Changed the badge text in the Logo component
  - Updated all references in the application text
  - Updated page titles and meta descriptions
- Updated branding from "Gorlea Snaps Stories" to just "Gorlea Snaps":
  - Moved "Snaps" from the main text to the tilted card
  - Removed "Stories" from the tilted card
  - Updated page titles and meta descriptions
- Enhanced the GenreSelector component with improved UI and interactions:
  - Added tooltips with detailed genre descriptions
  - Implemented hover effects and visual feedback for selected genres
  - Added a pulsing indicator for the currently selected genre
  - Improved accessibility with proper ARIA attributes and focus states
  - Made the component responsive for different screen sizes
- Successfully implemented Firebase Storage for story image uploads:
  - Created a dedicated function for uploading to Firebase Storage
  - Updated the storyGenerator service to use Firebase Storage
  - Configured Firebase Storage security rules to allow authenticated access
  - Resolved CORS issues by using the Firebase SDK for storage operations
  - Created comprehensive documentation on Firebase Storage best practices
- Successfully implemented OpenAI GPT-4.1 integration for story generation:
  - Created a dedicated OpenAI client utility
  - Updated the storyGenerator service to use the OpenAI API
  - Implemented genre-specific prompts for AI story generation
  - Added proper error handling for API calls
  - Created comprehensive documentation on OpenAI integration
  - Enhanced image analysis capabilities by properly formatting API requests
  - Simplified prompts to generate shorter, easier-to-read stories
  - Added explicit instructions to ensure stories accurately reflect image content
- Implemented Firestore for favorites functionality:
  - Created a dedicated module for Firestore favorites operations
  - Updated StoryPage and FavoritesPage to use Firestore instead of localStorage
  - Maintained backward compatibility with existing localStorage implementation
  - Added comprehensive error handling and fallback mechanisms
  - Created documentation on Firestore favorites implementation
- Updated UI text to consistently use "Favorites" instead of "My Stories"

## Next Steps

1. ✅ Implement real authentication using Firebase Authentication.
2. ✅ Update the AuthContext to use Firebase Authentication instead of mock data.
3. ✅ Implement sign up functionality using Firebase Authentication.
4. ✅ Implement login functionality using Firebase Authentication.
5. ✅ Implement password reset functionality using Firebase Authentication.
6. ✅ Implement profile picture upload functionality.
7. ✅ Remove guest access mode.
8. ✅ Add protected routes for authenticated users.
9. ✅ Add logo to the application and set as favicon.
10. ✅ Build genre selection UI component with tooltips and visual feedback.
11. ✅ Configure Firebase Storage security rules for story images.
12. ✅ Implement Firebase Storage for story image uploads.
13. ✅ Implement OpenAI integration for story generation.
14. ✅ Set up Firestore collections structure and security rules.
15. [ ] Refine Firebase Storage security rules for production.
16. [ ] Enhance error handling and user feedback for story generation.

## Active Decisions and Considerations

- We are using the "gorlea-snaps" Firebase project, which is now set as the active project.
- We're taking a step-by-step approach, completing and checking in after each task.
- Documentation will continue to be updated as the project evolves.
- We'll focus on one phase at a time, ensuring each component is properly implemented before moving on.
- Always use the Firebase SDK for storage operations to avoid CORS issues.
- Current Firebase Storage security rules are permissive for development; will need to be tightened for production.
- Using OpenAI GPT-4.1 model (gpt-4.1-2025-04-14) for story generation with image analysis capabilities.
- OpenAI API key is stored in a separate .env.openai file for security.
- Properly formatting image input in API requests to enable GPT-4.1's vision capabilities.
- Completely overhauled prompts to generate intense, mind-blowing stories with high stakes and unexpected twists.
- Changed approach to use images as creative inspiration rather than strict templates.
- Added requirements for compelling hooks, dramatic escalation, and powerful twist endings.
- Enhanced genre-specific prompts to emphasize intensity and emotional impact.
- Added presence_penalty (0.6) and frequency_penalty (0.3) parameters for more diverse language.
- Adjusted temperature to 1.0 to balance creativity with logical coherence.
- Strengthened formatting requirements with explicit, repeated instructions to ABSOLUTELY NEVER use dashes or hyphens.
- Improved dialogue formatting instructions and emphasis on grammatical consistency.
- Documented OpenAI image requirements for optimal story generation:
  - Supported file types: PNG, JPEG, WEBP, non-animated GIF
  - Size limits: Up to 20MB, 512px x 512px (low-res) or 768px x 2000px (high-res)
  - Content requirements: No watermarks/logos, no text, no NSFW, clear enough for human understanding
- Implemented image requirements in the application:
  - Created a dedicated image-requirements.md document
  - Updated ImageUploader component to accept the correct file types and size limits
  - Enhanced imageUtils.ts to ensure images meet OpenAI's dimension requirements
  - Added ImageRequirementsTooltip component to inform users about requirements
  - Integrated the tooltip in the MainPage for better user guidance
