import openai from '@/lib/openai';

// Maximum text length for TTS to avoid API limitations
const MAX_TEXT_LENGTH = 4000;

/**
 * Checks if the browser supports MP3 audio format
 * @returns A boolean indicating if MP3 is supported
 */
export const checkAudioSupport = (): boolean => {
  const audio = document.createElement('audio');

  // Check if the browser supports the audio element
  if (!audio.canPlayType) {
    console.warn("Browser doesn't support HTML5 audio");
    return false;
  }

  // Check for MP3 support
  const canPlayMP3 = audio.canPlayType('audio/mpeg') !== '';

  if (!canPlayMP3) {
    console.warn("Browser doesn't support MP3 audio format");
  }

  return canPlayMP3;
};

/**
 * Generates speech from text using OpenAI's text-to-speech API
 *
 * @param text - The text to convert to speech
 * @param voice - The voice to use (default: 'nova')
 * @param instructions - Optional instructions for speech generation
 * @returns A Promise that resolves to an audio blob
 */
export const generateSpeech = async (
  text: string,
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' | 'coral' = 'nova',
  instructions?: string
): Promise<Blob> => {
  try {
    // Validate API key
    if (!openai.apiKey) {
      console.error("OpenAI API key is missing");
      throw new Error("OpenAI API key is missing. Please check your environment variables.");
    }

    // Trim text if it's too long to avoid API limitations
    const trimmedText = text.length > MAX_TEXT_LENGTH
      ? text.substring(0, MAX_TEXT_LENGTH) + "..."
      : text;

    console.log(`Generating speech for text (${trimmedText.length} chars) with voice: ${voice}`);

    // Default instructions based on content type if none provided
    const defaultInstructions = "Speak in a clear, engaging storytelling voice with appropriate emotion for the content. Maintain a moderately fast pace throughout the narration, about 20% faster than your default speed, while still ensuring clarity and proper emphasis.";

    // Call OpenAI's text-to-speech API with timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      // Call OpenAI's text-to-speech API
      const mp3Response = await openai.audio.speech.create({
        model: "gpt-4o-mini-tts",
        voice,
        input: trimmedText,
        instructions: instructions || defaultInstructions,
        response_format: "mp3", // Explicitly set format
      }, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Convert the response to a blob
      const buffer = await mp3Response.arrayBuffer();
      console.log("Successfully generated speech, creating audio blob");

      // Create a blob with explicit MIME type and proper encoding
      const blob = new Blob([buffer], {
        type: 'audio/mpeg'
      });

      // Verify blob size
      console.log(`Created blob with size: ${blob.size} bytes`);

      // Return a copy of the blob to ensure it's not affected by garbage collection
      return new Blob([await blob.arrayBuffer()], { type: 'audio/mpeg' });
    } catch (apiError) {
      clearTimeout(timeoutId);
      throw apiError;
    }
  } catch (error) {
    console.error("Error generating speech:", error);

    // Check for specific error types
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error("Speech generation timed out. Please try again.");
      }
      if (error.message.includes("port closed")) {
        throw new Error("Connection interrupted. Please try again.");
      }
    }

    throw new Error(`Failed to generate speech: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Creates an audio element and plays the provided audio blob
 *
 * @param audioBlob - The audio blob to play
 * @returns The audio element that's playing the audio
 */
export const playAudio = (audioBlob: Blob): HTMLAudioElement => {
  // Create a URL for the blob
  const audioUrl = URL.createObjectURL(audioBlob);

  // Create an audio element
  const audioElement = new Audio(audioUrl);

  // Play the audio
  audioElement.play().catch(error => {
    console.error("Error playing audio:", error);
  });

  // Clean up the URL when the audio is done playing
  audioElement.onended = () => {
    URL.revokeObjectURL(audioUrl);
  };

  return audioElement;
};
