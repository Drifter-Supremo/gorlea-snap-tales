
# Gorlea Snaps - AI Story Generator

A mobile-first web application that generates AI stories based on uploaded photos. Users can upload an image, select a genre, and receive a custom story based on the content of their photo.

## Features

- User authentication (login/signup)
- Profile picture upload and management
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

### Backend Requirements (Future Implementation)
- Authentication service (e.g., Firebase Auth, Auth0, or custom)
- Image upload and storage (e.g., Firebase Storage, AWS S3)
- Database for user data and stories (e.g., Firestore, MongoDB)
- AI integration for story generation

## Backend Architecture

To implement the backend for this application, the following components are needed:

1. **Authentication Service**
   - User registration, login, and account management
   - JWT or session-based auth
   - Password reset functionality
   - Social login options (optional)

2. **Image Processing Service**
   - Image upload endpoint
   - Compression/resizing
   - Storage with secure access
   - Image metadata extraction for AI context

3. **Story Generation Service**
   - OpenAI GPT or similar integration
   - Prompt engineering based on image content and selected genre
   - Story formatting and structure

4. **Database Schema**
   - Users collection
     - id
     - email
     - name
     - profilePicture
     - createdAt
   - Stories collection
     - id
     - userId (owner)
     - title
     - content
     - genre
     - imageUrl
     - createdAt
   - Favorites collection (or field in Users)
     - userId
     - storyId
     - createdAt

5. **API Endpoints**
   - `/api/auth` - Authentication endpoints
   - `/api/upload` - Image upload handling
   - `/api/stories` - Story CRUD operations
   - `/api/favorites` - Favorite management

## API Integration Guide

### Authentication API

```javascript
// Example authentication integration
async function login(email, password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  return response.json();
}

async function register(email, password, name) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  });

  return response.json();
}
```

### Story Generation API

```javascript
// Example story generation integration
async function generateStory(imageFile, genre, userId) {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('genre', genre);
  formData.append('userId', userId);

  const response = await fetch('/api/stories/generate', {
    method: 'POST',
    body: formData
  });

  return response.json();
}

async function getStories(userId) {
  const response = await fetch(`/api/stories/user/${userId}`);
  return response.json();
}
```

### Image Upload API

```javascript
// Example image upload integration
async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  return response.json();
}
```

## AI Story Generation

For the AI story generation component, you'll need to:

1. Extract relevant information from the uploaded image using:
   - Image classification (Google Cloud Vision, AWS Rekognition)
   - Object detection
   - Scene description

2. Create a prompt for the AI based on:
   - Image content description
   - Selected genre
   - Desired story length and structure

3. Generate the story using:
   - OpenAI's GPT API or similar LLM
   - Custom prompt engineering for each genre
   - Post-processing to format the response

Example prompt template:

```
You are an expert storyteller. Create a {genre} story based on the following image description:
{image_description}
The story should have a compelling title, be approximately 500-800 words, and include well-formed paragraphs.
For {genre}, focus on {genre_specific_instructions}.
```

## Security Considerations

1. Implement proper authentication with JWT or sessions
2. Use secure storage for images with access controls
3. Rate limit the AI story generation API
4. Validate and sanitize all user inputs
5. Use HTTPS for all API communications
6. Implement proper CORS policies
7. Securely store API keys for third-party services

## Scaling Considerations

1. Cache popular or recent stories
2. Implement a CDN for image delivery
3. Consider serverless architecture for the AI generation component
4. Use a job queue for asynchronous story generation
5. Implement database indexing for performance
6. Consider read replicas for database scaling

## Future Enhancements

1. Additional story genres
2. User feedback and rating system
3. AI fine-tuning based on user preferences
4. Multi-image story generation
5. Audio narration of stories
6. Custom character development
7. Social sharing integrations
8. Story collections and organization

This README provides a comprehensive guide for implementing the backend services required to support the Gorlea Snaps frontend application.
