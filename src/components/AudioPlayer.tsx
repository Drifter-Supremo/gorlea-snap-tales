import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AudioPlayerProps {
  audioUrl: string;
  onEnded?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, onEnded }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Keep track of the last played position to prevent unexpected resets
  const lastPositionRef = useRef<number>(0);
  const isUserInteractionRef = useRef<boolean>(false);

  // Use a ref to track if this is the first render
  const isInitialRender = useRef<boolean>(true);

  // Store the audio URL in a ref to detect changes
  const previousUrlRef = useRef<string>(audioUrl);

  useEffect(() => {
    // Check if the URL has changed
    const urlChanged = previousUrlRef.current !== audioUrl;
    previousUrlRef.current = audioUrl;

    // If this is not the initial render and the URL hasn't changed,
    // don't recreate the audio element to preserve playback state
    if (!isInitialRender.current && !urlChanged && audioRef.current) {
      console.log("Skipping audio element recreation - URL unchanged");
      return;
    }

    // Mark that we've passed the initial render
    isInitialRender.current = false;

    // Create or recreate audio element
    let audio: HTMLAudioElement;

    // If we already have an audio element and the URL changed, clean it up first
    if (audioRef.current && urlChanged) {
      console.log("URL changed, cleaning up previous audio element");
      audioRef.current.pause();
      audioRef.current.src = '';
      // Reset state
      lastPositionRef.current = 0;
      setCurrentTime(0);
    }

    // Create a new audio element
    audio = new Audio();
    audioRef.current = audio;

    // Set up event listeners
    const handleLoadedMetadata = () => {
      console.log("Audio metadata loaded, duration:", audio.duration);
      setDuration(audio.duration);
      setHasError(false);
    };

    const handleTimeUpdate = () => {
      // Only update the time if it's a reasonable change
      // This prevents unexpected resets to 0
      const newTime = audio.currentTime;

      // If the time jumps backward significantly and it's not due to user interaction,
      // it might be a bug - ignore it
      if (!isUserInteractionRef.current &&
          lastPositionRef.current > 1 &&
          newTime < lastPositionRef.current - 1 &&
          newTime < 1) {
        console.warn("Detected unexpected time reset, ignoring", {
          lastPosition: lastPositionRef.current,
          newTime
        });

        // Try to restore the position
        try {
          audio.currentTime = lastPositionRef.current;
        } catch (e) {
          console.error("Failed to restore position:", e);
        }
        return;
      }

      // Update the last position reference
      lastPositionRef.current = newTime;
      setCurrentTime(newTime);

      // Reset the user interaction flag
      isUserInteractionRef.current = false;
    };

    const handleEnded = () => {
      console.log("Audio playback ended");
      setIsPlaying(false);
      setCurrentTime(0);
      lastPositionRef.current = 0;
      if (onEnded) onEnded();
    };

    const handleError = (e: Event) => {
      const error = e as ErrorEvent;
      console.error("Audio error:", error, audio.error);
      setHasError(true);
      setIsPlaying(false);

      // Get more specific error information if available
      let errorMessage = "There was a problem playing the audio. Please try again.";
      if (audio.error) {
        switch (audio.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = "Playback aborted by the user.";
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = "Network error occurred while loading the audio.";
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = "Audio decoding error. The file may be corrupted.";
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = "Audio format not supported by your browser.";
            break;
        }
      }

      toast({
        title: "Audio playback error",
        description: errorMessage,
        variant: "destructive",
      });
    };

    const handleCanPlay = () => {
      console.log("Audio can play now");
    };

    const handleSeeking = () => {
      console.log("Audio seeking to:", audio.currentTime);
    };

    const handleSeeked = () => {
      console.log("Audio seeked to:", audio.currentTime);
      lastPositionRef.current = audio.currentTime;
    };

    const handleProgress = () => {
      // Check if the audio has buffered enough data
      if (audio.buffered.length > 0) {
        const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
        const duration = audio.duration;
        console.log(`Audio buffered: ${Math.round(bufferedEnd / duration * 100)}%`);
      }
    };

    // Add event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('seeking', handleSeeking);
    audio.addEventListener('seeked', handleSeeked);
    audio.addEventListener('progress', handleProgress);

    // Set audio properties
    audio.preload = "auto";

    // Set the source after adding event listeners
    console.log("Setting audio source:", audioUrl);

    // Check if we're already using this URL to prevent unnecessary reloads
    if (audio.src !== audioUrl) {
      audio.src = audioUrl;
      audio.load();
    } else {
      console.log("Audio source unchanged, skipping reload");
    }

    // Clean up
    return () => {
      // If the component is unmounting (not just due to URL change), clean up the audio element
      if (audioRef.current === audio) {
        console.log("Cleaning up audio player on unmount");
        audio.pause();
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('seeking', handleSeeking);
        audio.removeEventListener('seeked', handleSeeked);
        audio.removeEventListener('progress', handleProgress);
        audio.src = '';

        // Don't revoke the URL here, as it might be needed elsewhere
        // The StoryPage component should handle URL cleanup
      } else {
        console.log("Skipping cleanup - audio element has been replaced");
      }
    };
  }, [audioUrl, onEnded, toast]);

  const togglePlayPause = () => {
    if (!audioRef.current || hasError) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Play with error handling
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
        setHasError(true);
        toast({
          title: "Playback failed",
          description: "Unable to play audio. This may be due to browser restrictions or a network issue.",
          variant: "destructive",
        });
      });
    }
  };

  const handleTimeChange = (value: number[]) => {
    if (!audioRef.current || hasError) return;

    try {
      const newTime = value[0];

      // Mark this as a user interaction to prevent the reset detection from triggering
      isUserInteractionRef.current = true;

      // Update our position tracking
      lastPositionRef.current = newTime;

      // Set the new time on the audio element
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);

      console.log("User changed time to:", newTime);
    } catch (error) {
      console.error("Error setting time:", error);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current || hasError) return;

    try {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    } catch (error) {
      console.error("Error toggling mute:", error);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current || hasError) return;

    try {
      const newVolume = value[0];
      audioRef.current.volume = newVolume;
      setVolume(newVolume);

      if (newVolume === 0) {
        setIsMuted(true);
        audioRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    } catch (error) {
      console.error("Error changing volume:", error);
    }
  };

  // Format time as mm:ss
  const formatTime = (time: number) => {
    if (!isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex flex-col space-y-2 w-full bg-gorlea-secondary p-3 rounded-md border border-gorlea-tertiary">
      {hasError ? (
        <div className="flex items-center justify-center p-2 text-red-400">
          <AlertCircle size={18} className="mr-2" />
          <span className="text-sm">Audio playback error. Please try again.</span>
        </div>
      ) : (
        <>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gorlea-text hover:text-gorlea-accent hover:bg-gorlea-tertiary"
              onClick={togglePlayPause}
              disabled={hasError}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </Button>

            <div className="flex-1">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={0.1}
                onValueChange={handleTimeChange}
                className="cursor-pointer"
                disabled={hasError}
              />
            </div>

            <div className="text-xs text-gorlea-text/70 w-16 text-right">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gorlea-text hover:text-gorlea-accent hover:bg-gorlea-tertiary"
              onClick={toggleMute}
              disabled={hasError}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </Button>

            <div className="w-20">
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="cursor-pointer"
                disabled={hasError}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AudioPlayer;
