# Gorlea Snaps - AI Story Generator
## Project Brief

### Project Overview
Gorlea Snaps is a mobile-first web application that generates AI stories based on uploaded photos. Users can upload an image, select a genre, and receive a custom story generated by GPT 4.1 based on the content of their photo.

### Business Goals
- Create an engaging application that leverages AI technology to generate personalized stories
- Build a user-friendly mobile-first experience
- Establish a foundation for potential future monetization
- Create share-worthy content to drive organic growth

### Target Audience
- Mobile users interested in creative AI applications
- Photography enthusiasts looking to add narrative to their images
- Social media users who enjoy sharing creative content
- Casual readers looking for short, personalized fiction

### Core Features

#### User Experience
- User authentication (login/signup, guest access)
- Image upload with preview functionality
- Genre selection (Rom-Com, Horror, Sci-Fi, Film Noir)
- AI story generation
- Save stories to favorites
- Share stories on social media
- Mobile-first responsive design

#### Technical Architecture

**Frontend:**
- React.js with TypeScript
- Tailwind CSS for styling
- Shadcn UI components
- React Router for navigation
- React Query for data handling
- Lucide React for icons

**Backend:**
- Firebase Authentication for user management
- Firebase Storage for image uploads and hosting
- Firestore for database requirements
- Cloud Functions for serverless API endpoints
- GPT 4.1 API integration for story generation

### Database Schema

**Users Collection**
```
users/{userId}
├── email: string
├── displayName: string
├── photoURL: string (optional)
├── createdAt: timestamp
└── preferences: {
    └── defaultGenre: string (optional)
}
```

**Stories Collection**
```
stories/{storyId}
├── userId: string (reference to users)
├── title: string
├── content: string
├── genre: string
├── imageUrl: string
├── createdAt: timestamp
├── isPublic: boolean
└── tags: array (optional)
```

**Favorites Collection**
```
favorites/{favoriteId}
├── userId: string (reference to users)
├── storyId: string (reference to stories)
└── createdAt: timestamp
```

### Firebase Integration Points

1. **Authentication Service**
   - Firebase Authentication for email/password login
   - Anonymous authentication for guest access
   - Social login options (Google, optional)

2. **Storage Service**
   - Firebase Storage for image uploads
   - Security rules to protect user data
   - Image optimization with Cloud Functions

3. **Database Service**
   - Firestore for storing user data, stories, and favorites
   - Real-time updates for user favorites
   - Query optimization for story retrieval

4. **Cloud Functions**
   - Image processing triggers on upload
   - GPT 4.1 API integration for story generation
   - Scheduled tasks for maintenance

### GPT 4.1 Integration

1. **Image Analysis Flow**
   - Upload image to Firebase Storage
   - Generate signed URL for GPT 4.1 access
   - Process image through Cloud Function with GPT 4.1 Vision capabilities
   - Extract scene description, objects, mood, and context

2. **Story Generation**
   - Craft detailed prompts based on image analysis and selected genre
   - Dynamic prompt engineering specific to each genre
   - Control parameters for story length and style
   - Parse and format response for optimal presentation

3. **Example Prompt Template**
```
You are an expert storyteller. Create a {genre} story based on the following image:
[Image URL or base64]

Focus on these elements detected in the image:
- Main subjects: {subjects}
- Setting: {setting}
- Mood: {mood}
- Notable objects: {objects}

Create a compelling {genre} story with these characteristics:
- Title: Create an intriguing title related to the image
- Length: 500-800 words
- Structure: Well-formed paragraphs with a clear beginning, middle, and end
- Style: {genre-specific style instructions}

For {genre}, incorporate these elements:
{genre_specific_instructions}
```

### API Endpoints (Cloud Functions)

1. **Authentication Functions**
   - `/createUser` - User registration hook
   - `/updateUserProfile` - Profile management

2. **Image Processing Functions**
   - `/uploadImage` - Process uploaded images
   - `/analyzeImage` - Extract content with GPT 4.1 Vision

3. **Story Functions**
   - `/generateStory` - Create story from image and genre
   - `/getUserStories` - Retrieve user's stories
   - `/saveStory` - Save generated story
   - `/toggleFavorite` - Add/remove from favorites

4. **Sharing Functions**
   - `/createShareableLink` - Generate public link
   - `/getPublicStory` - Retrieve publicly shared story

### Security Considerations

1. **Authentication Security**
   - Proper Firebase Authentication implementation
   - Session management and token handling
   - Password policies and recovery flows

2. **Data Security**
   - Firestore security rules to enforce access controls
   - Storage security rules for image access
   - Validation of all user inputs

3. **API Security**
   - Secure API key management for GPT 4.1
   - Rate limiting on story generation
   - Request validation and sanitization

### Performance Optimizations

1. **Image Handling**
   - Client-side image compression before upload
   - Server-side image optimization
   - Efficient storage and delivery via Firebase Storage

2. **Story Generation**
   - Caching of similar story requests
   - Asynchronous generation with status updates
   - Optimize GPT 4.1 prompts for response time

3. **Application Performance**
   - Implement code splitting in React
   - Optimize Firestore queries with proper indexing
   - Implement service worker for offline capabilities

### Development Roadmap

**Phase 1: MVP Development**
- Basic authentication setup
- Image upload functionality
- Simple genre selection
- GPT 4.1 integration for story generation
- Basic story display and management

**Phase 2: Feature Enhancement**
- User profiles and preferences
- Favorites system
- Improved story formatting
- Additional genres
- Social sharing capabilities

**Phase 3: Advanced Features**
- Multi-image story generation
- User feedback and rating system
- Custom character development
- Collections and organization features
- Advanced sharing options

### Success Metrics

1. **User Engagement**
   - Number of stories generated
   - Return user rate
   - Time spent reading stories

2. **Growth Metrics**
   - New user signups
   - Social shares
   - Organic traffic growth

3. **Technical Metrics**
   - Story generation success rate
   - Average story generation time
   - Application performance metrics

### Budget Considerations

1. **Firebase Costs**
   - Authentication: Free tier for initial development
   - Firestore: Pay-as-you-go based on reads/writes
   - Storage: Pay-as-you-go based on storage size and downloads
   - Cloud Functions: Pay-as-you-go based on invocations and execution time

2. **GPT 4.1 API Costs**
   - Input tokens for prompts and images
   - Output tokens for generated stories
   - Consider implementing token optimization strategies

3. **Development Costs**
   - Frontend development time
   - Backend integration time
   - Testing and quality assurance

### References and Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [OpenAI GPT-4 API Documentation](https://platform.openai.com/docs/guides/gpt)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com)

This project brief provides a comprehensive foundation for setting up the Gorlea Snaps application using GPT 4.1 for AI story generation and Firebase for authentication, storage, and database services.
