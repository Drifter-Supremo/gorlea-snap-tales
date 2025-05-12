# Gorlea Snaps Development Tasks

This document outlines the step-by-step tasks to set up, develop, and deploy the Gorlea Snaps AI Story Generator application.

## Phase 1: Project Setup

### 1.1 Environment Setup
- [x] Install Node.js (v18+) and npm
- [x] Install Git if not already installed
- [x] Install VS Code or preferred code editor
- [x] Install Firebase CLI: `npm install -g firebase-tools`
- [x] Login to Firebase: `firebase login`

### 1.2 Repository Setup
- [x] Clone the frontend repository: `git clone [repository-url]`
- [x] Navigate to project directory: `cd gorlea-snaps`
- [x] Install dependencies: `npm install`
- [x] Install Firebase package: `npm install firebase`
- [x] Create `.env.local` file for environment variables:
  ```
  NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
  NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
  OPENAI_API_KEY=your_openai_key
  ```
- [x] Add `.env.local` to `.gitignore` if not already there

### 1.3 Firebase Project Setup
- [x] ~~Initialize Firebase in your project: `firebase init`~~
  - ~~Select Authentication, Firestore, Storage~~
  - ~~Use default options for database rules~~
  - *Note: Services configured directly through Firebase Console instead*
- [x] Configure Firebase Authentication
  - [x] Enable Email/Password authentication in Firebase Console
  - [ ] (Optional) Enable Google authentication
  - [x] Set up password reset email template
- [x] Set up Firestore Database
  - [x] Create initial collections structure (users, stories)
  - [x] Configure security rules
- [x] Configure Firebase Storage
  - [x] Set up storage bucket for images
  - [x] Configure security rules for storage

## Phase 2: Frontend Configuration

### 2.1 Firebase Integration
- [x] Verify Firebase config in your app matches your project
- [x] Implement Firebase initialization in `src/lib/firebase.ts`:
  ```typescript
  import { initializeApp } from 'firebase/app';
  import { getAuth } from 'firebase/auth';
  import { getFirestore } from 'firebase/firestore';
  import { getStorage } from 'firebase/storage';

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  };

  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app);
  export const storage = getStorage(app);
  ```

### 2.2 Authentication Implementation
- [x] Create authentication context in `src/contexts/AuthContext.tsx`
- [x] Implement sign up functionality
- [x] Implement login functionality
- [x] Implement password reset
- [x] Add protected routes for authenticated users
- [x] Remove guest access mode (decided not to implement)

### 2.3 Logo & Branding
- [x] Add logo to `public/` directory
- [x] Update logo references in components
- [x] Add logo to the login page
- [x] Add logo to the header
- [x] Set logo as favicon
- [ ] Ensure consistent brand colors across components

## Phase 3: Core Functionality

### 3.1 Image Upload Component
- [ ] Create image upload and preview component
- [ ] Implement drag & drop functionality
- [ ] Add file validation (size, type)
- [ ] Create pre-upload image compression/resizing function
- [ ] Implement Firebase Storage upload function

### 3.2 Genre Selection
- [ ] Build genre selection UI component
- [ ] Create state management for genre selection
- [ ] Add visual feedback for selected genre
- [ ] Implement genre descriptions/tooltips

### 3.3 OpenAI Integration
- [ ] Create backend API route for OpenAI: `src/app/api/generate-story/route.ts`
- [ ] Implement image content analysis with GPT-4.1 Vision API
- [ ] Create genre-specific prompt templates
- [ ] Implement story generation function
- [ ] Add error handling and retry logic

### 3.4 Story Display
- [ ] Create story display component
- [ ] Implement loading states during generation
- [ ] Add story formatting and styling
- [ ] Create save to favorites functionality
- [ ] Implement share functionality

## Phase 4: User Features

### 4.1 User Profile
- [x] Create profile page component (SettingsPage)
- [x] Implement profile picture upload & update
- [ ] Add user display name management
- [x] Create account settings page
- [ ] Implement account deletion

### 4.2 Favorites Management
- [ ] Create favorites collection in Firestore
- [ ] Implement favorites CRUD operations
- [ ] Build favorites display in drawer component
- [ ] Add filtering/sorting options for favorites
- [ ] Implement delete functionality

### 4.3 Drawer Component
- [ ] Create slide-out drawer component
- [ ] Add user profile summary section
- [ ] Implement favorites list
- [ ] Add settings and logout functionality
- [ ] Create smooth open/close animations

## Phase 5: Optimization & Testing

### 5.1 Performance Optimization
- [ ] Implement lazy loading for components
- [ ] Add image optimization
- [ ] Set up proper caching strategies
- [ ] Optimize API calls with React Query
- [ ] Add skeleton loaders for better UX

### 5.2 Testing
- [ ] Write unit tests for core components
- [ ] Test authentication flows
- [ ] Test story generation with various images
- [ ] Perform cross-browser testing
- [ ] Test on various mobile devices

### 5.3 Error Handling
- [ ] Implement global error boundary
- [ ] Add user-friendly error messages
- [ ] Create fallback UI for failed states
- [ ] Add logging for critical errors
- [ ] Implement retry mechanisms for API calls

## Phase 6: Deployment

### 6.1 Vercel Setup
- [ ] Create Vercel account if needed
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Login to Vercel: `vercel login`

### 6.2 Environment Configuration
- [ ] Add environment variables to Vercel project:
  - All Firebase config variables
  - OpenAI API key
  - Any other secrets
- [ ] Configure build settings

### 6.3 Deployment
- [ ] Run build locally to verify: `npm run build`
- [ ] Deploy to Vercel: `vercel`
- [ ] Set up custom domain (if applicable)
- [ ] Configure SSL certificate

### 6.4 Post-Deployment
- [ ] Verify authentication flows in production
- [ ] Test story generation in production
- [ ] Monitor error rates and performance
- [ ] Set up usage alerts for OpenAI API
- [ ] Create backup and restoration plan

## Phase 7: Launch & Monitoring

### 7.1 Analytics Setup
- [ ] Set up Google Analytics or Firebase Analytics
- [ ] Configure key event tracking
- [ ] Create custom conversion events
- [ ] Set up dashboards for monitoring

### 7.2 Continuous Integration
- [ ] Set up GitHub Actions for CI/CD
- [ ] Configure automated testing
- [ ] Establish pull request review process
- [ ] Create staging environment

### 7.3 Documentation
- [ ] Update README with setup instructions
- [ ] Document API endpoints
- [ ] Create user guide/instructions
- [ ] Document known issues and limitations

### 7.4 Feedback System
- [ ] Implement user feedback mechanism
- [ ] Create bug reporting process
- [ ] Set up feedback collection and analysis
- [ ] Establish feature request tracking

## Resources

### API References
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

### Environment Setup
- Development: `.env.local` for local environment variables
- Production: Vercel environment variables
- Test: `.env.test` for testing environment

### Security Checklist
- [ ] Verify Firebase security rules
- [ ] Ensure proper authentication flows
- [ ] Check API key restrictions
- [ ] Implement rate limiting
- [ ] Set up monitoring for unusual activity

### Performance Targets
- Initial page load: < 2 seconds
- Time to interactive: < 3 seconds
- Story generation: < 15 seconds
- Image upload: < 5 seconds
