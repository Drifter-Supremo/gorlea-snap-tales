/**
 * Global Audio Service
 *
 * This service creates a single, persistent audio instance that exists outside
 * of React's component lifecycle. This ensures that audio playback continues
 * regardless of component re-renders or UI changes.
 */

// Create a single global audio instance that persists across the entire app
const globalAudio = new Audio();

// Set default properties
globalAudio.preload = "auto";

// Track playback state
let isPlaying = false;

// Add more debug logging
console.log("Global audio service initialized");

// Initialize event listeners
globalAudio.addEventListener('ended', () => {
  console.log("Global audio playback ended");
  isPlaying = false;
  if (onEndedCallback) {
    onEndedCallback();
  }
});

// Add more event listeners for debugging
globalAudio.addEventListener('play', () => {
  console.log("Global audio play event triggered");
  isPlaying = true;
});

globalAudio.addEventListener('pause', () => {
  console.log("Global audio pause event triggered");
  isPlaying = false;
});

globalAudio.addEventListener('error', (e) => {
  console.error("Global audio error:", e);
  isPlaying = false;
});

// Callback for when audio ends
let onEndedCallback: (() => void) | null = null;

/**
 * Set the audio source
 * @param url The URL of the audio to play
 * @returns Promise that resolves when the audio is loaded and ready to play
 */
const setAudioSource = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // If we're already using this URL, don't reload
    if (globalAudio.src === url && globalAudio.readyState >= 2) {
      console.log("Audio source unchanged, skipping reload");
      resolve();
      return;
    }

    console.log("Setting global audio source:", url);

    // Set up event listeners for loading
    const onCanPlay = () => {
      console.log("Global audio can play now");
      globalAudio.removeEventListener('canplay', onCanPlay);
      globalAudio.removeEventListener('error', onError);
      resolve();
    };

    const onError = (e: Event) => {
      console.error("Global audio error:", e, globalAudio.error);
      globalAudio.removeEventListener('canplay', onCanPlay);
      globalAudio.removeEventListener('error', onError);
      reject(new Error(globalAudio.error ? `Audio error: ${globalAudio.error.code}` : "Audio format not supported"));
    };

    // Add temporary event listeners
    globalAudio.addEventListener('canplay', onCanPlay);
    globalAudio.addEventListener('error', onError);

    // Set a timeout in case the events never fire
    const timeoutId = setTimeout(() => {
      globalAudio.removeEventListener('canplay', onCanPlay);
      globalAudio.removeEventListener('error', onError);
      reject(new Error("Audio loading timed out"));
    }, 10000);

    // Clear the timeout when the audio can play or errors out
    const clearTimer = () => {
      clearTimeout(timeoutId);
    };

    globalAudio.addEventListener('canplay', clearTimer, { once: true });
    globalAudio.addEventListener('error', clearTimer, { once: true });

    // Set the source and load the audio
    globalAudio.src = url;
    globalAudio.load();
  });
};

/**
 * Play the audio
 * @returns Promise that resolves when playback starts
 */
const play = async (): Promise<void> => {
  console.log("Global audio play called");
  try {
    await globalAudio.play();
    isPlaying = true;
    console.log("Global audio playback started successfully");
  } catch (error) {
    console.error("Error playing global audio:", error);
    isPlaying = false;
    throw error;
  }
};

/**
 * Pause the audio
 */
const pause = (): void => {
  console.log("Global audio pause called");
  globalAudio.pause();
  isPlaying = false;
};

/**
 * Get the current playback state
 * @returns True if the audio is currently playing
 */
const getIsPlaying = (): boolean => {
  return isPlaying;
};

/**
 * Get the current time of the audio
 * @returns The current time in seconds
 */
const getCurrentTime = (): number => {
  return globalAudio.currentTime;
};

/**
 * Set the current time of the audio
 * @param time The time to seek to in seconds
 */
const setCurrentTime = (time: number): void => {
  globalAudio.currentTime = time;
};

/**
 * Get the duration of the audio
 * @returns The duration in seconds
 */
const getDuration = (): number => {
  return globalAudio.duration || 0;
};

/**
 * Set the volume of the audio
 * @param volume The volume level (0-1)
 */
const setVolume = (volume: number): void => {
  globalAudio.volume = volume;
};

/**
 * Set the muted state of the audio
 * @param muted Whether the audio should be muted
 */
const setMuted = (muted: boolean): void => {
  globalAudio.muted = muted;
};

/**
 * Set the callback to be called when the audio ends
 * @param callback The function to call when the audio ends
 */
const setOnEnded = (callback: () => void): void => {
  onEndedCallback = callback;
};

/**
 * Clean up the audio (stop playback and clear the source)
 */
const cleanup = (): void => {
  pause();
  globalAudio.src = '';
  onEndedCallback = null;
};

export {
  setAudioSource,
  play,
  pause,
  getIsPlaying,
  getCurrentTime,
  setCurrentTime,
  getDuration,
  setVolume,
  setMuted,
  setOnEnded,
  cleanup
};
