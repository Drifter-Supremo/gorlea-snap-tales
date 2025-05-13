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

We've created simplified genre-specific prompts to guide the AI in generating shorter, simpler stories that match the selected genre:

- **Rom-Com**: "Write a short, simple romantic comedy story based on this image. The story should be fun, sweet, and have a happy ending. Look carefully at what's in the image - people, animals, places, or things. Base your story directly on what you see."
- **Horror**: "Write a short, simple scary story based on this image. The story should be spooky but not too frightening. Look carefully at what's in the image - people, animals, places, or things. Base your story directly on what you see."
- **Sci-Fi**: "Write a short, simple science fiction story based on this image. The story should be about future technology, space, or something imaginary. Look carefully at what's in the image - people, animals, places, or things. Base your story directly on what you see."
- **Film-Noir**: "Write a short, simple detective story based on this image. The story should have a mystery to solve. Look carefully at what's in the image - people, animals, places, or things. Base your story directly on what you see."

### OpenAI API Call with Image Analysis

The OpenAI API is called with the following parameters, properly formatted to enable image analysis:

```typescript
const completion = await openai.chat.completions.create({
  model: "gpt-4.1-2025-04-14", // Using the latest GPT-4.1 model with vision capabilities
  messages: [
    {
      role: "system",
      content: "You are Gorlea, a creative storyteller who specializes in writing engaging short stories in various genres. Your stories should be SHORT (300-500 words maximum), with simple language that's easy to read and understand. Use everyday vocabulary and short sentences. Avoid complex words, technical jargon, or overly flowery descriptions."
    },
    {
      role: "user",
      content: [
        { type: "text", text: genrePrompts[genre] },
        {
          type: "image_url",
          image_url: {
            url: imageUrl,
            detail: "high" // Request high detail analysis
          }
        },
        {
          type: "text",
          text: "Please generate a SHORT story (300-500 words maximum) with a simple, easy-to-read title. Use simple language that a middle-school student could easily understand. Make sure your story accurately reflects what's in the image, including the people, setting, clothing, and other visual elements."
        }
      ]
    }
  ],
  max_tokens: 1000, // Reduced token limit for shorter stories
  temperature: 1.0, // Slightly lower temperature for more coherent output
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

## Image Requirements

For optimal story generation, images uploaded to Gorlea Snaps must meet the following requirements:

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

These requirements are enforced through frontend validation in the ImageUploader component and backend validation in the storyGenerator service.

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

## Recent Improvements

1. **Proper Image Analysis**: Updated the API call format to properly enable GPT-4.1's vision capabilities
2. **Simplified Stories**: Modified prompts and system instructions to generate shorter, simpler stories (300-500 words)
3. **Improved Image Relevance**: Added explicit instructions to ensure stories accurately reflect the visual elements in the uploaded images
4. **Simplified Language**: Instructed the AI to use simpler vocabulary and sentence structures suitable for middle-school reading level

## Future Considerations

1. **User Preferences**: Allow users to customize the story generation with additional parameters (e.g., story length, complexity level)
2. **Caching**: Implement caching to avoid regenerating stories for the same image and genre
3. **Fallback Mechanism**: Create a fallback to pre-written stories if the OpenAI API is unavailable
4. **Content Moderation**: Add content moderation to ensure appropriate stories
5. **Performance Optimization**: Monitor and optimize token usage for cost efficiency
