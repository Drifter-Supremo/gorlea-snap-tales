# OpenAI Integration for Story Generation

This document outlines the implementation of OpenAI's GPT-4.1 for story generation in the Gorlea Snaps application.

## Overview

We've integrated OpenAI's GPT-4.1 model to generate creative stories based on user-uploaded images and selected genres. This replaces the previous mock story generation with dynamic, AI-generated content that responds to the visual input.

## Implementation Details

### New Files Created

1. `src/lib/openai.ts` - A utility file that initializes the OpenAI client with the API key
2. `.env.openai` - Environment file containing the OpenAI API key

### Files Modified

1. `src/services/storyGenerator.ts` - Updated to use the OpenAI API for story generation

### OpenAI Client Setup

The OpenAI client is initialized in `src/lib/openai.ts`:

```typescript
import OpenAI from 'openai';

// In Vite applications, environment variables must be prefixed with VITE_
// to be exposed to client-side code
const apiKey = import.meta.env.VITE_OPENAI_API_KEY ||
               import.meta.env.NEXT_PUBLIC_OPENAI_API_KEY;

// Initialize the OpenAI client with the API key
// SECURITY NOTE: Using dangerouslyAllowBrowser: true is not recommended for production
// Ideally, API requests should be proxied through a backend server
const openai = new OpenAI({
  apiKey: apiKey as string,
  maxRetries: 3, // Retry up to 3 times on transient errors
  dangerouslyAllowBrowser: true, // Required for browser environments
});

// Log API key status (without exposing the actual key)
if (!apiKey) {
  console.warn("⚠️ OpenAI API key is missing. Story generation will not work.");
  console.info("Please add your OpenAI API key to .env or .env.local as VITE_OPENAI_API_KEY");
} else {
  console.log("✅ OpenAI API key found");
}

export default openai;
```

### Story Generation Process

The story generation process now follows these steps:

1. Validate user inputs (image file, genre, user ID)
2. Upload the image to Firebase Storage
3. Generate a genre-specific prompt for the OpenAI API
4. Call the OpenAI API with the image URL and prompt
5. Parse the response to extract the title and content
6. Save the story to the database

### Genre-Specific Prompts

We've created genre-specific prompts to guide the AI in generating stories that match the selected genre:

- **Rom-Com**: "Write a romantic comedy short story based on this image. The story should be heartwarming, humorous, and have a happy ending. Include vivid descriptions, engaging dialogue, and a charming meet-cute scenario."
- **Horror**: "Write a horror short story based on this image. The story should be suspenseful, eerie, and unsettling. Include atmospheric descriptions, a sense of dread, and an unexpected twist ending."
- **Sci-Fi**: "Write a science fiction short story based on this image. The story should include futuristic technology, thought-provoking concepts, and a sense of wonder. Focus on creative world-building and an intriguing premise."
- **Film-Noir**: "Write a film noir style detective story based on this image. The story should have a gritty, cynical tone, morally ambiguous characters, and a mysterious plot. Include atmospheric descriptions of urban settings and hard-boiled dialogue."

### OpenAI API Call

The OpenAI API is called with the following parameters:

```typescript
const completion = await openai.chat.completions.create({
  model: "gpt-4.1-2025-04-14", // Using the latest GPT-4.1 model
  messages: [
    {
      role: "system",
      content: "You are a creative storyteller who specializes in writing engaging short stories in various genres. Your stories should be approximately 1000-1500 words, with vivid descriptions, compelling characters, and satisfying plots."
    },
    {
      role: "user",
      content: `${genrePrompts[genre]} The image URL is: ${imageUrl}. Please also generate an appropriate title for the story.`
    }
  ],
  max_tokens: 2000,
  temperature: 1.5, // High temperature for maximum creativity and diversity
});
```

### Response Parsing

The response from the OpenAI API is parsed to extract the title and content:

```typescript
// Extract the story content and title from the response
const response = completion.choices[0].message.content;

// Parse the title from the response (assuming the title is on the first line)
const lines = response.split('\n');
let title = lines[0];

// Remove any markdown formatting or quotes from the title
title = title.replace(/^#\s+/, '').replace(/^"(.+)"$/, '$1').replace(/^Title:\s+/, '').trim();

// Remove the title from the content
let content = response.substring(response.indexOf('\n')).trim();
```

### Error Handling

We've implemented comprehensive error handling to provide user-friendly error messages:

```typescript
try {
  // Story generation code
} catch (error) {
  console.error("Error generating story:", error);

  // Provide more specific error messages based on the error
  if (error.message && error.message.includes("Firebase Storage")) {
    console.error("Firebase Storage upload error details:", error);
    throw new Error(`Image upload failed: ${error.message}`);
  } else if (error.message && error.message.includes("No image file") || error.message.includes("No valid file")) {
    throw new Error("Please upload an image to generate a story");
  } else if (error.message && error.message.includes("No genre")) {
    throw new Error("Please select a genre to generate a story");
  } else if (error.message && error.message.includes("OpenAI")) {
    console.error("OpenAI API error details:", error);
    throw new Error(`Story generation failed: ${error.message}`);
  } else {
    throw new Error(`Failed to generate story: ${error.message}`);
  }
}
```

## Security Considerations

1. **API Key Security**: The OpenAI API key is stored in environment files (`.env`, `.env.local`, `.env.openai`) that are excluded from version control via `.gitignore`.
2. **Environment Variables**: The API key is accessed via Vite's environment variables system (`import.meta.env.VITE_OPENAI_API_KEY`) to avoid hardcoding sensitive information.
3. **Vite Prefix**: In Vite applications, environment variables must be prefixed with `VITE_` to be exposed to client-side code.
4. **Fallback Mechanism**: The code includes a fallback to check for both `VITE_OPENAI_API_KEY` and `NEXT_PUBLIC_OPENAI_API_KEY` for backward compatibility.

## Testing Notes

To test the OpenAI integration:

1. Create a new story by uploading an image and selecting a genre
2. Verify that the AI generates a unique story based on the image and genre
3. Check that the story has an appropriate title and content
4. Test with different images and genres to ensure variety in the generated stories

## Future Considerations

1. **Image Analysis**: Enhance the prompts to include more specific details about the image content
2. **User Preferences**: Allow users to customize the story generation with additional parameters
3. **Caching**: Implement caching to avoid regenerating stories for the same image and genre
4. **Fallback Mechanism**: Create a fallback to pre-written stories if the OpenAI API is unavailable
5. **Content Moderation**: Add content moderation to ensure appropriate stories
