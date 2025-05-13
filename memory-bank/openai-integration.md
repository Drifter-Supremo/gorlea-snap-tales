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

We've completely revamped our genre-specific prompts to guide the AI in generating more intense, creative stories with high stakes and unexpected twists. While still maintaining formatting requirements, we've shifted from simple stories to powerful narratives:

- **Rom-Com**: "Create an INTENSE romantic comedy story inspired by this image. While rom-coms are typically light, yours should have HIGH STAKES and UNEXPECTED TWISTS. Use the people, setting, and objects in the image as a starting point, but then take the story in surprising directions. If you see people, imagine their complex romantic histories, secret desires, or unexpected connections. If it's a location, envision what life-changing romantic encounter could happen there. Include: 1) A powerful attraction or conflict between characters, 2) A seemingly insurmountable obstacle to love, 3) A surprising twist that changes everything, 4) Genuine emotional depth beneath the humor. Make the reader feel both laughter and heartache. Use proper dialogue formatting with quotation marks. Ensure perfect grammar and logical consistency."

- **Horror**: "Create a TERRIFYING horror story inspired by this image. Your story should be deeply unsettling with HIGH STAKES and SHOCKING REVELATIONS. Use the people, setting, and objects in the image as a foundation, but then build a nightmare around them. If you see people, imagine what horrific situations they might encounter or what dark secrets they might harbor. If it's a location, envision what unspeakable events could unfold there. Include: 1) An atmosphere of mounting dread, 2) A threat that feels genuinely dangerous or supernatural, 3) A twist that reveals something worse than the reader imagined, 4) Visceral descriptions that make the horror feel real. Make the reader feel genuine fear. Use proper dialogue formatting with quotation marks. Ensure perfect grammar and logical consistency."

- **Sci-Fi**: "Create a MIND-BENDING science fiction story inspired by this image. Your story should feature REVOLUTIONARY CONCEPTS and REALITY-ALTERING REVELATIONS. Use the people, setting, and objects in the image as a starting point, but then launch into extraordinary speculative territory. If you see people, imagine how advanced technology might transform their existence or what cosmic truths they might discover. If it's a location, envision how it might exist in a radically different future or alternate reality. Include: 1) A speculative concept that challenges our understanding of reality, 2) High-stakes consequences that extend beyond individual characters, 3) A profound revelation that changes everything we thought we knew, 4) Vivid descriptions of futuristic or alien elements. Make the reader's mind expand with wonder. Use proper dialogue formatting with quotation marks. Ensure perfect grammar and logical consistency."

- **Film-Noir**: "Create a GRIPPING detective noir story inspired by this image. Your story should feature DEADLY STAKES and SHOCKING BETRAYALS. Use the people, setting, and objects in the image as initial clues, but then weave a complex web of deception around them. If you see people, imagine what dangerous secrets they might be hiding or what desperate situations they might be trapped in. If it's a location, envision what crimes or conspiracies might be concealed there. Include: 1) A morally complex protagonist facing impossible choices, 2) A mystery with layers of deception, 3) A twist that reveals a betrayal or hidden truth, 4) Atmospheric descriptions that evoke tension and shadow. Make the reader feel the weight of corruption and danger. Use proper dialogue formatting with quotation marks. Ensure perfect grammar and logical consistency."

### OpenAI API Call with Image Analysis

The OpenAI API is called with the following parameters, properly formatted to enable image analysis:

```typescript
const completion = await openai.chat.completions.create({
  model: "gpt-4.1-2025-04-14", // Using the latest GPT-4.1 model with vision capabilities
  messages: [
    {
      role: "system",
      content: "You are Gorlea, a master storyteller known for creating INTENSE, MIND-BLOWING short stories that leave readers stunned. You specialize in crafting powerful narratives with unexpected twists, high stakes, and emotional impact. Your stories should be SHORT (300-500 words) but POWERFUL, using vivid language that creates strong imagery. While you should keep vocabulary accessible, don't shy away from evocative descriptions that bring your stories to life. Your stories must have a clear beginning that hooks the reader, a middle that raises the stakes dramatically, and an ending with a powerful twist or revelation that changes everything. You are a creative genius who uses images as INSPIRATION rather than strict templates. When shown an image, extract the key elements (people, setting, objects, mood) but then BUILD BEYOND what's literally shown to create something extraordinary. If you see people in an image, imagine their secret motivations, hidden pasts, or unexpected futures. If you see a location, envision what dramatic events could unfold there. Every story should contain: 1) High stakes (life/death, profound change, shocking discovery), 2) Intense emotion (fear, love, wonder, desperation), 3) A twist or revelation that readers won't see coming. FORMATTING RULES: Write in plain text only. NO markdown formatting. NO asterisks or dashes. Use commas, periods, or line breaks instead. Format dialogue properly with quotation marks. Use proper grammar and ensure logical consistency. Create clear paragraphs with simple line breaks. Write titles that are intriguing but contain no special characters."
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
          text: "Create a SHORT but POWERFUL story (300-500 words) with an intriguing title that will grab the reader's attention. While keeping the language accessible, use vivid descriptions and strong imagery to make your story come alive. Use the image as INSPIRATION rather than a strict template. Identify the key elements in the image (people, setting, objects, mood) but then BUILD BEYOND what's literally shown to create something extraordinary with HIGH STAKES and UNEXPECTED TWISTS. Your story MUST include: 1) A compelling hook that draws readers in immediately, 2) A dramatic escalation of tension or stakes in the middle, 3) A powerful twist or revelation at the end that changes everything. FORMATTING REQUIREMENTS: Use plain text only with NO markdown formatting. NO asterisks or dashes. Use proper quotation marks for dialogue. Ensure perfect grammar and logical consistency throughout. Format paragraphs with simple line breaks. Write your title without special characters."
        }
      ]
    }
  ],
  max_tokens: 1000, // Reduced token limit for shorter stories
  temperature: 1.0, // Balanced temperature for creativity with coherence
  presence_penalty: 0.6, // Encourage the model to introduce new concepts
  frequency_penalty: 0.3, // Reduce repetition of the same phrases
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

1. **Complete Prompt Overhaul**: Completely redesigned all prompts to focus on creating intense, mind-blowing stories with high stakes and unexpected twists
2. **Image as Inspiration**: Changed approach from using images as strict templates to using them as creative inspiration for more imaginative storytelling
3. **Enhanced Narrative Structure**: Added requirements for compelling hooks, dramatic escalation, and powerful twist endings
4. **Vivid Language**: Encouraged more evocative descriptions and stronger imagery while keeping language accessible
5. **Genre-Specific Intensity**: Tailored each genre prompt to emphasize high stakes and emotional impact appropriate to that genre
6. **Improved Formatting Instructions**: Enhanced formatting guidelines with emphasis on proper dialogue formatting and grammatical consistency
7. **Advanced Parameter Tuning**: Added presence_penalty (0.6) and frequency_penalty (0.3) to encourage more diverse and creative language
8. **Enhanced Formatting Requirements**: Strengthened formatting instructions with explicit, repeated warnings to ABSOLUTELY NEVER use dashes or hyphens
9. **Reduced Temperature**: Adjusted temperature from 1.5 to 1.0 to balance creativity with logical coherence
10. **First-Person Narration**: Added specific instruction for film noir genre to use first-person narration

## Future Considerations

1. **User Preferences**: Allow users to customize the story generation with additional parameters (e.g., story length, complexity level)
2. **Caching**: Implement caching to avoid regenerating stories for the same image and genre
3. **Fallback Mechanism**: Create a fallback to pre-written stories if the OpenAI API is unavailable
4. **Content Moderation**: Add content moderation to ensure appropriate stories
5. **Performance Optimization**: Monitor and optimize token usage for cost efficiency
