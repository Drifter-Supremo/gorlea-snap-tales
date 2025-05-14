import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import * as GlobalAudio from '@/services/globalAudioService';

interface AudioPlayerProps {
  audioUrl: string;
  onEnded?: () => void;
}

/**
 * Simplified AudioPlayer component that uses the global audio service
 * This ensures audio playback continues regardless of component re-renders
 */
const SimpleAudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, onEnded }) => {
  // UI state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();

  // Initialize the audio player
  useEffect(() => {
    console.log("AudioPlayer initializing with URL:", audioUrl);
    let isMounted = true;

    const initializeAudio = async () => {
      try {
        // Set the audio source
        await GlobalAudio.setAudioSource(audioUrl);

        // Set the onEnded callback
        GlobalAudio.setOnEnded(() => {
          if (isMounted) {
            setIsPlaying(false);
            setCurrentTime(0);
            if (onEnded) onEnded();
          }
        });

        // Update the duration
        setDuration(GlobalAudio.getDuration());

        // Update the playing state to match the global audio state
        setIsPlaying(GlobalAudio.getIsPlaying());

        setHasError(false);

        // If we're already playing, make sure the UI reflects that
        if (GlobalAudio.getIsPlaying()) {
          setIsPlaying(true);
        }
      } catch (error) {
        console.error("Error initializing audio:", error);
        if (isMounted) {
          setHasError(true);
          // Don't show toast to avoid interrupting playback
          console.error("Failed to load audio:", error);
        }
      }
    };

    initializeAudio();

    // Set up a timer to update the current time display
    const timer = setInterval(() => {
      if (!isMounted) return;

      // Always update current time regardless of play state
      setCurrentTime(GlobalAudio.getCurrentTime());

      // Make sure our play state matches the global audio state
      const globalIsPlaying = GlobalAudio.getIsPlaying();
      if (isPlaying !== globalIsPlaying) {
        setIsPlaying(globalIsPlaying);
      }

      // Update duration in case it wasn't available initially
      const globalDuration = GlobalAudio.getDuration();
      if (duration !== globalDuration && globalDuration > 0) {
        setDuration(globalDuration);
      }
    }, 250); // Update 4 times per second for smoother UI

    // Clean up
    return () => {
      isMounted = false;
      clearInterval(timer);
      // Note: We don't clean up the global audio here to ensure playback continues
    };
  }, [audioUrl, onEnded, toast, isPlaying, duration]);

  // Toggle play/pause
  const togglePlayPause = async () => {
    if (hasError) return;

    try {
      console.log("User clicked play/pause button");

      if (isPlaying) {
        console.log("Pausing audio");
        GlobalAudio.pause();
        setIsPlaying(false);
      } else {
        console.log("Starting audio playback");
        await GlobalAudio.play();
        setIsPlaying(true);

        // Force an immediate UI update
        setCurrentTime(GlobalAudio.getCurrentTime());
      }
    } catch (error) {
      console.error("Error toggling playback:", error);
      setHasError(true);
      // Don't show toast to avoid interrupting playback
      console.error("Failed to play audio:", error);
    }
  };

  // Handle time change (seek)
  const handleTimeChange = (value: number[]) => {
    if (hasError) return;

    try {
      const newTime = value[0];
      GlobalAudio.setCurrentTime(newTime);
      setCurrentTime(newTime);
    } catch (error) {
      console.error("Error setting time:", error);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (hasError) return;

    try {
      GlobalAudio.setMuted(!isMuted);
      setIsMuted(!isMuted);
    } catch (error) {
      console.error("Error toggling mute:", error);
    }
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    if (hasError) return;

    try {
      const newVolume = value[0];
      GlobalAudio.setVolume(newVolume);
      setVolume(newVolume);

      if (newVolume === 0) {
        GlobalAudio.setMuted(true);
        setIsMuted(true);
      } else if (isMuted) {
        GlobalAudio.setMuted(false);
        setIsMuted(false);
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

export default SimpleAudioPlayer;
