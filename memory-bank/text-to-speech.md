# Text-to-Speech Narration Feature

This document outlines the implementation of text-to-speech narration in the Gorlea Snaps application using OpenAI's GPT-4o mini TTS model.

## Overview

We've integrated OpenAI's GPT-4o mini TTS model to provide high-quality narration of generated stories. This feature allows users to listen to their stories with voice narration that adapts to the genre and content of the story.

## Recent Updates

The text-to-speech feature has been enhanced with the following improvements:

1. **Improved Error Handling**:
   - Added timeout handling for API requests
   - Implemented better error messages for different failure scenarios
   - Added validation for API key format

2. **Text Length Management**:
   - Added a maximum text length limit to prevent API failures
   - Implemented text trimming for very long stories

3. **Enhanced Audio Player**:
   - Added error state display in the audio player
   - Improved event handling for audio errors
   - Added proper cleanup of audio resources

4. **User Experience Improvements**:
   - Added more informative toast notifications
   - Improved loading state feedback
   - Added validation of audio before playback

## Implementation Details

### New Files Created

1. `src/services/textToSpeechService.ts` - A utility file that handles text-to-speech generation using OpenAI's API
2. `src/components/AudioPlayer.tsx` - A reusable audio player component with playback controls

### Files Modified

1. `src/pages/StoryPage.tsx` - Updated to include a narration button and audio player
2. `src/components/StoryPageSkeleton.tsx` - Updated to include a placeholder for the narration button

### OpenAI TTS Integration

The text-to-speech functionality is implemented using OpenAI's GPT-4o mini TTS model, which provides high-quality voice synthesis. The implementation includes:

1. A button next to the story title to trigger narration
2. Genre-specific voice instructions for better performance
3. Using the "Nova" voice for all narrations
4. An audio player with play/pause, time scrubbing, and volume controls

### Voice Selection

As requested, we're using the "Nova" voice for all narrations, regardless of genre. This provides a consistent voice experience across the application.

### Genre-Specific Instructions

To enhance the narration quality, we've implemented genre-specific instructions for the TTS model:

#### Romantic Comedy
```
Narrate this romantic comedy with a warm, upbeat tone. Use a playful, light-hearted voice with subtle variations for different characters. Emphasize emotional moments with appropriate pauses and inflections. Deliver humorous lines with perfect timing and a hint of a smile in your voice.
```

#### Horror
```
Narrate this horror story with a tense, suspenseful tone. Start with a measured pace that gradually becomes more urgent during frightening scenes. Use a hushed, slightly raspy quality for creepy moments. Create an atmosphere of dread with strategic pauses and occasional whispers. Lower your pitch slightly for ominous descriptions.
```

#### Science Fiction
```
Narrate this science fiction story with a clear, precise tone. Use a sense of wonder and awe when describing futuristic technology or alien worlds. Maintain a confident, authoritative voice for technical explanations. For action sequences, increase your pace slightly while keeping clarity. Create distinct vocal patterns for different characters, especially non-human ones.
```

#### Film Noir
```
Narrate this film noir story with a smooth, slightly cynical tone. Use a deliberate, measured pace with dramatic pauses. Since this is first-person narration, adopt a world-weary, seen-it-all quality. Lower your register slightly for that classic noir detective feel. Emphasize hard consonants and elongate key words for dramatic effect. For dialogue, create subtle distinctions between characters without overacting.
```

## User Experience

From a user perspective, the feature works as follows:

1. After a story is generated, a speaker icon appears next to the story title
2. Clicking the icon generates the audio narration (with a loading indicator)
3. Once generated, an audio player appears above the story text
4. The user can play/pause, scrub through the timeline, and adjust volume
5. The audio player disappears when the narration ends or when the user navigates away

## Technical Implementation

### Text-to-Speech Service

The core functionality is implemented in `src/services/textToSpeechService.ts`:

```typescript
import openai from '@/lib/openai';

export const generateSpeech = async (
  text: string,
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' | 'coral' = 'nova',
  instructions?: string
): Promise<Blob> => {
  try {
    // Call OpenAI's text-to-speech API
    const mp3Response = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice,
      input: text,
      instructions: instructions || defaultInstructions,
    });

    // Convert the response to a blob
    const buffer = await mp3Response.arrayBuffer();
    return new Blob([buffer], { type: 'audio/mpeg' });
  } catch (error) {
    console.error("Error generating speech:", error);
    throw new Error(`Failed to generate speech: ${error instanceof Error ? error.message : String(error)}`);
  }
};
```

### Audio Player Component

A custom audio player component was created in `src/components/AudioPlayer.tsx` to provide a consistent and user-friendly playback experience.

## Security Considerations

1. The OpenAI API key is stored in environment variables and not exposed to the client
2. API key format validation is performed to ensure proper configuration
3. Audio generation happens on-demand to minimize API usage
4. Error handling is implemented to gracefully handle API failures
5. Request timeouts prevent hanging connections
6. Text length limits prevent excessive API usage

## Audio Storage Implementation

To improve the user experience and reduce unnecessary API calls, we've implemented audio storage in Firebase:

1. **Audio Storage Structure**:
   - Audio files are stored in Firebase Storage at path: `/audio/{userId}/{storyId}/{timestamp}_narration.mp3`
   - Metadata is stored in Firestore in the `audio` collection with the story ID as the document ID

2. **Key Features**:
   - Audio is automatically saved when a story is in the user's favorites
   - Audio is automatically retrieved when viewing a favorited story
   - Audio is automatically deleted when a story is removed from favorites
   - Fallback to local blob URLs for non-favorited stories

3. **Benefits**:
   - Reduces OpenAI API usage by reusing generated audio
   - Improves load times for returning users
   - Provides persistent audio across sessions and devices
   - Automatically manages storage to prevent accumulation of unused files

## Future Enhancements

1. ✅ Caching generated audio to reduce API calls (Implemented)
2. Adding more voice options for user selection
3. Implementing partial narration for longer stories
4. Adding speed controls for playback
5. Supporting different languages for narration

## Testing Notes

To test the text-to-speech feature:

1. Generate a story by uploading an image and selecting a genre
2. View the generated story and click the speaker icon next to the title
3. Wait for the audio to be generated (a loading spinner will appear)
4. Use the audio player controls to play, pause, and adjust volume
5. Test with different genres to hear the different narration styles

## Troubleshooting

If you encounter issues with the text-to-speech feature:

1. **Audio Not Playing**:
   - Check the browser console for error messages
   - Verify that the OpenAI API key is correctly set in the environment variables
   - Ensure the API key starts with "sk-" and is valid
   - Try with a shorter story (under 4000 characters)
   - Check your internet connection

2. **Audio Player Shows Error**:
   - Click the narration button again to retry
   - Refresh the page and try again
   - Check if your browser supports the audio format

3. **API Key Issues**:
   - Ensure the OpenAI API key is set in the .env.local file
   - Verify the key has permissions for the text-to-speech API
   - Check for any billing issues with your OpenAI account

4. **Firebase Storage Issues**:
   - Verify Firebase Storage rules allow read/write access for authenticated users
   - Check that the Firestore security rules allow access to the `audio` collection
   - Ensure the user is properly authenticated before attempting to access stored audio
   - Check browser console for CORS-related errors

5. **Cached Audio Not Loading**:
   - Try removing the story from favorites and adding it back
   - Check the Firebase console to verify the audio file exists
   - Verify the URL in the Firestore document is accessible
   - Try clearing browser cache and reloading the page
