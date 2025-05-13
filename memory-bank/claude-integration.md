# Claude Integration for Story Generation

This document outlines the implementation of Anthropic's Claude 3.7 Sonnet for story generation in the Gorlea Snaps application.

## Overview

We've integrated Claude 3.7 Sonnet to generate creative stories based on user-uploaded images and selected genres. This replaces the previous OpenAI GPT-4.1 implementation with Claude's more advanced storytelling capabilities.

## Implementation Details

### New Files Created

1. `src/lib/claude.ts` - A utility file that initializes the Anthropic client with the API key
2. `.env.claude` - Environment file containing the Claude API key
3. `src/services/claudeStoryGenerator.ts` - Service that handles story generation using Claude

### Files Modified

1. `src/services/storyGenerator.ts` - Updated to use Claude instead of OpenAI

### Claude Client Setup

The Claude client is initialized in `src/lib/claude.ts`:

```typescript
import Anthropic from '@anthropic-ai/sdk';

// Initialize the Anthropic client with the API key
const apiKey = import.meta.env.VITE_CLAUDE_API_KEY ||
               import.meta.env.NEXT_PUBLIC_CLAUDE_API_KEY;

// Log API key status (without exposing the actual key)
if (!apiKey) {
  console.warn("⚠️ Claude API key is missing. Story generation will not work.");
  console.info("Please add your Claude API key to .env or .env.local as VITE_CLAUDE_API_KEY");
} else {
  console.log("✅ Claude API key found");
}

// Initialize the Anthropic client with the API key
// SECURITY NOTE: Using dangerouslyAllowBrowser: true is not recommended for production
// Ideally, API requests should be proxied through a backend server
const claude = new Anthropic({
  apiKey: apiKey as string,
  dangerouslyAllowBrowser: true, // Required for browser environments
});

// Add authentication headers explicitly
const authenticatedClaude = {
  ...claude,
  messages: {
    ...claude.messages,
    create: async (params: any) => {
      // Ensure we're using the correct authentication method
      return claude.messages.create({
        ...params,
        headers: {
          ...params.headers,
          'X-Api-Key': apiKey,
          'anthropic-version': '2023-06-01', // Make sure we're using a supported API version
        },
      });
    },
  },
};

export default authenticatedClaude;
```

### Story Generation Process

The story generation process follows these steps:

1. Validate user inputs (image file, genre, user ID)
2. Upload the image to Firebase Storage
3. Generate a genre-specific prompt for the Claude API
4. Call the Claude API with the image URL and prompt
5. Parse the response to extract the title and content
6. Save the story to the database

### Genre-Specific Prompts

We've maintained the same genre-specific prompts that were developed for OpenAI, but they now work with Claude 3.7 Sonnet:

- **Rom-Com**: "Create an INTENSE romantic comedy story inspired by this image. While rom-coms are typically light, yours should have HIGH STAKES and UNEXPECTED TWISTS. Use the people, setting, and objects in the image as a starting point, but then take the story in surprising directions. If you see people, imagine their complex romantic histories, secret desires, or unexpected connections. If it's a location, envision what life-changing romantic encounter could happen there. Include: 1) A powerful attraction or conflict between characters, 2) A seemingly insurmountable obstacle to love, 3) A surprising twist that changes everything, 4) Genuine emotional depth beneath the humor. Make the reader feel both laughter and heartache. CRITICAL FORMATTING: ABSOLUTELY NO DASHES OR HYPHENS ANYWHERE IN YOUR TEXT. Use commas, periods, or line breaks instead. Use proper dialogue formatting with quotation marks. Ensure perfect grammar and logical consistency."

- **Horror**: "Create a TERRIFYING horror story inspired by this image. Your story should be deeply unsettling with HIGH STAKES and SHOCKING REVELATIONS. Use the people, setting, and objects in the image as a foundation, but then build a nightmare around them. If you see people, imagine what horrific situations they might encounter or what dark secrets they might harbor. If it's a location, envision what unspeakable events could unfold there. Include: 1) An atmosphere of mounting dread, 2) A threat that feels genuinely dangerous or supernatural, 3) A twist that reveals something worse than the reader imagined, 4) Visceral descriptions that make the horror feel real. Make the reader feel genuine fear. CRITICAL FORMATTING: ABSOLUTELY NO DASHES OR HYPHENS ANYWHERE IN YOUR TEXT. Use commas, periods, or line breaks instead. Use proper dialogue formatting with quotation marks. Ensure perfect grammar and logical consistency."

- **Sci-Fi**: "Create a MIND-BENDING science fiction story inspired by this image. Your story should feature REVOLUTIONARY CONCEPTS and REALITY-ALTERING REVELATIONS. Use the people, setting, and objects in the image as a starting point, but then launch into extraordinary speculative territory. If you see people, imagine how advanced technology might transform their existence or what cosmic truths they might discover. If it's a location, envision how it might exist in a radically different future or alternate reality. Include: 1) A speculative concept that challenges our understanding of reality, 2) High-stakes consequences that extend beyond individual characters, 3) A profound revelation that changes everything we thought we knew, 4) Vivid descriptions of futuristic or alien elements. Make the reader's mind expand with wonder. CRITICAL FORMATTING: ABSOLUTELY NO DASHES OR HYPHENS ANYWHERE IN YOUR TEXT. Use commas, periods, or line breaks instead. Use proper dialogue formatting with quotation marks. Ensure perfect grammar and logical consistency."

- **Film-Noir**: "Create a GRIPPING detective noir story inspired by this image. Your story should feature DEADLY STAKES and SHOCKING BETRAYALS. Use the people, setting, and objects in the image as initial clues, but then weave a complex web of deception around them. If you see people, imagine what dangerous secrets they might be hiding or what desperate situations they might be trapped in. If it's a location, envision what crimes or conspiracies might be concealed there. IMPORTANT: Write in FIRST PERSON from the perspective of a hard-boiled detective or protagonist. Include: 1) A morally complex protagonist facing impossible choices, 2) A mystery with layers of deception, 3) A twist that reveals a betrayal or hidden truth, 4) Atmospheric descriptions that evoke tension and shadow. Make the reader feel the weight of corruption and danger. CRITICAL FORMATTING: ABSOLUTELY NO DASHES OR HYPHENS ANYWHERE IN YOUR TEXT. Use commas, periods, or line breaks instead. Use proper dialogue formatting with quotation marks. Ensure perfect grammar and logical consistency throughout. The story must make complete logical sense."

### Claude API Call with Image Analysis

The Claude API is called with the following parameters, properly formatted to enable image analysis:

```typescript
const completion = await claude.messages.create({
  model: "claude-3-7-sonnet-20250219", // Using Claude 3.7 Sonnet with correct model name
  max_tokens: 1000, // Limit token output for shorter stories
  temperature: 1.0, // Balanced temperature for creativity with coherence
  system: "You are Gorlea, a master storyteller known for creating INTENSE, MIND-BLOWING short stories that leave readers stunned. You specialize in crafting powerful narratives with unexpected twists, high stakes, and emotional impact. Your stories should be SHORT (300-500 words) but POWERFUL, using vivid language that creates strong imagery. While you should keep vocabulary accessible, don't shy away from evocative descriptions that bring your stories to life. Your stories must have a clear beginning that hooks the reader, a middle that raises the stakes dramatically, and an ending with a powerful twist or revelation that changes everything. You are a creative genius who uses images as INSPIRATION rather than strict templates. When shown an image, extract the key elements (people, setting, objects, mood) but then BUILD BEYOND what's literally shown to create something extraordinary. If you see people in an image, imagine their secret motivations, hidden pasts, or unexpected futures. If you see a location, envision what dramatic events could unfold there. Every story should contain: 1) High stakes (life/death, profound change, shocking discovery), 2) Intense emotion (fear, love, wonder, desperation), 3) A twist or revelation that readers won't see coming. CRITICAL REQUIREMENTS: Your stories MUST maintain perfect logical consistency throughout. Events must follow a clear cause-and-effect relationship. Characters must behave in ways that make sense given their motivations. The plot must be coherent from beginning to end with no contradictions or confusing elements. STRICT FORMATTING RULES: 1) ABSOLUTELY NO DASHES OR HYPHENS ANYWHERE IN YOUR TEXT. 2) Instead of dashes, use commas, periods, or line breaks. 3) Write in plain text only with NO markdown formatting. 4) NO asterisks or special characters. 5) Format dialogue properly with quotation marks. 6) Use proper grammar. 7) Create clear paragraphs with simple line breaks. 8) Write titles that are intriguing but contain no special characters.",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: genrePrompts[genre] + "\n\nCreate a SHORT but POWERFUL story (300-500 words) with an intriguing title that will grab the reader's attention. While keeping the language accessible, use vivid descriptions and strong imagery to make your story come alive. Use the image as INSPIRATION rather than a strict template. Identify the key elements in the image (people, setting, objects, mood) but then BUILD BEYOND what's literally shown to create something extraordinary with HIGH STAKES and UNEXPECTED TWISTS. Your story MUST include: 1) A compelling hook that draws readers in immediately, 2) A dramatic escalation of tension or stakes in the middle, 3) A powerful twist or revelation at the end that changes everything. STRICT FORMATTING REQUIREMENTS: 1) ABSOLUTELY NO DASHES OR HYPHENS ANYWHERE IN YOUR TEXT. 2) Instead of dashes, use commas, periods, or line breaks. 3) Use plain text only with NO markdown formatting. 4) NO asterisks or special characters. 5) Use proper quotation marks for dialogue. 6) Ensure perfect grammar and logical consistency throughout. 7) Format paragraphs with simple line breaks. 8) Write your title without special characters."
        },
        {
          type: "image",
          source: {
            type: "url",
            url: imageUrl
          }
        }
      ]
    }
  ]
});
```

### Response Parsing

The response from the Claude API is parsed to extract the title and content:

```typescript
// Extract the story content and title from the response
if (!completion.content || !completion.content[0] || completion.content[0].type !== 'text') {
  console.error("Unexpected response format from Claude:", completion);
  throw new Error("Invalid response from Claude API");
}

const textBlock = completion.content[0] as { type: 'text', text: string };
const response = textBlock.text;
console.log("Story generated successfully with Claude");

// Parse the title from the response (assuming the title is on the first line)
const lines = response.split('\n');
let title = lines[0];

// Remove any markdown formatting or quotes from the title
title = title.replace(/^#\s+/, '').replace(/^"(.+)"$/, '$1').replace(/^Title:\s+/, '').trim();

// Remove the title from the content
let content = response.substring(response.indexOf('\n')).trim();
```

## Why Claude 3.7 Sonnet?

We switched from OpenAI's GPT-4.1 to Claude 3.7 Sonnet for the following reasons:

1. **Superior Creative Writing**: Claude 3.7 Sonnet is specifically noted for its creative writing capabilities, with better narrative coherence and emotional depth
2. **Improved Consistency**: Claude maintains better consistency throughout longer narratives
3. **Better Instruction Following**: Claude is better at following specific formatting instructions (like avoiding dashes)
4. **Nuanced Tone and Empathy**: Claude generates more emotionally resonant prose, making it ideal for character-driven stories
5. **Multimodal Capabilities**: Claude 3.7 Sonnet has robust image analysis capabilities, allowing it to understand and incorporate visual elements into stories

## Security Considerations

1. **API Key Security**: The Claude API key is stored in environment files (`.env`, `.env.local`, `.env.claude`) that are excluded from version control via `.gitignore`.
2. **Environment Variables**: The API key is accessed via Vite's environment variables system (`import.meta.env.VITE_CLAUDE_API_KEY`) to avoid hardcoding sensitive information.
3. **Vite Prefix**: In Vite applications, environment variables must be prefixed with `VITE_` to be exposed to client-side code.
4. **Fallback Mechanism**: The code includes a fallback to check for both `VITE_CLAUDE_API_KEY` and `NEXT_PUBLIC_CLAUDE_API_KEY` for backward compatibility.

## Troubleshooting

### Authentication Issues

If you encounter authentication errors like:
```
Error generating story: Error: Could not resolve authentication method. Expected either apiKey or authToken to be set. Or for one of the "X-Api-Key" or "Authorization" headers to be explicitly omitted
```

Or header-related errors like:
```
BadRequestError: 400 {"type":"invalid_request_error","message":"headers: Extra inputs are not permitted"}
```

Check the following:

1. Ensure the Claude API key is correctly set in the environment files (`.env`, `.env.local`, or `.env.claude`)
2. Verify that the API key is being properly loaded in the `claude.ts` file
3. Use the standard Anthropic client without custom header modifications
4. Check that the model name format is correct (e.g., `claude-3-7-sonnet-20250219`)
5. Ensure the Anthropic SDK version is compatible with the API version being used

The current implementation uses the standard Anthropic client:
```typescript
const claude = new Anthropic({
  apiKey: apiKey as string,
  dangerouslyAllowBrowser: true, // Required for browser environments
});

export default claude;
```

## Testing Notes

To test the Claude integration:

1. Create a new story by uploading an image and selecting a genre
2. Verify that Claude generates a unique story based on the image and genre
3. Check that the story has an appropriate title and content
4. Test with different images and genres to ensure variety in the generated stories
5. Verify that the stories do not contain dashes or other formatting issues

## Future Considerations

1. **User Preferences**: Allow users to customize the story generation with additional parameters (e.g., story length, complexity level)
2. **Caching**: Implement caching to avoid regenerating stories for the same image and genre
3. **Fallback Mechanism**: Create a fallback to pre-written stories if the Claude API is unavailable
4. **Content Moderation**: Add content moderation to ensure appropriate stories
5. **Performance Optimization**: Monitor and optimize token usage for cost efficiency
